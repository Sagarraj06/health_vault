import express from "express";
import { adminGetSearchSuggestions, adminSearchHealthRecords, getMedicalLeaveApplications, updateLeaveStatus, viewLeaveDetails, getDashboardStats, getHealthAnalytics } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getHealthRecordsadmin } from "../controllers/healthRecordController.js";

const router = express.Router();

// Admin routes
router.get("/", authMiddleware(["admin"]), getMedicalLeaveApplications); // Fetch all leave applications
router.patch("/:id/status", authMiddleware(["admin"]), updateLeaveStatus); // Approve or reject leave
router.get("/:id/details", authMiddleware(["admin"]), viewLeaveDetails); // View leave details
router.get("/healthrecord", authMiddleware(["admin"]), getHealthRecordsadmin);
router.get("/search", authMiddleware(["admin"]), adminSearchHealthRecords);
router.get("/searchSuggestions", authMiddleware(["admin"]), adminGetSearchSuggestions);

// Analytics Routes
router.get("/stats", authMiddleware(["admin"]), getDashboardStats);
router.get("/analytics", authMiddleware(["admin"]), getHealthAnalytics);

export default router;