
import { query } from './db/postgres.js';

const checkSchema = async () => {
    try {
        const apptColumns = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'appointments'");
        console.log("Appointments Columns:", apptColumns.rows.map(r => r.column_name));

        const tables = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables:", tables.rows.map(r => r.table_name));
    } catch (e) {
        console.error(e);
    }
};

checkSchema();
