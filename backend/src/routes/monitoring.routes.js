// ======================================================
// ROUTES MONITORING DEVOPS - SMARTRECRUIT AI
// ======================================================
// Ces routes permettent :
// - la consultation des logs backend ;
// - la supervision des événements système ;
// - le suivi des performances ;
// - l'analyse des incidents techniques.
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
// IMPORT DU CONTRÔLEUR MONITORING
// ======================================================

const {
  getLogs,
} = require("../controllers/monitoring.controller");


// ======================================================
// DOCUMENTATION SWAGGER - MONITORING
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Monitoring
 *   description: Supervision des performances et des logs backend
 */


/**
 * @swagger
 * /api/monitoring/logs:
 *   get:
 *     summary: Consulter les logs du système
 *     description: Retourne les événements enregistrés par Winston afin de surveiller le fonctionnement du backend.
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Logs récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */

router.get(
  "/logs",
  getLogs
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;