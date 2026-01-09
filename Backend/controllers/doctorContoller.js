import { query } from "../db/postgres.js";
import sendMail from "../utils/mailer.js";
import { uploadDocument } from "../utils/cloudinary.js";
import pusher from "../utils/pusher.js";
import fs from "fs";

export const updateTimeSlots = async (req, res) => {
  const doctorId = req.user.id;
  const newSlots = req.body.slots; // Array of { dateTime: "ISOString" }

  try {
    // In SQL, we insert into doctor_slots table
    // We can use a transaction or just loop. Transaction is safer.
    await query("BEGIN");

    for (const slot of newSlots) {
      // Check if slot already exists to avoid duplicates (optional but good)
      const check = await query(
        "SELECT id FROM doctor_slots WHERE doctor_id = $1 AND date_time = $2",
        [doctorId, slot.dateTime]
      );

      if (check.rows.length === 0) {
        await query(
          "INSERT INTO doctor_slots (doctor_id, date_time, is_booked) VALUES ($1, $2, FALSE)",
          [doctorId, slot.dateTime]
        );
      }
    }

    await query("COMMIT");
    return res.status(200).json({ message: "Time slots updated successfully" });
  } catch (error) {
    await query("ROLLBACK");
    return res.status(500).json({ error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled", "pending", "delayed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    // Fetch appointment with doctor details
    const appResult = await query(`
      SELECT a.*, d.name as doctor_name 
      FROM appointments a
      JOIN users d ON a.doctor_id = d.id
      WHERE a.id = $1
    `, [id]);

    const appointment = appResult.rows[0];

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Update appointment status
    await query("UPDATE appointments SET status = $1 WHERE id = $2", [status, id]);

    const { doctor_id, slot_date_time, student_id } = appointment;

    // Handle slot booking status
    if (status === "confirmed") {
      await query(`
        UPDATE doctor_slots 
        SET is_booked = TRUE 
        WHERE doctor_id = $1 AND date_time = $2
      `, [doctor_id, slot_date_time]);
    } else if (status === "cancelled") {
      await query(`
        UPDATE doctor_slots 
        SET is_booked = FALSE 
        WHERE doctor_id = $1 AND date_time = $2
      `, [doctor_id, slot_date_time]);
    }

    // Create Notification
    const notifResult = await query(`
      INSERT INTO notifications (recipient_id, type, message)
      VALUES ($1, 'appointment', $2)
      RETURNING *
    `, [student_id, `Your appointment has been ${status}`]);

    const notification = notifResult.rows[0];

    // Socket.io
    // Pusher Notification
    try {
      await pusher.trigger(`user-${student_id}`, "appointmentUpdate", {
        message: notification.message,
        appointment: {
          ...appointment,
          doctorName: appointment.doctor_name,
        },
      });
      await pusher.trigger(`user-${student_id}`, "newNotification", { notification });
    } catch (pusherError) {
      console.error("Pusher Trigger Error:", pusherError);
    }

    // Send Email
    try {
      const studentResult = await query("SELECT name, email FROM users WHERE id = $1", [student_id]);
      const studentDetails = studentResult.rows[0];

      if (studentDetails?.email) {
        const mailSubject = `📅 Appointment ${status}`;
        const mailText = `Your appointment with Dr. ${appointment.doctor_name} on ${new Date(slot_date_time).toLocaleString()} has been ${status}.`;
        const mailHtml = `
          <h3>Appointment ${status}</h3>
          <p><strong>Doctor:</strong> Dr. ${appointment.doctor_name}</p>
          <p><strong>Date & Time:</strong> ${new Date(slot_date_time).toLocaleString()}</p>
          <p>Your appointment has been <strong>${status}</strong>.</p>
        `;

        await sendMail(studentDetails.email, mailSubject, mailText, mailHtml);
      }
    } catch (emailError) {
      console.error("❌ Error sending email to student:", emailError);
    }

    res.status(200).json({ message: `Appointment ${status} successfully.` });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT a.*, s.name as student_name, s.email as student_email
      FROM appointments a
      JOIN users s ON a.student_id = s.id
      WHERE a.doctor_id = $1
    `;
    const params = [doctorId];

    if (status) {
      sql += ` AND a.status = $2`;
      params.push(status);
    }

    const result = await query(sql, params);

    // Fetch doctor name for response consistency
    const docResult = await query("SELECT name FROM users WHERE id = $1", [doctorId]);
    const doctorName = docResult.rows[0]?.name;

    const appointmentsWithDoctorInfo = result.rows.map(app => ({
      ...app,
      _id: app.id,
      slotDateTime: app.slot_date_time,
      studentId: { // Nesting for frontend compatibility if needed
        _id: app.student_id,
        name: app.student_name,
        email: app.student_email
      },
      doctorName: doctorName
    }));

    res.status(200).json(appointmentsWithDoctorInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const uploadResult = await uploadDocument(req.file.path);

    const result = await query(`
      UPDATE appointments 
      SET prescription = $1 
      WHERE id = $2
      RETURNING *
    `, [uploadResult.secure_url, appointmentId]);

    const updatedAppointment = result.rows[0];

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Prescription uploaded successfully.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Today's Appointments
    const todaySql = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE doctor_id = $1 AND DATE(slot_date_time) = $2
    `;
    const todayResult = await query(todaySql, [doctorId, today]);

    // Active Cases (Pending Appointments)
    const activeSql = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE doctor_id = $1 AND status = 'pending'
    `;
    const activeResult = await query(activeSql, [doctorId]);

    // Video Consultations (Confirmed Appointments)
    const videoSql = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE doctor_id = $1 AND status = 'confirmed'
    `;
    const videoResult = await query(videoSql, [doctorId]);

    res.status(200).json({
      todayAppointments: parseInt(todayResult.rows[0].count),
      pendingCertificates: 0, // Placeholder
      activeCases: parseInt(activeResult.rows[0].count),
      videoConsultations: parseInt(videoResult.rows[0].count)
    });

  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};
