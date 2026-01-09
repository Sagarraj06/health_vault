import { query } from "./db/postgres.js";

async function checkSlots() {
    try {
        const res = await query("SELECT * FROM doctor_slots WHERE doctor_id = 2");
        console.log("Slots for Doctor 2:");
        console.table(res.rows.map(r => ({
            id: r.id,
            time: r.date_time,
            timeString: r.date_time.toString(), // Check JS date conversion
            isBooked: r.is_booked
        })));
    } catch (err) {
        console.error(err);
    }
}

checkSlots();
