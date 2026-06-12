// Importer la connexion PostgreSQL
const pool = require("./db");

// Fonction création tables
const initDb = async () => {
  try {

    // =========================
    // TABLE USERS
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,

        -- Nom complet utilisateur
        fullname VARCHAR(255) NOT NULL,

        -- Email utilisateur unique
        email VARCHAR(255) UNIQUE NOT NULL,

        -- Mot de passe crypté
        password TEXT NOT NULL,

        -- Rôle utilisateur
        role VARCHAR(50) NOT NULL,

        -- Date création compte
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // TABLE JOBS
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,

        -- Titre emploi
        title VARCHAR(255) NOT NULL,

        -- Description offre
        description TEXT NOT NULL,

        -- Entreprise
        company VARCHAR(255),

        -- Localisation
        location VARCHAR(255),

        -- Date création
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // TABLE APPLICATIONS
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,

        -- ID candidat
        candidate_id INTEGER REFERENCES users(id),

        -- ID offre emploi
        job_id INTEGER REFERENCES jobs(id),

        -- CV PDF
        cv TEXT,

        -- Statut candidature
        status VARCHAR(50) DEFAULT 'pending',

        -- Date candidature
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database initialized successfully");

  } catch (error) {

    console.log("Database initialization error:", error);

  }
};

// Exporter fonction
module.exports = initDb;