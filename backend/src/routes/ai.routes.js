// ======================================================
// ROUTES ASSISTANT IA - SMARTRECRUIT AI
// ======================================================
// Ces routes permettent :
// - communiquer avec l'assistant IA ;
// - poser des questions ;
// - obtenir des réponses intelligentes ;
// - exploiter les capacités IA du système.
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
// IMPORT DU CONTRÔLEUR IA
// ======================================================

const {
  askAI,
} = require("../controllers/ai.controller");


// ======================================================
// DOCUMENTATION SWAGGER - IA
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Artificial Intelligence
 *   description: Assistant intelligent SmartRecruit AI
 */


/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Interroger l'assistant IA
 *     description: Cette route permet d'envoyer une question à l'assistant IA et de recevoir une réponse générée automatiquement.
 *     tags: [Artificial Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 example: Analyse les compétences d'un développeur Full Stack.
 *     responses:
 *       200:
 *         description: Réponse générée par l'IA
 *       400:
 *         description: Question invalide
 *       500:
 *         description: Erreur serveur
 */

router.post(
  "/ask",
  askAI
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;