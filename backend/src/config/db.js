// Importation de PostgreSQL
const { Pool } = require("pg");

// Charger les variables .env
require("dotenv").config();

// Création de la connexion PostgreSQL
const pool = new Pool({
  // Adresse du serveur PostgreSQL
  host: process.env.DB_HOST,

  // Port PostgreSQL
  port: process.env.DB_PORT,

  // Nom utilisateur PostgreSQL
  user: process.env.DB_USER,

  // Mot de passe PostgreSQL
  password: process.env.DB_PASSWORD,

  // Nom de la base de données
  database: process.env.DB_NAME,
});

// Exporter la connexion pour l'utiliser dans le projet
module.exports = pool;