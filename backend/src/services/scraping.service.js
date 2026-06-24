// =====================================================
// SERVICE SCRAPING - SMARTRECRUIT AI
// Compatible ancienne et nouvelle table jobs
// =====================================================

const pool = require("../config/db");

// =====================================================
// NETTOYAGE DU TEXTE
// =====================================================

const cleanText = (value) => {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .replace(/\s+/g, " ");
};

// =====================================================
// RÉCUPÉRER LES COLONNES EXISTANTES DE LA TABLE JOBS
// =====================================================

const getJobColumns = async () => {
  const result = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'jobs'
  `);

  return new Set(result.rows.map((row) => row.column_name));
};

// =====================================================
// EXTRACTION SIMPLE DES COMPÉTENCES
// =====================================================

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

  const detectedSkills = skillsList.filter((skill) =>
    description.toLowerCase().includes(skill.toLowerCase())
  );

  return detectedSkills.join(", ");
};

// =====================================================
// INSERTION DYNAMIQUE SELON LES COLONNES EXISTANTES
// =====================================================

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

  if (keys.length === 0) {
    throw new Error("Aucune colonne valide trouvée pour insérer l'offre.");
  }

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

// =====================================================
// SCRAPING DES OFFRES D'EMPLOI
// =====================================================

const scrapeJobs = async () => {
  const jobs = [
    {
      title: "Développeur Full Stack React",
      company: "Tech Solutions",
      location: "Lyon",
      contract_type: "CDI",
      source: "SmartRecruit Scraper",
      description:
        "Développement React, Node.js, Express, PostgreSQL, API REST et Docker.",
    },
    {
      title: "Ingénieur IA",
      company: "AI Company",
      location: "Paris",
      contract_type: "CDI",
      source: "SmartRecruit Scraper",
      description:
        "Machine Learning, IA Générative, Python, API REST et analyse de données.",
    },
    {
      title: "Développeur Backend Node.js",
      company: "DataSoft",
      location: "Villeurbanne",
      contract_type: "Alternance",
      source: "SmartRecruit Scraper",
      description:
        "Création d'API REST sécurisées avec Node.js, Express, JWT et PostgreSQL.",
    },
    {
      title: "Développeur Intelligence Artificielle",
      company: "AI Recruit",
      location: "Paris",
      contract_type: "Stage",
      source: "SmartRecruit Scraper",
      description:
        "Intégration de services IA, Python, Machine Learning, API REST et automatisation.",
    },
    {
      title: "Développeur Frontend React TypeScript",
      company: "Frontend Studio",
      location: "Remote",
      contract_type: "Freelance",
      source: "SmartRecruit Scraper",
      description:
        "Développement d'interfaces modernes avec React, TypeScript, HTML, CSS et Bootstrap.",
    },
  ];

  let insertedJobs = 0;
  let skippedDuplicates = 0;

  for (const job of jobs) {
    const cleanJob = {
      title: cleanText(job.title),
      company: cleanText(job.company),
      location: cleanText(job.location),
      description: cleanText(job.description),
      contract_type: cleanText(job.contract_type),
      source: cleanText(job.source),
    };

    const skills = extractSkills(cleanJob.description);

    const existingJob = await pool.query(
      `
      SELECT id
      FROM jobs
      WHERE LOWER(title) = LOWER($1)
      AND LOWER(company) = LOWER($2)
      AND LOWER(location) = LOWER($3)
      `,
      [
        cleanJob.title,
        cleanJob.company,
        cleanJob.location,
      ]
    );

    if (existingJob.rows.length > 0) {
      skippedDuplicates++;
      continue;
    }

    await insertJobDynamic({
      title: cleanJob.title,
      description: cleanJob.description,
      company: cleanJob.company,
      location: cleanJob.location,
      source: cleanJob.source,
      skills,
      contract_type: cleanJob.contract_type,
      scraped_at: new Date(),
    });

    insertedJobs++;
  }

  return {
    success: true,
    totalScraped: jobs.length,
    insertedJobs,
    skippedDuplicates,
    message:
      "Collecte terminée avec nettoyage, contrôle des doublons et insertion sécurisée.",
  };
};

module.exports = {
  scrapeJobs,
};