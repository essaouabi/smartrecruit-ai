const pool = require("../config/db");

// ======================================================
// CONTROLLER NOTIFICATIONS - SMARTRECRUIT AI
// ======================================================

// ======================================================
// RÉCUPÉRER LES NOTIFICATIONS
// ======================================================

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const userRole = req.user.role;

    let result;

    if (userRole === "recruiter" || userRole === "admin") {
      result = await pool.query(
        `
        SELECT *
        FROM notifications
        ORDER BY created_at DESC
        LIMIT 100
        `
      );
    } else {
      result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id = $1 OR user_id IS NULL
        ORDER BY created_at DESC
        LIMIT 100
        `,
        [userId]
      );
    }

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération notifications :", error);

    res.status(500).json({
      success: false,
      message: "Erreur récupération notifications.",
      error: error.message,
    });
  }
};

// ======================================================
// MARQUER UNE NOTIFICATION COMME LUE
// ======================================================

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification introuvable.",
      });
    }

    res.json({
      success: true,
      message: "Notification marquée comme lue.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur lecture notification :", error);

    res.status(500).json({
      success: false,
      message: "Erreur mise à jour notification.",
      error: error.message,
    });
  }
};

// ======================================================
// MARQUER TOUTES LES NOTIFICATIONS COMME LUES
// ======================================================

const markAllNotificationsAsRead = async (req, res) => {
  try {
    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      `
    );

    res.json({
      success: true,
      message: "Toutes les notifications sont marquées comme lues.",
    });
  } catch (error) {
    console.error("Erreur lecture globale notifications :", error);

    res.status(500).json({
      success: false,
      message: "Erreur mise à jour notifications.",
      error: error.message,
    });
  }
};

// ======================================================
// SUPPRIMER UNE NOTIFICATION
// ======================================================

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification introuvable.",
      });
    }

    res.json({
      success: true,
      message: "Notification supprimée.",
    });
  } catch (error) {
    console.error("Erreur suppression notification :", error);

    res.status(500).json({
      success: false,
      message: "Erreur suppression notification.",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};