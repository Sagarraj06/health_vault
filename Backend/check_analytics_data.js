
import { query } from './db/postgres.js';

const checkData = async () => {
    try {
        console.log("Checking Analytics Data...");

        const appointments = await query("SELECT COUNT(*) FROM appointments");
        console.log("Total Appointments:", appointments.rows[0].count);

        const healthRecords = await query("SELECT COUNT(*) FROM health_records");
        console.log("Total Health Records:", healthRecords.rows[0].count);

        const recentAppointments = await query("SELECT * FROM appointments WHERE slot_date_time > NOW() - INTERVAL '6 months' LIMIT 5");
        console.log("Sample Recent Appointments:", recentAppointments.rows);

        const diagnoses = await query("SELECT diagnosis, COUNT(*) FROM health_records GROUP BY diagnosis");
        console.log("Diagnoses Distribution:", diagnoses.rows);

    } catch (error) {
        console.error("Error checking data:", error);
    }
};

checkData();
