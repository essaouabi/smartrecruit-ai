// ======================================================
// AI MONITORING SERVICE - SMARTRECRUIT AI
// ======================================================
// Service pour historiser les appels IA :
// - analyses CV
// - scores IA
// - erreurs IA
// - temps de réponse
// - tokens consommés
// ======================================================

const pool = require("../config/db");

// ======================================================
// NORMALISATION DU STATUT
// ======================================================

const normalizeStatus = (status) => {
  const allowedStatuses = ["success", "error"];

  if (!status || !allowedStatuses.includes(status)) {
    return "success";
  }

  return status;
};

// ======================================================
// NORMALISATION DU TYPE D'ANALYSE
// ======================================================

const normalizeAnalysisType = (analysisType) => {
  if (!analysisType) {
    return "cv_analysis";
  }

  return analysisType;
};

// ======================================================
// CRÉER UN LOG IA
// ======================================================

const createAILog = async ({
  req = null,

  analysisType = "cv_analysis",
  endpoint = null,
  model = "SmartRecruit AI Engine",

  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,

  score = null,
  decision = null,

  status = "success",
  responseTimeMs = 0,
  errorMessage = null,

  cvName = null,
  jobContext = null,

  userId = null,
  userRole = null,
}) => {
  try {
    const finalStatus = normalizeStatus(status);
    const finalAnalysisType = normalizeAnalysisType(analysisType);

    const result = await pool.query(
      `
      INSERT INTO ai_logs (
        analysis_type,
        endpoint,
        model,
        prompt_tokens,
        completion_tokens,
        total_tokens,
        score,
        decision,
        status,
        response_time_ms,
        error_message,
        cv_name,
        job_context,
        user_id,
        user_role
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15
      )
      RETURNING *
      `,
      [
        finalAnalysisType,
        endpoint,
        model,
        promptTokens,
        completionTokens,
        totalTokens,
        score,
        decision,
        finalStatus,
        responseTimeMs,
        errorMessage,
        cvName,
        jobContext,
        userId,
        userRole,
      ]
    );

    const aiLog = result.rows[0];

    const io = req?.app?.get("io");

    if (io) {
      io.emit("ai-log-created", {
        type: "ai-monitoring",
        title:
          finalStatus === "success"
            ? "Analyse IA réussie"
            : "Erreur IA détectée",
        status: finalStatus,
        score,
        responseTimeMs,
        date: aiLog.created_at,
        data: aiLog,
      });

      io.emit("monitoring-log", {
        type: finalStatus === "success" ? "info" : "error",
        message:
          finalStatus === "success"
            ? `Analyse IA réussie - score ${score || 0}%`
            : `Erreur IA détectée - ${errorMessage || "Erreur inconnue"}`,
        date: aiLog.created_at,
        data: aiLog,
      });
    }

    return aiLog;
  } catch (error) {
    console.error("Erreur création AI log :", error.message);
    return null;
  }
};

// ======================================================
// LOG IA RÉUSSI
// ======================================================

const logAISuccess = async ({
  req = null,
  endpoint = null,
  model = "SmartRecruit AI Engine",

  score = null,
  decision = null,
  responseTimeMs = 0,

  cvName = null,
  jobContext = null,

  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,

  userId = null,
  userRole = null,
}) => {
  return createAILog({
    req,

    analysisType: "cv_analysis",
    endpoint,
    model,

    promptTokens,
    completionTokens,
    totalTokens,

    score,
    decision,

    status: "success",
    responseTimeMs,
    errorMessage: null,

    cvName,
    jobContext,

    userId,
    userRole,
  });
};

// ======================================================
// LOG IA EN ERREUR
// ======================================================

const logAIError = async ({
  req = null,
  endpoint = null,
  model = "SmartRecruit AI Engine",

  responseTimeMs = 0,
  errorMessage = "Erreur IA inconnue.",

  cvName = null,
  jobContext = null,

  userId = null,
  userRole = null,
}) => {
  return createAILog({
    req,

    analysisType: "cv_analysis",
    endpoint,
    model,

    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,

    score: null,
    decision: "Erreur IA",

    status: "error",
    responseTimeMs,
    errorMessage,

    cvName,
    jobContext,

    userId,
    userRole,
  });
};

// ======================================================
// LOG IA DEPUIS UNE ANALYSE CV
// ======================================================

const logCVAnalysisAI = async ({
  req = null,

  score = null,
  decision = null,
  responseTimeMs = 0,

  cvName = null,
  jobContext = null,

  userId = null,
  userRole = null,
}) => {
  return logAISuccess({
    req,
    endpoint: "/api/cv/analyze",
    model: "SmartRecruit AI Engine",
    score,
    decision,
    responseTimeMs,
    cvName,
    jobContext,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    userId,
    userRole,
  });
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createAILog,
  logAISuccess,
  logAIError,
  logCVAnalysisAI,
};