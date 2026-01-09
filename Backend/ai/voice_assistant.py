import speech_recognition as sr
import pyttsx3
from flask import Flask, request, jsonify
import dateparser
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from google.oauth2 import service_account
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# PostgreSQL Connection
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

# Text-to-speech setup
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
    try:
        return recognizer.recognize_google(audio)
    except:
        return None

# Google Calendar Setup
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'credentials.json'

try:
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=credentials)
    CALENDAR_ID = 'primary'
except Exception as e:
    print(f"⚠️ Google Calendar setup failed: {e}")
    service = None

def create_google_calendar_event(appointment):
    if not service:
        return "Calendar integration unavailable"
        
    try:
        # Parse date and time safely
        start_datetime = datetime.strptime(f"{appointment['date']} {appointment['time']}", "%Y-%m-%d %I:%M %p")
        end_datetime = start_datetime + timedelta(minutes=30)

        event = {
            'summary': f"Appointment with Dr. {appointment['doctor_name']}",
            'description': f"Purpose: {appointment['purpose']}.",
            'start': {
                'dateTime': start_datetime.isoformat(),
                'timeZone': 'Asia/Kolkata',
            },
            'end': {
                'dateTime': end_datetime.isoformat(),
                'timeZone': 'Asia/Kolkata',
            },
        }
        event_result = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
        return event_result.get('htmlLink')
    except Exception as e:
        print(f"Error creating calendar event: {e}")
        return "Failed to create calendar event"

def get_student_id():
    # Since this is a local voice assistant without login, we need a way to identify the user.
    # For now, we'll fetch the first student found in the DB.
    # In a real app, you'd probably hardcode a specific ID or ask for identification.
    conn = get_db_connection()
    if not conn: return None
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE role = 'student' LIMIT 1")
            user = cur.fetchone()
            return user['id'] if user else None
    finally:
        conn.close()

def book_appointment_flow():
    speak("Please tell me the doctor's name.")
    doctor_name = None
    while not doctor_name:
        response = listen()
        if response:
            doctor_name = response
        else:
            speak("I didn't catch that. Please tell me the doctor's name again.")

    # Look up doctor
    conn = get_db_connection()
    if not conn:
        speak("Database connection failed.")
        return None
        
    doctor_id = None
    real_doctor_name = None
    
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM users WHERE role = 'doctor' AND name ILIKE %s", (f"%{doctor_name}%",))
            doctors = cur.fetchall()
            if not doctors:
                speak(f"I couldn't find a doctor named {doctor_name}.")
                return None
            elif len(doctors) > 1:
                speak(f"I found multiple doctors named {doctor_name}. I will book with {doctors[0]['name']}.")
                doctor_id = doctors[0]['id']
                real_doctor_name = doctors[0]['name']
            else:
                doctor_id = doctors[0]['id']
                real_doctor_name = doctors[0]['name']
    finally:
        conn.close()

    speak("What is the purpose of your appointment?")
    purpose = None
    while not purpose:
        response = listen()
        if response:
            purpose = response
        else:
            speak("Sorry, please repeat the purpose of your appointment.")

    speak("On which date would you like to book the appointment? You can say 14 April or 14.04.2025.")
    appointment_date = None
    while not appointment_date:
        response = listen()
        if response:
            parsed_date = dateparser.parse(response)
            if parsed_date:
                appointment_date = parsed_date.date()
            else:
                speak("Sorry, I couldn't understand the date. Please say it again.")
        else:
            speak("Sorry, please repeat the date.")

    speak("At what time would you like to schedule the appointment?")
    appointment_time = None
    while not appointment_time:
        response = listen()
        if response:
            try:
                parsed_time = dateparser.parse(response)
                if parsed_time:
                    time_obj = parsed_time.time()
                    if time_obj >= datetime.strptime("10:00", "%H:%M").time() and time_obj < datetime.strptime("18:00", "%H:%M").time():
                        if time_obj >= datetime.strptime("13:00", "%H:%M").time() and time_obj < datetime.strptime("14:00", "%H:%M").time():
                            speak("Sorry, 1 PM to 2 PM is lunch break. Please choose another time.")
                        else:
                            appointment_time = parsed_time.strftime("%I:%M %p")
                    else:
                        speak("Appointments are only available between 10 AM and 6 PM. Please choose a valid time.")
                else:
                    speak("Sorry, I couldn't understand the time. Please say it again.")
            except:
                speak("Sorry, I couldn't understand the time. Please say it again.")
        else:
            speak("Sorry, I didn't get that. Please tell the time again.")

    student_id = get_student_id()
    if not student_id:
        speak("Could not identify a student account to book this appointment.")
        return None

    # Save to DB
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Format datetime for DB
            slot_date_time_str = f"{appointment_date} {appointment_time}"
            slot_date_time = datetime.strptime(slot_date_time_str, "%Y-%m-%d %I:%M %p")

            # Check availability
            cur.execute("""
                SELECT id FROM appointments 
                WHERE doctor_id = %s AND slot_date_time = %s
            """, (doctor_id, slot_date_time))
            if cur.fetchone():
                speak("Sorry, that slot is already booked.")
                return None

            # Insert Appointment
            cur.execute("""
                INSERT INTO appointments (student_id, doctor_id, slot_date_time, status)
                VALUES (%s, %s, %s, 'pending')
                RETURNING id
            """, (student_id, doctor_id, slot_date_time))
            appointment_id = cur.fetchone()['id']

            # Update Doctor Slots (Optional, if you want to track slots explicitly)
            cur.execute("""
                INSERT INTO doctor_slots (doctor_id, date_time, is_booked)
                VALUES (%s, %s, TRUE)
                ON CONFLICT DO NOTHING
            """, (doctor_id, slot_date_time))
            
            conn.commit()
            
            appointment_details = {
                "doctor_name": real_doctor_name,
                "purpose": purpose,
                "date": str(appointment_date),
                "time": appointment_time,
                "id": appointment_id
            }

            # Create Google Calendar event
            calendar_link = create_google_calendar_event(appointment_details)

            confirmation = f"Your appointment request is submitted successfully for Dr. {real_doctor_name} on {appointment_date.strftime('%d %B')} at {appointment_time} for {purpose}."
            speak(confirmation)
            if service:
                speak("I have also added this to your Google Calendar.")
            
            return {**appointment_details, "calendar_link": calendar_link}

    except Exception as e:
        print(f"Error booking appointment: {e}")
        speak("An error occurred while booking the appointment.")
        return None
    finally:
        conn.close()

def apply_leave_flow():
    speak("Please tell me the date of leave.")
    leave_date = None
    while not leave_date:
        response = listen()
        if response:
            parsed_date = dateparser.parse(response)
            if parsed_date:
                leave_date = parsed_date.date()
            else:
                speak("Sorry, I couldn't understand the date. Please say it again.")
        else:
            speak("Sorry, please repeat the date of leave.")

    speak("Please tell me the reason for leave.")
    reason = None
    while not reason:
        response = listen()
        if response:
            reason = response
        else:
            speak("Sorry, please repeat the reason for leave.")

    student_id = get_student_id()
    if not student_id:
        speak("Could not identify a student account.")
        return None

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Create a placeholder health record because it's required by schema
            cur.execute("""
                INSERT INTO health_records (student_id, diagnosis, treatment, is_manual_upload, date)
                VALUES (%s, 'Voice Assistant Entry', 'N/A', TRUE, CURRENT_TIMESTAMP)
                RETURNING id
            """, (student_id,))
            health_record_id = cur.fetchone()['id']

            # Insert Leave
            cur.execute("""
                INSERT INTO medical_leaves (student_id, health_record_id, from_date, to_date, reason, status)
                VALUES (%s, %s, %s, %s, %s, 'pending')
                RETURNING id
            """, (student_id, health_record_id, leave_date, leave_date, reason))
            
            conn.commit()

            confirmation = f"Your leave for {leave_date.strftime('%d %B')} is recorded successfully for the reason: {reason}."
            speak(confirmation)
            
            return {
                "date": str(leave_date),
                "reason": reason
            }
    except Exception as e:
        print(f"Error applying leave: {e}")
        speak("An error occurred while applying for leave.")
        return None
    finally:
        conn.close()

@app.route('/voice-command', methods=['GET'])
def voice_command():
    speak("Hello, I am Aarogya Mitra. How can I help you today? You can say book appointment, apply for leave, or exit.")
    while True:
        command = listen()
        if command:
            command = command.lower()
            if "book appointment" in command:
                book_appointment_flow()
            elif "apply for leave" in command or "leave application" in command:
                apply_leave_flow()
            elif "exit" in command:
                speak("Good day")
                break
            else:
                speak("Sorry, I didn’t understand that. You can say book appointment, apply for leave, or exit.")
        else:
            speak("I didn't hear anything. Please say your command again.")
    return jsonify({"message": "Session ended."})

@app.route('/book-appointment', methods=['GET'])
def book_appointment():
    data = book_appointment_flow()
    return jsonify({"message": "Your appointment request is submitted successfully.", **(data or {})})

@app.route('/apply-leave', methods=['GET'])
def apply_leave():
    data = apply_leave_flow()
    return jsonify({"message": "Your leave application is submitted successfully.", **(data or {})})

@app.route('/all-appointments', methods=['GET'])
def all_appointments():
    conn = get_db_connection()
    if not conn: return jsonify({"error": "DB Connection failed"}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM appointments")
            all_data = cur.fetchall()
            # Convert dates to strings
            for d in all_data:
                d['slot_date_time'] = str(d['slot_date_time'])
                d['created_at'] = str(d['created_at'])
                d['updated_at'] = str(d['updated_at'])
            return jsonify({"appointments": all_data})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Changed port to avoid conflict with app.py
