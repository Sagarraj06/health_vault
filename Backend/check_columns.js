
import { query } from './db/postgres.js';

const checkColumns = async () => {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'appointments'
        `);
        console.log("Columns:", res.rows.map(r => `${r.column_name} (${r.data_type})`));
    } catch (e) {
        console.error(e);
    }
};

checkColumns();
