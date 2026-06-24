// ======================================================
// DASHBOARD CONTROLLER - SMARTRECRUIT AI
// ======================================================

const pool = require("../config/db");

// ======================================================
// GET DASHBOARD STATS
// ======================================================

const getDashboardStats = async (req, res) => {
  try {

    // =====================================
    // TOTAL OFFRES
    // =====================================

    const jobsCount = await pool.query(
      "SELECT COUNT(*) FROM jobs"
    );

    // =====================================
    // TOTAL CANDIDATS
    // =====================================

    const candidatesCount = await pool.query(
      "SELECT COUNT(*) FROM candidates"
    );

    // =====================================
    // SCORE MOYEN
    // =====================================

    const averageScoreResult = await pool.query(
      "SELECT AVG(score) FROM candidates"
    );

    // =====================================
    // SCORE MAXIMUM
    // =====================================

    const maxScoreResult = await pool.query(
      "SELECT MAX(score) FROM candidates"
    );

    // =====================================
    // SCORE MINIMUM
    // =====================================

    const minScoreResult = await pool.query(
      "SELECT MIN(score) FROM candidates"
    );

    // =====================================
    // CANDIDATS ACCEPTÉS
    // =====================================

    const acceptedCandidates = await pool.query(`
      SELECT COUNT(*)
      FROM candidates
      WHERE score >= 80
    `);

    // =====================================
    // CANDIDATS REFUSÉS
    // =====================================

    const rejectedCandidates = await pool.query(`
      SELECT COUNT(*)
      FROM candidates
      WHERE score < 50
    `);

    // =====================================
    // DERNIÈRES OFFRES
    // =====================================

    const latestJobs = await pool.query(`
      SELECT *
      FROM jobs
      ORDER BY id DESC
      LIMIT 5
    `);

    // =====================================
    // TOP CANDIDATS
    // =====================================

    const topCandidates = await pool.query(`
      SELECT *
      FROM candidates
      ORDER BY score DESC
      LIMIT 5
    `);

    // =====================================
    // DERNIÈRES ANALYSES
    // =====================================

    const latestCandidates = await pool.query(`
      SELECT *
      FROM candidates
      ORDER BY id DESC
      LIMIT 5
    `);

    // =====================================
    // FORMATAGE DES DONNÉES
    // =====================================

    const averageScore =
      averageScoreResult.rows[0].avg
        ? Math.round(
            Number(
              averageScoreResult.rows[0].avg
            )
          )
        : 0;

    const maxScore =
      maxScoreResult.rows[0].max
        ? Number(
            maxScoreResult.rows[0].max
          )
        : 0;

    const minScore =
      minScoreResult.rows[0].min
        ? Number(
            minScoreResult.rows[0].min
          )
        : 0;

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,

      stats: {
        totalJobs: Number(
          jobsCount.rows[0].count
        ),

        totalCandidates: Number(
          candidatesCount.rows[0].count
        ),

        totalAnalyses: Number(
          candidatesCount.rows[0].count
        ),

        averageScore,

        maxScore,

        minScore,

        acceptedCandidates: Number(
          acceptedCandidates.rows[0].count
        ),

        rejectedCandidates: Number(
          rejectedCandidates.rows[0].count
        ),

        generatedAt:
          new Date().toISOString(),
      },

      latestJobs:
        latestJobs.rows,

      topCandidates:
        topCandidates.rows,

      latestCandidates:
        latestCandidates.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Erreur récupération statistiques dashboard",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getDashboardStats,
};