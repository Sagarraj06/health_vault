
import { query } from './db/postgres.js';

const seed = async () => {
    try {
        console.log("Seeding v3...");
        const doc = await query("SELECT id FROM users WHERE role = 'doctor' LIMIT 1");
        const stu = await query("SELECT id FROM users WHERE role = 'student' LIMIT 1");

        if (!doc.rows[0] || !stu.rows[0]) {
            console.log("Missing doc or student");
            return;
        }

        console.log(`Doc: ${doc.rows[0].id}, Stu: ${stu.rows[0].id}`);

        await query(`
            INSERT INTO public.appointments (
                doctor_id, student_id, slot_date_time, duration, status, reason, created_at, updated_at
            ) VALUES (
                $1, $2, NOW(), 30, 'confirmed', 'Seed V3', NOW(), NOW()
            )
        `, [doc.rows[0].id, stu.rows[0].id]);

        console.log("Seeding Success!");

    } catch (e) {
        console.error("SEED V3 ERROR:", e);
    }
};

seed();
