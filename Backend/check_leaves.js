
import { query } from './db/postgres.js';

const checkLeaves = async () => {
    try {
        const res = await query("SELECT COUNT(*) FROM medical_leaves");
        console.log("Total Leaves:", res.rows[0].count);

        const leaves = await query("SELECT * FROM medical_leaves LIMIT 5");
        console.log("Sample Leaves:", leaves.rows);
    } catch (e) {
        console.error(e);
    }
};

checkLeaves();
