import { query } from "../db/postgres.js";
import sendMail from "../utils/mailer.js";
import pusher from "../utils/pusher.js";

export const bookAppointment = async (req, res) => {
  try {
    const { slotDateTime } = req.body;
    const studentId = req.user.id;

    // Parse doctorId as integer (form data sends it as string)
    const doctorId = parseInt(req.body.doctorId, 10);
    if (isNaN(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Validate slotDateTime is in the future
    if (new Date(slotDateTime) < new Date()) {
      return res.status(400).json({ message: "Cannot book appointments in the past." });
    }

    // Start Transaction
    await query("BEGIN");

    console.log("=== Booking Appointment Debug ===");
    console.log("doctorId:", doctorId, "type:", typeof doctorId);
    console.log("slotDateTime:", slotDateTime);
    console.log("studentId:", studentId);

    // Database stores timestamps in IST (UTC+5:30) without timezone info
    // Frontend sends UTC time like 2025-12-07T03:00:00.000Z
    // This UTC time actually corresponds to 08:30 IST.
    // Since DB stores "2025-12-07 08:30:00", we must convert 03:00 UTC -> 08:30

    const utcDate = new Date(slotDateTime);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in ms
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format as YYYY-MM-DD HH:MM:SS
    const istTimestamp = istDate.toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    console.log("UTC time from frontend:", slotDateTime);
    console.log("Converted to IST timestamp for DB:", istTimestamp);

    // 1. Check if slot is available and lock it
    const slotResult = await query(`
      SELECT id, date_time
      FROM doctor_slots 
      WHERE doctor_id = $1 
        AND to_char(date_time, 'YYYY-MM-DD HH24:MI:SS') = $2
        AND is_booked = FALSE
      FOR UPDATE
    `, [doctorId, istTimestamp]);

    console.log("Found slots:", slotResult.rows);

    if (slotResult.rows.length === 0) {
      await query("ROLLBACK");
      return res.status(400).json({ message: "Time slot is not available or already booked." });
    }

    const slotId = slotResult.rows[0].id;

    // 2. Check if student already has an appointment at this time
    const existingAppointment = await query(`
      SELECT id FROM appointments 
      WHERE student_id = $1 AND slot_date_time = $2
    `, [studentId, slotResult.rows[0].date_time]);

    if (existingAppointment.rows.length > 0) {
      await query("ROLLBACK");
      return res.status(400).json({ message: "You already have an appointment at this time." });
    }

    // 3. Mark slot as booked
    await query(`
      UPDATE doctor_slots 
      SET is_booked = TRUE 
      WHERE id = $1
    `, [slotId]);

    // 4. Create Appointment - use the database timestamp
    const appointmentResult = await query(`
      INSERT INTO appointments (student_id, doctor_id, slot_date_time)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [studentId, doctorId, slotResult.rows[0].date_time]);

    const appointment = appointmentResult.rows[0];

    // 5. Fetch details for notification
    const doctorResult = await query("SELECT name, email FROM users WHERE id = $1", [doctorId]);
    const studentResult = await query("SELECT name FROM users WHERE id = $1", [studentId]);

    const doctorDetails = doctorResult.rows[0];
    const studentDetails = studentResult.rows[0];

    // 6. Create Notification
    const notificationResult = await query(`
      INSERT INTO notifications (recipient_id, type, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [doctorId, "appointment", `📅 You have a new appointment request from ${studentDetails.name}!`]);

    const notification = notificationResult.rows[0];

    // Commit Transaction
    await query("COMMIT");

    // 7. Real-time Notification (Pusher)
    try {
      await pusher.trigger(`user-${doctorId}`, "newAppointment", {
        message: `📅 ${studentDetails.name} has requested an appointment!`,
        appointment: {
          ...appointment,
          doctorId: {
            _id: doctorId,
            id: doctorId,
            name: doctorDetails.name,
          },
          studentId: {
            _id: studentId,
            id: studentId,
            name: studentDetails.name,
          },
        },
      });
      await pusher.trigger(`user-${doctorId}`, "newNotification", { notification });
    } catch (pusherError) {
      console.error("Pusher Trigger Error:", pusherError);
    }

    // 8. Send Email
    try {
      const mailSubject = "📅 New Appointment Request";
      const mailText = `You have a new appointment request from ${studentDetails.name} on ${istTimestamp}.`;
      const mailHtml = `
        <h3>New Appointment Request</h3>
        <p><strong>Student:</strong> ${studentDetails.name}</p>
        <p><strong>Date & Time:</strong> ${istTimestamp} IST</p>
        <p>Please log in to your dashboard to confirm or cancel this appointment.</p>
      `;
      await sendMail(doctorDetails.email, mailSubject, mailText, mailHtml);
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError);
    }

    res.status(201).json({ message: "Appointment booked successfully.", appointment });

  } catch (error) {
    await query("ROLLBACK");
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT a.*, 
             d.name as doctor_name, d.email as doctor_email, d.specialization as doctor_specialization
      FROM appointments a
      JOIN users d ON a.doctor_id = d.id
      WHERE a.student_id = $1
    `;
    const params = [studentId];

    if (status) {
      sql += ` AND a.status = $2`;
      params.push(status);
    }

    sql += ` ORDER BY a.slot_date_time DESC`;

    const result = await query(sql, params);

    // Transform to match expected frontend structure
    const appointments = result.rows.map(row => ({
      ...row,
      doctorId: {
        _id: row.doctor_id,
        id: row.doctor_id,
        name: row.doctor_name,
        email: row.doctor_email,
        specialization: row.doctor_specialization
      }
    }));

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
