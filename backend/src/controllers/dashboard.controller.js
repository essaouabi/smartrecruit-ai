// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// GET DASHBOARD STATS
// ===============================

const getDashboardStats = async (req, res) => {
  try {
    // Nombre total d'offres
    const jobsCount = await pool.query(
      "SELECT COUNT(*) FROM jobs"
    );

    // Nombre total de candidats analysés
    const candidatesCount = await pool.query(
      "SELECT COUNT(*) FROM candidates"
    );

    // Score IA moyen réel
    const averageScoreResult = await pool.query(
      "SELECT AVG(score) FROM candidates"
    );

    // Les 5 dernières offres
    const latestJobs = await pool.query(
      "SELECT * FROM jobs ORDER BY id DESC LIMIT 5"
    );

    // Top candidats par score IA
    const topCandidates = await pool.query(
      `
      SELECT *
      FROM candidates
      ORDER BY score DESC
      LIMIT 5
      `
    );

    // Dernières analyses CV
    const latestCandidates = await pool.query(
      `
      SELECT *
      FROM candidates
      ORDER BY id DESC
      LIMIT 5
      `
    );

    // Score moyen converti
    const averageScore = averageScoreResult.rows[0].avg
      ? Math.round(Number(averageScoreResult.rows[0].avg))
      : 0;

    // Réponse dashboard
    res.json({
      totalJobs: Number(jobsCount.rows[0].count),
      totalCandidates: Number(candidatesCount.rows[0].count),
      averageScore,
      interviews: 0,
      latestJobs: latestJobs.rows,
      topCandidates: topCandidates.rows,
      latestCandidates: latestCandidates.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur récupération statistiques dashboard",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  getDashboardStats,
};