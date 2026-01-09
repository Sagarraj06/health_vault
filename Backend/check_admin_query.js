
import { query } from './db/postgres.js';

const testQuery = async () => {
    try {
        const sql = `
          SELECT ml.*, 
                 s.name as student_name, s.gender as student_gender, s.email as student_email, s.phone as student_phone, s.date_of_birth as student_dob,
                 hr.diagnosis, hr.treatment, hr.prescription, hr.date as hr_date, hr.is_manual_upload, hr.external_doctor_name, hr.external_hospital_name, hr.attachments,
                 d.name as doctor_name,
                 a.name as approver_name, a.email as approver_email
          FROM medical_leaves ml
          LEFT JOIN users s ON ml.student_id = s.id
          LEFT JOIN health_records hr ON ml.health_record_id = hr.id
          LEFT JOIN users d ON hr.doctor_id = d.id
          LEFT JOIN users a ON ml.approved_by = a.id
          ORDER BY ml.created_at DESC
        `;
        const result = await query(sql);
        console.log("Joined Result Count:", result.rows.length);
        console.log("Sample Row:", result.rows[0]);
    } catch (e) {
        console.error(e);
    }
};

testQuery();
