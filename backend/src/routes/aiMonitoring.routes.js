// ======================================================
// AI MONITORING ROUTES - SMARTRECRUIT AI
// ======================================================

const express = require("express");

const {
  getAILogs,
  getAIStats,
  getAIDailyStats,
  createAILogController,
  seedAILogs,
} = require("../controllers/aiMonitoring.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// ======================================================
// GET ROUTES
// ======================================================

router.get("/", authMiddleware, getAILogs);

router.get("/stats", authMiddleware, getAIStats);

router.get("/daily", authMiddleware, getAIDailyStats);

// ======================================================
// POST ROUTES
// ======================================================

router.post("/", authMiddleware, createAILogController);

router.post("/seed", authMiddleware, seedAILogs);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;