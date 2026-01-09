
import { query } from './db/postgres.js';

const checkUsers = async () => {
    try {
        const students = await query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        console.log("Students:", students.rows[0].count);

        const doctors = await query("SELECT COUNT(*) FROM users WHERE role = 'doctor'");
        console.log("Doctors:", doctors.rows[0].count);
    } catch (e) {
        console.error(e);
    }
};

checkUsers();
