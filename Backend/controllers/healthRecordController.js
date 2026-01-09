import { query } from "../db/postgres.js";
import { uploadMultipleDocuments } from "../utils/cloudinary.js";
import fs from 'fs';

// Create a new health record
export const createHealthRecord = async (req, res) => {
  try {
    const { diagnosis, treatment, prescription, externalDoctorName, externalHospitalName } = req.body;
    const studentId = req.user.id;
    const isManualUpload = req.body.isManualUpload === "true";
    let doctorId = null;

    if (!isManualUpload) {
      if (!req.body.doctorId || req.body.doctorId === "") {
        return res.status(400).json({ message: "Doctor ID is required" });
      }
      // Parse doctorId as integer to prevent SQL errors
      doctorId = parseInt(req.body.doctorId, 10);
      if (isNaN(doctorId)) {
        return res.status(400).json({ message: "Invalid Doctor ID. Please select a valid doctor from the list." });
      }
    }

    if (!diagnosis || !treatment) {
      return res.status(400).json({ message: "Diagnosis and treatment are required" });
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map(file => file.path);
      const uploadResults = await uploadMultipleDocuments(filePaths);

      attachments = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }));

      // Clean up temp files
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.log(`Failed to delete temp file: ${file.path}`, err);
        });
      });
    }

    const insertQuery = `
      INSERT INTO health_records (
        student_id, doctor_id, diagnosis, treatment, prescription, 
        is_manual_upload, external_doctor_name, external_hospital_name, attachments
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      studentId,
      doctorId,
      diagnosis,
      treatment,
      prescription,
      isManualUpload,
      externalDoctorName,
      externalHospitalName,
      JSON.stringify(attachments)
    ]);

    res.status(201).json({ message: "Health record created successfully", newRecord: result.rows[0] });
  } catch (error) {
    console.error("Error creating health record:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all health records for the logged-in student
export const getHealthRecords = async (req, res) => {
  try {
    const result = await query("SELECT * FROM health_records WHERE student_id = $1 ORDER BY created_at DESC", [req.user.id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health records", error: error.message });
  }
};

// Get a single health record by ID
export const getHealthRecordById = async (req, res) => {
  try {
    const result = await query("SELECT * FROM health_records WHERE id = $1", [req.params.id]);
    const record = result.rows[0];

    if (!record) return res.status(404).json({ message: "Health record not found" });

    if (record.student_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health record", error: error.message });
  }
};

// Update a health record
export const updateHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, treatment, prescription } = req.body;

    const checkResult = await query("SELECT * FROM health_records WHERE id = $1", [id]);
    const record = checkResult.rows[0];

    if (!record) return res.status(404).json({ message: "Health record not found" });
    if (record.student_id !== req.user.id) return res.status(403).json({ message: "Access denied" });

    const updateQuery = `
      UPDATE health_records 
      SET diagnosis = COALESCE($1, diagnosis), 
          treatment = COALESCE($2, treatment), 
          prescription = COALESCE($3, prescription),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;

    const result = await query(updateQuery, [diagnosis, treatment, prescription, id]);
    res.status(200).json({ message: "Health record updated successfully", record: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating health record", error: error.message });
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const checkResult = await query("SELECT * FROM health_records WHERE id = $1", [id]);
    const record = checkResult.rows[0];

    if (!record) return res.status(404).json({ message: "Health record not found" });
    if (record.student_id !== req.user.id) return res.status(403).json({ message: "Access denied" });

    await query("DELETE FROM health_records WHERE id = $1", [id]);
    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting health record", error: error.message });
  }
};

export const getHealthRecordsadmin = async (req, res) => {
  try {
    const sql = `
      SELECT hr.*, 
             s.name as student_name, s.gender as student_gender, s.email as student_email, s.phone as student_phone, s.date_of_birth as student_dob,
             d.name as doctor_name, d.specialization as doctor_specialization, d.email as doctor_email, d.phone as doctor_phone
      FROM health_records hr
      LEFT JOIN users s ON hr.student_id = s.id
      LEFT JOIN users d ON hr.doctor_id = d.id
      ORDER BY hr.created_at DESC
    `;

    const result = await query(sql);

    const formattedRecords = result.rows.map((record) => ({
      id: record.id,
      studentName: record.student_name || "Unknown",
      studentId: record.student_id || null,
      gender: record.student_gender || "Unknown",
      diagnosis: record.diagnosis,
      date: new Date(record.date).toISOString().split("T")[0],
      prescription: record.prescription || "No prescription provided",
      attachments: (record.attachments || []).map(att => ({
        url: att.url || null,
        format: att.url ? att.url.split('.').pop().toLowerCase() : null,
      })),
      doctorName: record.is_manual_upload
        ? record.external_doctor_name
        : record.doctor_name || "Unknown",
      hospitalName: record.is_manual_upload ? record.external_hospital_name : null,
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ message: error.message });
  }
};

export const searchHealthRecords = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;
    const studentId = req.user.id;

    const sql = `
      SELECT * FROM health_records 
      WHERE student_id = $1 
      AND (
        diagnosis ILIKE $2 OR 
        treatment ILIKE $2 OR 
        prescription ILIKE $2 OR 
        external_doctor_name ILIKE $2 OR 
        external_hospital_name ILIKE $2
      )
    `;

    const result = await query(sql, [studentId, `%${searchQuery}%`]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching health records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;
    const studentId = req.user.id;

    if (!searchQuery) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const sql = `
      SELECT diagnosis FROM health_records 
      WHERE student_id = $1 
      AND (
        diagnosis ILIKE $2 OR 
        treatment ILIKE $2 OR 
        prescription ILIKE $2 OR 
        external_doctor_name ILIKE $2 OR 
        external_hospital_name ILIKE $2
      )
      LIMIT 5
    `;

    const result = await query(sql, [studentId, `%${searchQuery}%`]);
    const uniqueSuggestions = [...new Set(result.rows.map(s => s.diagnosis))];

    res.status(200).json(uniqueSuggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};