import express from "express";
import { updateAppointmentStatus, updateTimeSlots, getDoctorAppointments, updatePrescription, getDoctorStats } from "../controllers/doctorContoller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js"; // Import Multer middleware

const router = express.Router();

router.get("/stats", authMiddleware(["doctor"]), getDoctorStats);
router.patch("/slots/update", authMiddleware(["doctor"]), updateTimeSlots);
router.get("/appointment", authMiddleware(["doctor"]), getDoctorAppointments);
router.patch("/:id/appointment-status", authMiddleware(["doctor"]), updateAppointmentStatus);
router.patch("/prescription", authMiddleware(["doctor"]), upload.single("file"), updatePrescription);

export default router;