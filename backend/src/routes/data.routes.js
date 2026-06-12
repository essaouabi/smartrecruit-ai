// ======================================================
// ROUTES DATA ENGINEERING - SMARTRECRUIT AI
// ======================================================
// Ces routes permettent :
// - l'importation des fichiers CSV ;
// - le nettoyage et la validation des données ;
// - l'intégration dans PostgreSQL ;
// - la consultation de l'historique des imports.
// ======================================================


// ======================================================
// IMPORT EXPRESS
// ======================================================

const express = require("express");


// ======================================================
// INITIALISATION DU ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// IMPORT MULTER
// ======================================================
// Multer permet la réception des fichiers CSV.

const multer = require("multer");


// ======================================================
// IMPORT DES CONTRÔLEURS
// ======================================================

const {
  importCSV,
  getImportHistory,
} = require("../controllers/data.controller");


// ======================================================
// CONFIGURATION DU STOCKAGE TEMPORAIRE
// ======================================================

const storage = multer.memoryStorage();


// ======================================================
// CONFIGURATION DE MULTER
// ======================================================

const upload = multer({
  storage,
});


// ======================================================
// DOCUMENTATION SWAGGER - DATA PIPELINE
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Data Pipeline
 *   description: Pipeline Data Engineering CSV vers PostgreSQL
 */


/**
 * @swagger
 * /api/data/import-csv:
 *   post:
 *     summary: Importer un fichier CSV
 *     description: Cette route permet d'importer un fichier CSV, de valider les données, puis de les enregistrer dans PostgreSQL.
 *     tags: [Data Pipeline]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Fichier CSV à importer
 *     responses:
 *       200:
 *         description: Import terminé avec succès
 *       400:
 *         description: Fichier invalide
 *       500:
 *         description: Erreur serveur
 */

router.post(
  "/import-csv",
  upload.single("file"),
  importCSV
);


/**
 * @swagger
 * /api/data/imports:
 *   get:
 *     summary: Consulter l'historique des imports
 *     description: Retourne l'ensemble des imports CSV réalisés dans SmartRecruit AI.
 *     tags: [Data Pipeline]
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *       500:
 *         description: Erreur serveur
 */

router.get(
  "/imports",
  getImportHistory
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;