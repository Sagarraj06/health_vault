
import { query } from "./db/postgres.js";

const updateSchema = async () => {
    try {
        console.log("Updating schema...");
        // Drop the old constraint
        try {
            await query("ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check");
        } catch (e) {
            console.log("Constraint might not exist or verify name", e.message);
        }

        // Add new constraint with 'delayed'
        await query("ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'delayed'))");

        console.log("Schema updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating schema:", err);
        process.exit(1);
    }
};

updateSchema();
