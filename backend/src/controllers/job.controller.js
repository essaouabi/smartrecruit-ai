// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// GET ALL JOBS
// ===============================

const getJobs = async (req, res) => {
  try {
    const jobs = await pool.query(
      `
      SELECT *
      FROM jobs
      ORDER BY id DESC
      `
    );

    res.json(jobs.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur récupération offres",
    });
  }
};

// ===============================
// CREATE JOB
// ===============================

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (
      !title ||
      !description ||
      !company ||
      !location
    ) {
      return res.status(400).json({
        message:
          "Tous les champs de l’offre sont obligatoires.",
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        message:
          "La description doit contenir au moins 20 caractères.",
      });
    }

    // ===============================
    // INSERT JOB
    // ===============================

    const newJob = await pool.query(
      `
      INSERT INTO jobs
      (
        title,
        description,
        company,
        location
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        title,
        description,
        company,
        location,
      ]
    );

    res.status(201).json(newJob.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur création offre",
    });
  }
};

// ===============================
// DELETE JOB
// ===============================

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // ===============================
    // CHECK JOB EXISTS
    // ===============================

    const existingJob = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE id = $1
      `,
      [id]
    );

    if (existingJob.rows.length === 0) {
      return res.status(404).json({
        message: "Offre introuvable.",
      });
    }

    // ===============================
    // DELETE JOB
    // ===============================

    await pool.query(
      `
      DELETE FROM jobs
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Offre supprimée avec succès.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur suppression offre",
    });
  }
};

// ===============================
// CREATE DEMO JOBS
// ===============================

const seedJobs = async (req, res) => {
  try {
    await pool.query(
      `
      INSERT INTO jobs
      (
        title,
        description,
        company,
        location
      )
      VALUES
      (
        'Frontend React Developer',
        'React TypeScript Tailwind JavaScript HTML CSS API REST',
        'SmartRecruit',
        'Paris'
      ),
      (
        'AI Engineer',
        'Python Machine Learning Data API FastAPI SQL',
        'SmartRecruit',
        'Lyon'
      ),
      (
        'Backend Node.js Developer',
        'Node.js Express PostgreSQL Docker REST API Git',
        'SmartRecruit',
        'Remote'
      )
      `
    );

    res.json({
      message: "Offres de démonstration ajoutées.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur insertion offres de démonstration",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  getJobs,
  createJob,
  deleteJob,
  seedJobs,
};