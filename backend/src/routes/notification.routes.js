const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// ======================================================
// ROUTES NOTIFICATIONS
// ======================================================

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markNotificationAsRead);

router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;