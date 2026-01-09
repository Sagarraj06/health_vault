
import { query } from './db/postgres.js';

const seedAppointment = async () => {
    try {
        console.log("Seeding appointment...");

        // 1. Get a student
        const student = await query("SELECT id FROM users WHERE role = 'student' LIMIT 1");
        if (student.rows.length === 0) throw new Error("No students found.");
        const studentId = student.rows[0].id;

        // 2. Get the specific doctor (yuvraj singhnn - 4)
        const doctorId = 4;

        // 3. Insert appointment for TODAY
        const today = new Date().toISOString();
        await query(`
            INSERT INTO appointments (
                doctor_id, student_id, slot_date_time, duration, status, reason, created_at, updated_at
            ) VALUES (
                $1, $2, $3, 30, 'confirmed', 'Test Appointment for Stats', NOW(), NOW()
            )
        `, [doctorId, studentId, today]);

        console.log("Seeded 1 confirmed appointment for Doctor 4.");

    } catch (e) {
        console.error(e);
    }
};

seedAppointment();
