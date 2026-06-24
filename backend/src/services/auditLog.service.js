const pool = require("../config/db");

const getIpAddress = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

const logAudit = async ({
  req,
  userId = null,
  userRole = null,
  action,
  entity = null,
  entityId = null,
  description = null,
}) => {
  try {
    if (!action) return;

    const ipAddress = req ? getIpAddress(req) : "system";

    await pool.query(
      `
      INSERT INTO audit_logs
      (
        user_id,
        user_role,
        action,
        entity,
        entity_id,
        description,
        ip_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        userId,
        userRole,
        action,
        entity,
        entityId,
        description,
        ipAddress,
      ]
    );
  } catch (error) {
    console.error("Erreur audit log :", error.message);
  }
};

module.exports = {
  logAudit,
};