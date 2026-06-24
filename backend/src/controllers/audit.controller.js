const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "recruiter" && userRole !== "admin") {
      return res.status(403).json({
        message: "Accès interdit. Réservé aux recruteurs.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        user_role,
        action,
        entity,
        entity_id,
        description,
        ip_address,
        created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 100
      `
    );

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération audit logs :", error);

    res.status(500).json({
      success: false,
      message: "Erreur récupération audit logs.",
      error: error.message,
    });
  }
};

const getAuditStats = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "recruiter" && userRole !== "admin") {
      return res.status(403).json({
        message: "Accès interdit. Réservé aux recruteurs.",
      });
    }

    const totalLogs = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM audit_logs
      `
    );

    const logsByAction = await pool.query(
      `
      SELECT action, COUNT(*)::int AS total
      FROM audit_logs
      GROUP BY action
      ORDER BY total DESC
      `
    );

    const latestLogs = await pool.query(
      `
      SELECT
        id,
        action,
        entity,
        description,
        user_role,
        created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 10
      `
    );

    res.json({
      success: true,
      totalLogs: totalLogs.rows[0]?.total || 0,
      logsByAction: logsByAction.rows,
      latestLogs: latestLogs.rows,
    });
  } catch (error) {
    console.error("Erreur statistiques audit logs :", error);

    res.status(500).json({
      success: false,
      message: "Erreur statistiques audit logs.",
      error: error.message,
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditStats,
};