
import { query } from './db/postgres.js';

const checkDoctorStats = async () => {
    try {
        console.log("--- Doctor Stats Debug ---");

        // 1. Get all doctors
        const doctors = await query("SELECT id, name, email FROM users WHERE role = 'doctor'");
        console.log(`Found ${doctors.rows.length} doctors.`);

        for (const doc of doctors.rows) {
            console.log(`\nChecking Doctor: ${doc.name} (${doc.id})`);

            // 2. Count all appointments
            const allAppts = await query("SELECT COUNT(*) FROM appointments WHERE doctor_id = $1", [doc.id]);
            console.log(`  Total Appointments: ${allAppts.rows[0].count}`);

            // 3. Count confirmed (Video Consults proxy)
            const confirmed = await query("SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND status = 'confirmed'", [doc.id]);
            console.log(`  Confirmed (Video): ${confirmed.rows[0].count}`);

            // 4. Count pending (Active Cases)
            const pending = await query("SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND status = 'pending'", [doc.id]);
            console.log(`  Pending (Active): ${pending.rows[0].count}`);

            // 5. Check Today's Appointments (Date logic)
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = await query("SELECT count(*) FROM appointments WHERE doctor_id = $1 AND DATE(slot_date_time) = $2", [doc.id, today]);
            console.log(`  Today's (${today}): ${todayAppts.rows[0].count}`);

            // 6. Show a few sample dates to verify format
            const dates = await query("SELECT slot_date_time FROM appointments WHERE doctor_id = $1 LIMIT 3", [doc.id]);
            console.log("  Sample Dates:", dates.rows.map(r => r.slot_date_time));
        }

    } catch (e) {
        console.error(e);
    }
};

checkDoctorStats();
