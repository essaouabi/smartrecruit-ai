// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// SAVE CANDIDATE ANALYSIS
// ===============================

const saveCandidate = async (req, res) => {
  try {

    const {
      name,
      title,
      email,
      phone,
      linkedin,
      github,
      score,
      skills,
      missingSkills,
      summary,
      jobContext,
    } = req.body;

    // ===============================
    // INSERT DATABASE
    // ===============================

    const newCandidate = await pool.query(
      `
      INSERT INTO candidates
      (
        name,
        title,
        email,
        phone,
        linkedin,
        github,
        score,
        skills,
        missing_skills,
        summary,
        job_context
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )

      RETURNING *
      `,
      [
        name,

        title,

        email,

        phone,

        linkedin,

        github,

        score,

        skills.join(", "),

        missingSkills.join(", "),

        summary,

        jobContext,
      ]
    );

    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json(
      newCandidate.rows[0]
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur sauvegarde candidat",
    });

  }
};

// ===============================
// GET ALL CANDIDATES
// ===============================

const getCandidates = async (req, res) => {
  try {

    const candidates = await pool.query(
      `
      SELECT *
      FROM candidates
      ORDER BY score DESC
      `
    );

    res.json(candidates.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur récupération candidats",
    });

  }
};

// ===============================
// DELETE CANDIDATE
// ===============================

const deleteCandidate = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM candidates
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message:
        "Candidat supprimé",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur suppression candidat",
    });

  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  saveCandidate,
  getCandidates,
  deleteCandidate,
};