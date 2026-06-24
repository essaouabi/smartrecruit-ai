// ======================================================
// ROUTES ASSISTANT IA - SMARTRECRUIT AI
// ======================================================


// ======================================================
// IMPORT EXPRESS
// ======================================================

const express = require("express");


// ======================================================
// INITIALISATION ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// IMPORT CONTROLLERS
// ======================================================

const {
  askAI,
  matchCVWithJob,
} = require("../controllers/ai.controller");


// ======================================================
// SWAGGER TAG
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Artificial Intelligence
 *   description: Assistant intelligent SmartRecruit AI
 */


// ======================================================
// ASK AI
// ======================================================

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Interroger l'assistant IA
 *     tags: [Artificial Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: Analyse les compétences d'un développeur Full Stack
 *     responses:
 *       200:
 *         description: Réponse générée par l'IA
 */

router.post(
  "/ask",
  askAI
);


// ======================================================
// MATCH CV ↔ JOB
// ======================================================

/**
 * @swagger
 * /api/ai/match-cv-job:
 *   post:
 *     summary: Comparer un CV avec une offre d'emploi
 *     description: Analyse IA de compatibilité entre un CV et un poste.
 *     tags: [Artificial Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvText
 *               - jobDescription
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: Développeur Full Stack React Node.js
 *
 *               cvText:
 *                 type: string
 *                 example: Développeur React avec 3 ans d'expérience...
 *
 *               jobDescription:
 *                 type: string
 *                 example: Nous recherchons un développeur React Node.js...
 *
 *     responses:
 *       200:
 *         description: Analyse terminée
 *
 *       400:
 *         description: Données invalides
 *
 *       500:
 *         description: Erreur serveur
 */

router.post(
  "/match-cv-job",
  matchCVWithJob
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;