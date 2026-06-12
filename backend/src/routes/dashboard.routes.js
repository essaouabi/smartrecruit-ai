// ===============================
// IMPORTS
// ===============================

const express = require("express");

const router = express.Router();

// ===============================
// IMPORT CONTROLLERS
// ===============================

const {
  getDashboardStats,
} = require(
  "../controllers/dashboard.controller"
);

// ===============================
// IMPORT AUTH MIDDLEWARE
// ===============================

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

// ===============================
// ROUTES PROTÉGÉES
// ===============================

// GET DASHBOARD STATS
router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

// ===============================
// EXPORT
// ===============================

module.exports = router;