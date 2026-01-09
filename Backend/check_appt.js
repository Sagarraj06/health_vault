
import { query } from './db/postgres.js';

const checkAppt = async () => {
    try {
        const res = await query("SELECT COUNT(*) FROM appointments");
        console.log("Total Count:", res.rows[0].count);

        const dates = await query("SELECT slot_date_time FROM appointments ORDER BY slot_date_time DESC LIMIT 5");
        console.log("Recent Dates:", dates.rows);
    } catch (e) {
        console.error(e);
    }
};
checkAppt();
