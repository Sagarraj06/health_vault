import express from "express";
import {
    createCertificate,
    verifyCertificate,
    getPendingCertificates,
    getPendingPrescriptions,
    updateRecordStatus
} from "../controllers/certificateController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public verification (or protected if needed, usually public for QR codes)
router.get("/verify/:id", verifyCertificate);

// Protected Routes
router.post("/create", authMiddleware(["student", "user"]), createCertificate);

// Doctor Routes for Dashboard
router.get("/pending-certificates", authMiddleware(["doctor", "admin"]), getPendingCertificates);
router.get("/pending-prescriptions", authMiddleware(["doctor", "admin"]), getPendingPrescriptions);
router.patch("/:id/status", authMiddleware(["doctor", "admin"]), updateRecordStatus);

export default router;
