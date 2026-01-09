
import { query } from './db/postgres.js';

const seed = async () => {
    try {
        console.log("Starting seed...");

        // 1. Find a doctor
        const docRes = await query("SELECT id FROM users WHERE role = 'doctor' LIMIT 1");
        if (!docRes.rows.length) throw new Error("No doctor found");
        const docId = docRes.rows[0].id;
        console.log("Doctor ID:", docId);

        // 2. Find a student
        const stuRes = await query("SELECT id FROM users WHERE role = 'student' LIMIT 1");
        if (!stuRes.rows.length) throw new Error("No student found");
        const stuId = stuRes.rows[0].id;
        console.log("Student ID:", stuId);

        // 3. Insert Appointment
        const q = `
            INSERT INTO appointments (
                doctor_id, student_id, slot_date_time, duration, status, reason, created_at, updated_at
            ) VALUES (
                $1, $2, NOW(), 30, 'confirmed', 'Seed Data', NOW(), NOW()
            ) RETURNING id
        `;
        const res = await query(q, [docId, stuId]);
        console.log("Inserted Appointment ID:", res.rows[0].id);

    } catch (e) {
        console.error("SEED ERROR:", e.message);
        if (e.detail) console.error("Detail:", e.detail);
    }
};

seed();
