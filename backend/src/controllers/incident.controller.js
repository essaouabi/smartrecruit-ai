// ======================================================
// INCIDENT CONTROLLER - SMARTRECRUIT AI
// ======================================================

const pool = require("../config/db");
const { createIncident } = require("../services/incident.service");

// ======================================================
// RÉCUPÉRER TOUS LES INCIDENTS
// ======================================================

const getIncidents = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM incidents
      ORDER BY created_at DESC
      LIMIT 200
      `
    );

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Erreur récupération incidents :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur récupération incidents.",
      error: error.message,
    });
  }
};

// ======================================================
// STATISTIQUES INCIDENTS
// ======================================================

const getIncidentStats = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'open')::int AS open,
        COUNT(*) FILTER (WHERE status = 'investigating')::int AS investigating,
        COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved,
        COUNT(*) FILTER (WHERE severity = 'critical')::int AS critical,
        COUNT(*) FILTER (WHERE severity = 'high')::int AS high,
        COUNT(*) FILTER (WHERE severity = 'medium')::int AS medium,
        COUNT(*) FILTER (WHERE severity = 'low')::int AS low,
        COUNT(*) FILTER (WHERE source = 'ai')::int AS ai,
        COUNT(*) FILTER (WHERE source = 'backend')::int AS backend,
        COUNT(*) FILTER (WHERE source = 'database')::int AS database,
        COUNT(*) FILTER (WHERE source = 'frontend')::int AS frontend,
        COUNT(*) FILTER (WHERE source = 'api')::int AS api
      FROM incidents
      `
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur statistiques incidents :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur statistiques incidents.",
      error: error.message,
    });
  }
};

// ======================================================
// CRÉER UN INCIDENT MANUELLEMENT
// ======================================================

const createIncidentController = async (req, res) => {
  try {
    const {
      title,
      description,
      severity,
      status,
      source,
      entity,
      entity_id,
      detected_by,
      root_cause,
      solution,
      technical_logs,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Le titre et la description sont obligatoires.",
      });
    }

    const incident = await createIncident({
      req,
      title,
      description,
      severity: severity || "medium",
      status: status || "open",
      source: source || "backend",
      entity: entity || null,
      entityId: entity_id || null,
      detectedBy: detected_by || "SmartRecruit Monitoring",
      rootCause: root_cause || null,
      solution: solution || null,
      technicalLogs: technical_logs || null,
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
    });

    res.status(201).json({
      success: true,
      message: "Incident créé avec succès.",
      data: incident,
    });
  } catch (error) {
    console.error("Erreur création incident :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur création incident.",
      error: error.message,
    });
  }
};

// ======================================================
// CHANGER LE STATUT D’UN INCIDENT
// ======================================================

const updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["open", "investigating", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide.",
        allowedStatuses,
      });
    }

    const result = await pool.query(
      `
      UPDATE incidents
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = CASE
          WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP
          ELSE resolved_at
        END
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident introuvable.",
      });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("incident-updated", result.rows[0]);
    }

    res.json({
      success: true,
      message: "Statut incident mis à jour.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur mise à jour incident :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur mise à jour statut incident.",
      error: error.message,
    });
  }
};

// ======================================================
// MARQUER UN INCIDENT COMME CORRIGÉ
// ======================================================

const resolveIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { root_cause, solution, technical_logs } = req.body;

    const result = await pool.query(
      `
      UPDATE incidents
      SET
        status = 'resolved',
        root_cause = COALESCE($1, root_cause),
        solution = COALESCE($2, solution),
        technical_logs = COALESCE($3, technical_logs),
        resolved_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [
        root_cause || null,
        solution || null,
        technical_logs || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident introuvable.",
      });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("incident-resolved", result.rows[0]);
    }

    res.json({
      success: true,
      message: "Incident marqué comme corrigé.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur résolution incident :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur résolution incident.",
      error: error.message,
    });
  }
};

// ======================================================
// SUPPRIMER UN INCIDENT
// ======================================================

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM incidents
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident introuvable.",
      });
    }

    res.json({
      success: true,
      message: "Incident supprimé.",
    });
  } catch (error) {
    console.error("Erreur suppression incident :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur suppression incident.",
      error: error.message,
    });
  }
};

// ======================================================
// CRÉER UN INCIDENT DE DÉMONSTRATION
// ======================================================

const seedIncident = async (req, res) => {
  try {
    const incident = await createIncident({
      req,
      title: "Erreur analyse CV - réponse IA invalide",
      description:
        "Le service IA a retourné une réponse incomplète lors d'une analyse CV. Le backend a détecté l'absence de certains champs obligatoires.",
      severity: "high",
      status: "open",
      source: "ai",
      entity: "cv_analysis",
      entityId: null,
      detectedBy: "SmartRecruit AI Monitoring",
      rootCause:
        "Format de réponse IA non conforme au JSON attendu par le backend.",
      solution:
        "Ajouter une validation du format de réponse IA et un fallback automatique.",
      technicalLogs:
        "Missing fields: score, skills, decision. Endpoint: /api/cv/analyze-file",
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
    });

    res.status(201).json({
      success: true,
      message: "Incident de démonstration créé.",
      data: incident,
    });
  } catch (error) {
    console.error("Erreur création incident démo :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur création incident démo.",
      error: error.message,
    });
  }
};

module.exports = {
  getIncidents,
  getIncidentStats,
  createIncidentController,
  updateIncidentStatus,
  resolveIncident,
  deleteIncident,
  seedIncident,
};