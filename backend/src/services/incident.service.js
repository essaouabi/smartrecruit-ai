// ======================================================
// INCIDENT SERVICE - SMARTRECRUIT AI
// ======================================================
// Service centralisé pour créer et gérer les incidents
// techniques dans PostgreSQL.
// ======================================================

const pool = require("../config/db");

// ======================================================
// NORMALISATION DES VALEURS
// ======================================================

const normalizeSeverity = (severity) => {
  const allowedSeverities = ["low", "medium", "high", "critical"];

  if (!severity || !allowedSeverities.includes(severity)) {
    return "medium";
  }

  return severity;
};

const normalizeStatus = (status) => {
  const allowedStatuses = ["open", "investigating", "resolved"];

  if (!status || !allowedStatuses.includes(status)) {
    return "open";
  }

  return status;
};

const normalizeSource = (source) => {
  const allowedSources = [
    "backend",
    "frontend",
    "database",
    "ai",
    "api",
    "monitoring",
    "security",
    "unknown",
  ];

  if (!source || !allowedSources.includes(source)) {
    return "backend";
  }

  return source;
};

// ======================================================
// CRÉATION D'UN INCIDENT
// ======================================================

const createIncident = async ({
  req = null,

  title,
  description,

  severity = "medium",
  status = "open",
  source = "backend",

  entity = null,
  entityId = null,

  detectedBy = "SmartRecruit Monitoring",
  rootCause = null,
  solution = null,
  technicalLogs = null,

  userId = null,
  userRole = null,
}) => {
  try {
    if (!title || !description) {
      console.warn(
        "Incident non créé : title et description sont obligatoires."
      );
      return null;
    }

    const finalSeverity = normalizeSeverity(severity);
    const finalStatus = normalizeStatus(status);
    const finalSource = normalizeSource(source);

    const result = await pool.query(
      `
      INSERT INTO incidents (
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
        user_id,
        user_role
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13
      )
      RETURNING *
      `,
      [
        title,
        description,
        finalSeverity,
        finalStatus,
        finalSource,
        entity,
        entityId,
        detectedBy,
        rootCause,
        solution,
        technicalLogs,
        userId,
        userRole,
      ]
    );

    const incident = result.rows[0];

    const io = req?.app?.get("io");

    if (io) {
      io.emit("incident-created", {
        type: "incident",
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status,
        source: incident.source,
        date: incident.created_at,
        data: incident,
      });

      io.emit("notification", {
        type: "error",
        title: "Nouvel incident détecté",
        message: incident.title,
        date: incident.created_at,
        data: incident,
      });
    }

    return incident;
  } catch (error) {
    console.error("Erreur création incident :", error.message);
    return null;
  }
};

// ======================================================
// MARQUER UN INCIDENT COMME EN COURS D'ANALYSE
// ======================================================

const markIncidentAsInvestigating = async (incidentId) => {
  try {
    const result = await pool.query(
      `
      UPDATE incidents
      SET
        status = 'investigating',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [incidentId]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Erreur passage incident en investigation :", error.message);
    return null;
  }
};

// ======================================================
// MARQUER UN INCIDENT COMME RÉSOLU
// ======================================================

const markIncidentAsResolved = async ({
  incidentId,
  rootCause = null,
  solution = null,
  technicalLogs = null,
}) => {
  try {
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
      [rootCause, solution, technicalLogs, incidentId]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Erreur résolution incident :", error.message);
    return null;
  }
};

// ======================================================
// METTRE À JOUR updated_at
// ======================================================

const touchIncident = async (incidentId) => {
  try {
    await pool.query(
      `
      UPDATE incidents
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [incidentId]
    );

    return true;
  } catch (error) {
    console.error("Erreur mise à jour updated_at incident :", error.message);
    return false;
  }
};

// ======================================================
// CRÉER UN INCIDENT BACKEND AUTOMATIQUE
// ======================================================

const createBackendIncident = async ({
  req = null,
  error,
  route = null,
  method = null,
  userId = null,
  userRole = null,
}) => {
  const errorMessage =
    error?.message || "Une erreur backend inconnue a été détectée.";

  const technicalLogs = error?.stack || errorMessage;

  return createIncident({
    req,
    title: "Erreur backend détectée",
    description: errorMessage,
    severity: "high",
    status: "open",
    source: "backend",
    entity: "server",
    entityId: null,
    detectedBy: "Express Error Handler",
    rootCause: "Erreur non capturée dans une route backend.",
    solution:
      "Analyser les logs backend, identifier la route concernée et appliquer une correction.",
    technicalLogs: `${method || ""} ${route || ""} - ${technicalLogs}`,
    userId,
    userRole,
  });
};

// ======================================================
// CRÉER UN INCIDENT IA AUTOMATIQUE
// ======================================================

const createAIIncident = async ({
  req = null,
  title = "Erreur service IA",
  description = "Une erreur a été détectée lors de l'utilisation du service IA.",
  technicalLogs = null,
  userId = null,
  userRole = null,
}) => {
  return createIncident({
    req,
    title,
    description,
    severity: "high",
    status: "open",
    source: "ai",
    entity: "ai_service",
    entityId: null,
    detectedBy: "SmartRecruit AI Monitoring",
    rootCause: "Erreur ou réponse invalide du service IA.",
    solution:
      "Vérifier le prompt, la clé API, le format JSON attendu et ajouter un fallback.",
    technicalLogs,
    userId,
    userRole,
  });
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createIncident,
  createBackendIncident,
  createAIIncident,
  markIncidentAsInvestigating,
  markIncidentAsResolved,
  touchIncident,
};