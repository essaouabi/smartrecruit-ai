// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// HELPERS
// ===============================

const cleanText = (value) => {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .replace(/\s+/g, " ");
};

const extractSkills = (description) => {
  if (!description) return "";

  const skillsList = [
    "React",
    "Node.js",
    "Express",
    "PostgreSQL",
    "JavaScript",
    "TypeScript",
    "Python",
    "Machine Learning",
    "IA",
    "API REST",
    "JWT",
    "Docker",
    "GitHub",
    "SQL",
    "MongoDB",
    "Angular",
    "HTML",
    "CSS",
    "Bootstrap",
    "Tailwind",
    "FastAPI",
  ];

  return skillsList
    .filter((skill) =>
      description.toLowerCase().includes(skill.toLowerCase())
    )
    .join(", ");
};

const getJobColumns = async () => {
  const result = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'jobs'
  `);

  return new Set(result.rows.map((row) => row.column_name));
};

const insertJobDynamic = async (jobData) => {
  const columns = await getJobColumns();

  const allowedData = {};

  Object.keys(jobData).forEach((key) => {
    if (columns.has(key)) {
      allowedData[key] = jobData[key];
    }
  });

  const keys = Object.keys(allowedData);
  const values = Object.values(allowedData);

  const placeholders = keys
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const query = `
    INSERT INTO jobs (${keys.join(", ")})
    VALUES (${placeholders})
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};

// ===============================
// GET ALL JOBS
// ===============================

const getJobs = async (req, res) => {
  try {
    const columns = await getJobColumns();

    const selectedColumns = [
      "id",
      "title",
      "description",
      "company",
      "location",
      "created_at",
      "source",
      "skills",
      "contract_type",
      "scraped_at",
    ].filter((column) => columns.has(column));

    const jobs = await pool.query(`
      SELECT ${selectedColumns.join(", ")}
      FROM jobs
      ORDER BY id DESC
    `);

    res.json(jobs.rows);
  } catch (error) {
    console.error("Erreur getJobs :", error);

    res.status(500).json({
      message: "Erreur récupération offres",
      error: error.message,
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
      contract_type,
      source,
      skills,
    } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({
        message: "Tous les champs de l’offre sont obligatoires.",
      });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        message: "La description doit contenir au moins 20 caractères.",
      });
    }

    const cleanJob = {
      title: cleanText(title),
      description: cleanText(description),
      company: cleanText(company),
      location: cleanText(location),
      source: cleanText(source) || "Manual",
      skills: cleanText(skills) || extractSkills(description),
      contract_type: cleanText(contract_type) || "Non précisé",
      scraped_at: null,
    };

    const newJob = await insertJobDynamic(cleanJob);

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Erreur createJob :", error);

    res.status(500).json({
      message: "Erreur création offre",
      error: error.message,
    });
  }
};

// ===============================
// DELETE JOB
// ===============================

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

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

    await pool.query(
      `
      DELETE FROM applications
      WHERE job_id = $1
      `,
      [id]
    );

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
    console.error("Erreur deleteJob :", error);

    res.status(500).json({
      message: "Erreur suppression offre",
      error: error.message,
    });
  }
};

// ===============================
// CREATE DEMO JOBS
// ===============================

const seedJobs = async (req, res) => {
  try {
    const demoJobs = [
      {
        title: "Frontend React Developer",
        description:
          "React TypeScript Tailwind JavaScript HTML CSS API REST",
        company: "SmartRecruit",
        location: "Paris",
        source: "Demo",
        skills:
          "React, TypeScript, Tailwind, JavaScript, HTML, CSS, API REST",
        contract_type: "CDI",
        scraped_at: null,
      },
      {
        title: "AI Engineer",
        description:
          "Python Machine Learning Data API FastAPI SQL",
        company: "SmartRecruit",
        location: "Lyon",
        source: "Demo",
        skills: "Python, Machine Learning, API REST, FastAPI, SQL",
        contract_type: "CDI",
        scraped_at: null,
      },
      {
        title: "Backend Node.js Developer",
        description:
          "Node.js Express PostgreSQL Docker REST API Git",
        company: "SmartRecruit",
        location: "Remote",
        source: "Demo",
        skills: "Node.js, Express, PostgreSQL, Docker, API REST, Git",
        contract_type: "Alternance",
        scraped_at: null,
      },
    ];

    let insertedJobs = 0;
    let skippedDuplicates = 0;

    for (const job of demoJobs) {
      const existingJob = await pool.query(
        `
        SELECT id
        FROM jobs
        WHERE LOWER(title) = LOWER($1)
        AND LOWER(company) = LOWER($2)
        AND LOWER(location) = LOWER($3)
        `,
        [job.title, job.company, job.location]
      );

      if (existingJob.rows.length > 0) {
        skippedDuplicates++;
        continue;
      }

      await insertJobDynamic(job);
      insertedJobs++;
    }

    res.json({
      message: "Offres de démonstration ajoutées.",
      total: demoJobs.length,
      insertedJobs,
      skippedDuplicates,
    });
  } catch (error) {
    console.error("Erreur seedJobs :", error);

    res.status(500).json({
      message: "Erreur insertion offres de démonstration",
      error: error.message,
    });
  }
};

// ===============================
// APPLY TO JOB
// ===============================

const applyJob = async (req, res) => {
  try {
    const { id } = req.params;
    const candidateId = req.user.id || req.user.userId;

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

    const existingApplication = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE candidate_id = $1
      AND job_id = $2
      `,
      [candidateId, id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        message: "Vous avez déjà postulé à cette offre.",
      });
    }

    await pool.query(
      `
      INSERT INTO applications
      (
        candidate_id,
        job_id,
        status
      )
      VALUES ($1, $2, $3)
      `,
      [candidateId, id, "En attente"]
    );

    res.json({
      message: "Candidature envoyée avec succès.",
    });
  } catch (error) {
    console.error("Erreur applyJob :", error);

    res.status(500).json({
      message: "Erreur candidature.",
      error: error.message,
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
  applyJob,
};