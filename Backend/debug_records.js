
import { query } from "./db/postgres.js";

const debugRecords = async () => {
    try {
        const result = await query("SELECT id, diagnosis, treatment, created_at FROM health_records");
        console.log("Health Records Dump:");
        console.log(JSON.stringify(result.rows, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
};

debugRecords();
