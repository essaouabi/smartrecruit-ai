const pool = require("../config/db");

// =====================================================
// CANDIDAT : SAUVEGARDER UN CV
// =====================================================

const saveCandidateCV = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const { file_name, cv_text } = req.body;

    if (!file_name || !cv_text) {
      return res.status(400).json({
        message: "Nom du fichier et contenu du CV obligatoires.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO candidate_cvs
      (
        user_id,
        file_name,
        cv_text
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, file_name, cv_text]
    );

    res.status(201).json({
      message: "CV sauvegardé avec succès.",
      cv: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur sauvegarde CV.",
    });
  }
};

// =====================================================
// CANDIDAT : VOIR MES CVS
// =====================================================

const getMyCandidateCVs = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        file_name,
        created_at
      FROM candidate_cvs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération des CV.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  saveCandidateCV,
  getMyCandidateCVs,
};