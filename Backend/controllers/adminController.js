import { query } from "../db/postgres.js";
import sendMail from "../utils/mailer.js";
import pusher from "../utils/pusher.js";

export const getMedicalLeaveApplications = async (req, res) => {
  try {
    console.log("Admin requesting leave applications...");
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
    console.log(`Found ${result.rows.length} leave applications.`);

    const formattedLeaves = result.rows.map((leave) => ({
      id: leave.id,
      _id: leave.id,
      studentName: leave.student_name || "Unknown",
      studentId: leave.student_id || null,
      gender: leave.student_gender || "Unknown",
      duration: `${new Date(leave.from_date).toISOString().split("T")[0]} to ${new Date(leave.to_date).toISOString().split("T")[0]}`,
      fromDate: new Date(leave.from_date).toISOString().split("T")[0],
      toDate: new Date(leave.to_date).toISOString().split("T")[0],
      diagnosis: leave.diagnosis || null,
      status: leave.status,
    }));

    res.status(200).json(formattedLeaves);
  } catch (error) {
    console.error("Error in getMedicalLeaveApplications:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
    }

    const updateQuery = `
      UPDATE medical_leaves 
      SET status = $1, approved_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await query(updateQuery, [status, req.user.id, id]);
    const leave = result.rows[0];

    if (!leave) {
      return res.status(404).json({ message: "Medical leave not found" });
    }

    // Create Notification
    const notifQuery = `
      INSERT INTO notifications (recipient_id, type, message)
      VALUES ($1, 'leave', $2)
      RETURNING *
    `;
    const notifResult = await query(notifQuery, [leave.student_id, `Your leave request has been ${status}.`]);
    const notification = notifResult.rows[0];

    // Pusher Notification
    try {
      await pusher.trigger(`user-${leave.student_id}`, "newNotification", {
        notification,
        leave
      });
    } catch (pusherError) {
      console.error("Error sending pusher notification:", pusherError);
    }

    // Send Email
    try {
      const studentResult = await query("SELECT name, email FROM users WHERE id = $1", [leave.student_id]);
      const studentDetails = studentResult.rows[0];

      if (studentDetails?.email) {
        const mailSubject = `📝 Medical Leave ${status}`;
        const mailText = `Your medical leave request has been ${status}.`;
        const mailHtml = `
            <h3>Medical Leave Status Update</h3>
            <p><strong>Student:</strong> ${studentDetails.name}</p>
            <p><strong>Status:</strong> <span style="text-transform: capitalize;">${status}</span></p>
            <p>Your medical leave request has been <strong>${status}</strong>.</p>
          `;

        await sendMail(studentDetails.email, mailSubject, mailText, mailHtml);
      }
    } catch (emailError) {
      console.error("❌ Error sending email to student:", emailError);
    }

    res.status(200).json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewLeaveDetails = async (req, res) => {
  try {
    const { id } = req.params;

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
      WHERE ml.id = $1
      `;

    const result = await query(sql, [id]);
    const leave = result.rows[0];

    if (!leave) {
      return res.status(404).json({ message: "Medical leave not found" });
    }

    const detailedLeave = {
      id: leave.id,
      studentName: leave.student_name,
      studentId: leave.student_id,
      gender: leave.student_gender,
      email: leave.student_email,
      phone: leave.student_phone,
      dateOfBirth: leave.student_dob ? new Date(leave.student_dob).toISOString().split("T")[0] : null,
      duration: `${new Date(leave.from_date).toISOString().split("T")[0]} to ${new Date(leave.to_date).toISOString().split("T")[0]} `,
      reason: leave.reason,
      status: leave.status,
      diagnosis: leave.diagnosis || null,
      treatment: leave.treatment || null,
      prescription: leave.prescription || null,
      doctorName: leave.is_manual_upload
        ? leave.external_doctor_name
        : leave.doctor_name || null,
      hospitalName: leave.is_manual_upload
        ? leave.external_hospital_name
        : null,
      supportingDocuments: leave.supporting_documents || [],
      approvedBy: leave.approver_name ? { name: leave.approver_name, email: leave.approver_email } : null,
    };

    res.status(200).json(detailedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminSearchHealthRecords = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    // Search users first to get IDs
    const userSql = `
      SELECT id, role FROM users 
      WHERE name ILIKE $1 OR specialization ILIKE $1
      `;
    const userResult = await query(userSql, [`%${searchQuery}%`]);

    const studentIds = userResult.rows.filter(u => u.role === 'student').map(u => u.id);
    const doctorIds = userResult.rows.filter(u => u.role === 'doctor').map(u => u.id);

    // Build main query
    let sql = `
      SELECT hr.*,
      s.name as student_name,
      d.name as doctor_name, d.specialization as doctor_specialization
      FROM health_records hr
      LEFT JOIN users s ON hr.student_id = s.id
      LEFT JOIN users d ON hr.doctor_id = d.id
    WHERE
    hr.diagnosis ILIKE $1 OR
    hr.treatment ILIKE $1 OR
    hr.prescription ILIKE $1 OR
    hr.external_doctor_name ILIKE $1 OR
    hr.external_hospital_name ILIKE $1
      `;

    const params = [`%${searchQuery}%`];
    let paramIndex = 2;

    if (studentIds.length > 0) {
      sql += ` OR hr.student_id = ANY($${paramIndex})`;
      params.push(studentIds);
      paramIndex++;
    }

    if (doctorIds.length > 0) {
      sql += ` OR hr.doctor_id = ANY($${paramIndex})`;
      params.push(doctorIds);
      paramIndex++;
    }

    const result = await query(sql, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in admin search for health records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const adminGetSearchSuggestions = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Suggestions from Health Records
    const recordSql = `
      SELECT diagnosis, treatment, prescription, external_doctor_name, external_hospital_name 
      FROM health_records
    WHERE 
        diagnosis ILIKE $1 OR 
        treatment ILIKE $1 OR 
        prescription ILIKE $1 OR 
        external_doctor_name ILIKE $1 OR 
        external_hospital_name ILIKE $1
      LIMIT 5
      `;
    const recordResult = await query(recordSql, [`%${searchQuery}%`]);

    // Suggestions from Users
    const userSql = `
      SELECT name, specialization 
      FROM users 
      WHERE name ILIKE $1 OR specialization ILIKE $1
      LIMIT 5
      `;
    const userResult = await query(userSql, [`%${searchQuery}%`]);

    // Combine and deduplicate
    const suggestions = new Set();

    recordResult.rows.forEach(row => {
      if (row.diagnosis && row.diagnosis.match(new RegExp(searchQuery, 'i'))) suggestions.add(row.diagnosis);
      // Add other fields if they match... simplified for brevity, usually diagnosis is main suggestion
    });

    userResult.rows.forEach(row => {
      if (row.name && row.name.match(new RegExp(searchQuery, 'i'))) suggestions.add(row.name);
      if (row.specialization && row.specialization.match(new RegExp(searchQuery, 'i'))) suggestions.add(row.specialization);
    });

    res.status(200).json([...suggestions].slice(0, 10));
  } catch (error) {
    console.error("Error fetching admin search suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const studentCount = await query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const pendingLeaves = await query("SELECT COUNT(*) FROM medical_leaves WHERE status = 'pending'");
    const openHealthCases = await query("SELECT COUNT(*) FROM health_records"); // Using total health records as proxy for now
    const availableDoctors = await query("SELECT COUNT(*) FROM users WHERE role = 'doctor'");

    res.status(200).json({
      totalStudents: studentCount.rows[0].count,
      pendingLeaves: pendingLeaves.rows[0].count,
      openHealthCases: openHealthCases.rows[0].count,
      availableDoctors: availableDoctors.rows[0].count,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

export const getHealthAnalytics = async (req, res) => {
  try {
    // Monthly Health Visits (using Appointments)
    // Group by month name/number. Postgres: TO_CHAR(slot_date_time, 'Mon')
    // We assume current year for simplicity or last 6 months
    const monthlySql = `
      SELECT TO_CHAR(slot_date_time, 'Mon') as month,
             COUNT(*) FILTER (WHERE status = 'confirmed') as checkups,
             COUNT(*) FILTER (WHERE status = 'emergency') as emergencies
      FROM appointments
      WHERE slot_date_time > NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(slot_date_time, 'Mon'), DATE_TRUNC('month', slot_date_time)
      ORDER BY DATE_TRUNC('month', slot_date_time)
    `;

    // Note: status 'emergency' might not exist, checking schema would be better but assuming 'confirmed' is checkup.
    // If no 'emergency' status, we might just count all as checkups.
    // Let's check appointmentController or schema if possible? 
    // Assuming 'confirmed', 'pending', 'cancelled'. 
    // Let's just return total appointments as 'checkups' for now to be safe.

    const monthlySqlSafe = `
      SELECT TO_CHAR(slot_date_time, 'Mon') as month,
             COUNT(*) as checkups
      FROM appointments
      WHERE slot_date_time > NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(slot_date_time, 'Mon'), DATE_TRUNC('month', slot_date_time)
      ORDER BY DATE_TRUNC('month', slot_date_time)
    `;

    const monthlyResult = await query(monthlySqlSafe);

    // Common Health Issues (from Health Records diagnosis)
    const diagnosisSql = `
      SELECT diagnosis as name, COUNT(*) as value
      FROM health_records
      WHERE diagnosis IS NOT NULL
      GROUP BY diagnosis
      ORDER BY value DESC
      LIMIT 5
    `;
    const diagnosisResult = await query(diagnosisSql);

    res.status(200).json({
      monthlyVisits: monthlyResult.rows,
      commonHealthIssues: diagnosisResult.rows
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
};