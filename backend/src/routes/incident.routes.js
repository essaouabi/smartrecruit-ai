// ======================================================
// INCIDENT ROUTES - SMARTRECRUIT AI
// ======================================================

const express = require("express");

const {
  getIncidents,
  getIncidentStats,
  createIncidentController,
  updateIncidentStatus,
  resolveIncident,
  deleteIncident,
  seedIncident,
} = require("../controllers/incident.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getIncidents);
router.get("/stats", authMiddleware, getIncidentStats);

router.post("/", authMiddleware, createIncidentController);
router.post("/seed", authMiddleware, seedIncident);

router.patch("/:id/status", authMiddleware, updateIncidentStatus);
router.patch("/:id/resolve", authMiddleware, resolveIncident);

router.delete("/:id", authMiddleware, deleteIncident);

module.exports = router;