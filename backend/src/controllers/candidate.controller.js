// ======================================================
// CANDIDATE CONTROLLER - SMARTRECRUIT AI
// ======================================================

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
      strengths,
      weaknesses,
      advice,
      profileLevel,
      yearsExperience,
      interviewQuestions,
      hrRecommendation,
    } = req.body;

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
        job_context,
        strengths,
        weaknesses,
        advice,
        profile_level,
        years_experience,
        interview_questions,
        hr_recommendation
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18
      )
      RETURNING *
      `,
      [
        name || "",
        title || "",
        email || "",
        phone || "",
        linkedin || "",
        github || "",
        Number(score) || 0,
        Array.isArray(skills) ? skills.join(", ") : skills || "",
        Array.isArray(missingSkills)
          ? missingSkills.join(", ")
          : missingSkills || "",
        summary || "",
        jobContext || "",
        Array.isArray(strengths) ? strengths.join(" | ") : strengths || "",
        Array.isArray(weaknesses) ? weaknesses.join(" | ") : weaknesses || "",
        Array.isArray(advice) ? advice.join(" | ") : advice || "",
        profileLevel || "",
        Number(yearsExperience) || 0,
        Array.isArray(interviewQuestions)
          ? interviewQuestions.join(" | ")
          : interviewQuestions || "",
        hrRecommendation || "",
      ]
    );

    res.status(201).json(newCandidate.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur sauvegarde candidat",
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
      ORDER BY id DESC
      `
    );

    res.status(200).json(candidates.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération candidats",
    });
  }
};

// ===============================
// GET CANDIDATE BY ID
// ===============================

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "ID candidat invalide",
      });
    }

    const candidate = await pool.query(
      `
      SELECT *
      FROM candidates
      WHERE id = $1
      `,
      [id]
    );

    if (candidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    res.status(200).json(candidate.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération détail candidat",
    });
  }
};

// ===============================
// UPDATE CANDIDATE DECISION
// ===============================

const updateCandidateDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, decision_color } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "ID candidat invalide",
      });
    }

    if (!decision || !decision_color) {
      return res.status(400).json({
        message: "Décision et couleur obligatoires",
      });
    }

    const updatedCandidate = await pool.query(
      `
      UPDATE candidates
      SET decision = $1,
          decision_color = $2
      WHERE id = $3
      RETURNING *
      `,
      [decision, decision_color, id]
    );

    if (updatedCandidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    res.status(200).json({
      message: "Décision candidat mise à jour",
      candidate: updatedCandidate.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur mise à jour décision candidat",
    });
  }
};

// ===============================
// DELETE CANDIDATE
// ===============================

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "ID candidat invalide",
      });
    }

    const deletedCandidate = await pool.query(
      `
      DELETE FROM candidates
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (deletedCandidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    res.status(200).json({
      message: "Candidat supprimé",
      candidate: deletedCandidate.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur suppression candidat",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  saveCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateDecision,
  deleteCandidate,
};