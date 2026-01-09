import { query } from "../db/postgres.js";
import { uploadMultipleDocuments } from "../utils/cloudinary.js";
import pusher from "../utils/pusher.js";
import fs from "fs";

// Apply for Medical Leave
export const applyMedicalLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, healthRecordId } = req.body;
    const studentId = req.user.id;

    // Process uploaded files
    let supportingDocuments = [];
    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map(file => file.path);
      const uploadResults = await uploadMultipleDocuments(filePaths);

      supportingDocuments = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }));

      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Failed to delete temp file: ${file.path}`, err);
        });
      });
    }

    // Insert Leave Request
    const insertQuery = `
      INSERT INTO medical_leaves (student_id, health_record_id, from_date, to_date, reason, supporting_documents, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *;
    `;

    const leaveResult = await query(insertQuery, [
      studentId,
      healthRecordId,
      fromDate,
      toDate,
      reason,
      JSON.stringify(supportingDocuments)
    ]);

    const leaveRequest = leaveResult.rows[0];

    // Fetch full details for notification (simulating populate)
    const fullLeaveQuery = `
      SELECT ml.*, 
             s.name as student_name, s.gender as student_gender,
             hr.diagnosis, hr.date as hr_date, hr.is_manual_upload, hr.external_doctor_name,
             d.name as doctor_name
      FROM medical_leaves ml
      JOIN users s ON ml.student_id = s.id
      JOIN health_records hr ON ml.health_record_id = hr.id
      LEFT JOIN users d ON hr.doctor_id = d.id
      WHERE ml.id = $1
    `;

    const fullLeaveResult = await query(fullLeaveQuery, [leaveRequest.id]);
    const fullLeave = fullLeaveResult.rows[0];

    // Notification Logic
    const io = req.app.get("socketio");
    const onlineUsers = req.app.get("onlineUsers");

    // Notify Student
    await query(`
      INSERT INTO notifications (recipient_id, type, message)
      VALUES ($1, 'leave', 'Your leave request has been submitted successfully.')
    `, [studentId]);

    // Notify Admins
    // First, find all admins
    const adminsResult = await query("SELECT id FROM users WHERE role = 'admin'");
    const admins = adminsResult.rows;

    for (const admin of admins) {
      const adminNotifResult = await query(`
        INSERT INTO notifications (recipient_id, type, message)
        VALUES ($1, 'leave', $2)
        RETURNING *
      `, [admin.id, `Student ${fullLeave.student_name} has applied for medical leave!`]);

      const savedNotification = adminNotifResult.rows[0];

      if (onlineUsers && onlineUsers.has(admin.id.toString())) {
        const adminSocket = onlineUsers.get(admin.id.toString());
        adminSocket.emit("newLeaveNotification", {
          notification: savedNotification,
          leave: {
            id: fullLeave.id,
            _id: fullLeave.id, // For frontend compatibility
            reason: fullLeave.reason,
            fromDate: new Date(fullLeave.from_date).toISOString().split("T")[0],
            toDate: new Date(fullLeave.to_date).toISOString().split("T")[0],
            diagnosis: fullLeave.diagnosis || "N/A",
            date: fullLeave.hr_date ? new Date(fullLeave.hr_date).toISOString().split("T")[0] : "N/A",
            doctorName: fullLeave.is_manual_upload
              ? fullLeave.external_doctor_name || "N/A"
              : fullLeave.doctor_name || "N/A",
            status: fullLeave.status,
            studentName: fullLeave.student_name || "N/A",
            studentId: fullLeave.student_id || "N/A",
            gender: fullLeave.student_gender || "N/A",
            duration: `${new Date(fullLeave.from_date).toISOString().split("T")[0]} to ${new Date(fullLeave.to_date).toISOString().split("T")[0]}`
          }
        });
      }
    }

    res.status(201).json({
      message: "Medical leave applied",
      leaveRequest: {
        ...leaveRequest,
        studentName: fullLeave.student_name
      }
    });

  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllLeaveApplications = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let sql = `
      SELECT ml.*, 
             s.name as student_name, s.email as student_email,
             hr.diagnosis, hr.date as hr_date, hr.is_manual_upload, hr.external_doctor_name, hr.attachments as hr_attachments,
             d.name as doctor_name
      FROM medical_leaves ml
      JOIN users s ON ml.student_id = s.id
      LEFT JOIN health_records hr ON ml.health_record_id = hr.id
      LEFT JOIN users d ON hr.doctor_id = d.id
    `;

    const params = [];
    if (role === "student") {
      sql += " WHERE ml.student_id = $1";
      params.push(userId);
    }

    sql += " ORDER BY ml.created_at DESC";

    const result = await query(sql, params);

    const formattedApplications = result.rows.map((app) => ({
      id: app.id,
      reason: app.reason,
      fromDate: new Date(app.from_date).toISOString().split("T")[0],
      toDate: new Date(app.to_date).toISOString().split("T")[0],
      diagnosis: app.diagnosis || "N/A",
      date: app.hr_date ? new Date(app.hr_date).toISOString().split("T")[0] : "N/A",
      doctorName: app.is_manual_upload
        ? app.external_doctor_name || "N/A"
        : app.doctor_name || "N/A",
      status: app.status
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Leave Status for Student
export const getLeaveStatus = async (req, res) => {
  try {
    const sql = `
      SELECT ml.*, hr.* 
      FROM medical_leaves ml
      LEFT JOIN health_records hr ON ml.health_record_id = hr.id
      WHERE ml.student_id = $1
    `;
    const result = await query(sql, [req.user.id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching leave status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};