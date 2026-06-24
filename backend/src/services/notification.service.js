const pool = require("../config/db");

// ======================================================
// SERVICE NOTIFICATIONS - SMARTRECRUIT AI
// ======================================================
// Ce service permet de :
// - créer une notification ;
// - la sauvegarder dans PostgreSQL ;
// - l'envoyer en temps réel avec Socket.io.
// ======================================================

const createNotification = async ({
  req = null,
  userId = null,
  userRole = null,
  type = "info",
  title,
  message,
  entity = null,
  entityId = null,
}) => {
  try {
    if (!title || !message) {
      return null;
    }

    const result = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        user_role,
        type,
        title,
        message,
        entity,
        entity_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [userId, userRole, type, title, message, entity, entityId]
    );

    const notification = result.rows[0];

    // Envoi temps réel avec Socket.io
    const io = req?.app?.get("io");

    if (io) {
      io.emit("notification", {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        date: notification.created_at,
        data: notification,
      });
    }

    return notification;
  } catch (error) {
    console.error("Erreur création notification :", error.message);
    return null;
  }
};

module.exports = {
  createNotification,
};