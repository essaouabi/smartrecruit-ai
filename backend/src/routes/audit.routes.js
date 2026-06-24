const express = require("express");

const {
  getAuditLogs,
  getAuditStats,
} = require("../controllers/audit.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getAuditLogs);
router.get("/stats", authMiddleware, getAuditStats);

module.exports = router;