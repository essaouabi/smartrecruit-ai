// ======================================================
// AI MONITORING CONTROLLER - SMARTRECRUIT AI
// ======================================================

const pool = require("../config/db");

const {
  createAILog,
  logAISuccess,
  logAIError,
} = require("../services/aiMonitoring.service");

// ======================================================
// RÉCUPÉRER TOUS LES LOGS IA
// ======================================================

const getAILogs = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM ai_logs
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
    console.error("Erreur récupération logs IA :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur récupération logs IA.",
      error: error.message,
    });
  }
};

// ======================================================
// STATISTIQUES GLOBALES IA
// ======================================================

const getAIStats = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,

        COUNT(*) FILTER (
          WHERE status = 'success'
        )::int AS success,

        COUNT(*) FILTER (
          WHERE status = 'error'
        )::int AS errors,

        COALESCE(ROUND(AVG(score))::int, 0) AS average_score,

        COALESCE(
          ROUND(AVG(response_time_ms))::int,
          0
        ) AS average_response_time,

        COALESCE(SUM(prompt_tokens), 0)::int AS prompt_tokens,
        COALESCE(SUM(completion_tokens), 0)::int AS completion_tokens,
        COALESCE(SUM(total_tokens), 0)::int AS total_tokens,

        COUNT(*) FILTER (
          WHERE created_at::date = CURRENT_DATE
        )::int AS today,

        COUNT(*) FILTER (
          WHERE created_at >= NOW() - INTERVAL '7 days'
        )::int AS last_7_days

      FROM ai_logs
      `
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur statistiques IA :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur statistiques IA.",
      error: error.message,
    });
  }
};

// ======================================================
// STATISTIQUES IA PAR JOUR
// ======================================================

const getAIDailyStats = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        TO_CHAR(created_at::date, 'DD/MM') AS day,

        COUNT(*)::int AS total,

        COUNT(*) FILTER (
          WHERE status = 'success'
        )::int AS success,

        COUNT(*) FILTER (
          WHERE status = 'error'
        )::int AS errors,

        COALESCE(ROUND(AVG(score))::int, 0) AS average_score,

        COALESCE(
          ROUND(AVG(response_time_ms))::int,
          0
        ) AS average_response_time

      FROM ai_logs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY created_at::date
      ORDER BY created_at::date ASC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Erreur statistiques IA journalières :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur statistiques IA journalières.",
      error: error.message,
    });
  }
};

// ======================================================
// CRÉER UN LOG IA MANUELLEMENT
// ======================================================

const createAILogController = async (req, res) => {
  try {
    const {
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
    } = req.body;

    const aiLog = await createAILog({
      req,

      analysisType: analysis_type || "cv_analysis",
      endpoint: endpoint || "/api/cv/analyze",
      model: model || "SmartRecruit AI Engine",

      promptTokens: prompt_tokens || 0,
      completionTokens: completion_tokens || 0,
      totalTokens: total_tokens || 0,

      score: score || null,
      decision: decision || null,

      status: status || "success",
      responseTimeMs: response_time_ms || 0,
      errorMessage: error_message || null,

      cvName: cv_name || null,
      jobContext: job_context || null,

      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
    });

    res.status(201).json({
      success: true,
      message: "Log IA créé avec succès.",
      data: aiLog,
    });
  } catch (error) {
    console.error("Erreur création log IA :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur création log IA.",
      error: error.message,
    });
  }
};

// ======================================================
// CRÉER DES LOGS IA DE DÉMONSTRATION
// ======================================================

const seedAILogs = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || null;
    const userRole = req.user?.role || null;

    const successLog = await logAISuccess({
      req,
      endpoint: "/api/cv/analyze",
      model: "SmartRecruit AI Engine",
      score: 87,
      decision: "Profil recommandé",
      responseTimeMs: 1240,
      cvName: "cv_candidat_demo.pdf",
      jobContext: "Développeur Fullstack React Node.js",
      promptTokens: 420,
      completionTokens: 210,
      totalTokens: 630,
      userId,
      userRole,
    });

    const errorLog = await logAIError({
      req,
      endpoint: "/api/cv/analyze-file",
      model: "SmartRecruit AI Engine",
      responseTimeMs: 3100,
      errorMessage:
        "Réponse IA invalide : champs score, skills ou decision manquants.",
      cvName: "cv_incomplet.pdf",
      jobContext: "Data Analyst Junior",
      userId,
      userRole,
    });

    res.status(201).json({
      success: true,
      message: "Logs IA de démonstration créés.",
      data: [successLog, errorLog],
    });
  } catch (error) {
    console.error("Erreur création logs IA démo :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur création logs IA démo.",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getAILogs,
  getAIStats,
  getAIDailyStats,
  createAILogController,
  seedAILogs,
};