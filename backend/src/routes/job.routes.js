// ======================================================
// ROUTES JOBS - SMARTRECRUIT AI
// ======================================================
// Gestion des offres d'emploi.
// Ces routes permettent :
// - consulter les offres ;
// - créer une offre ;
// - supprimer une offre ;
// - générer des données de démonstration.
// Toutes les routes sont protégées par JWT.
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
// IMPORT DES CONTRÔLEURS
// ======================================================

const {
  getJobs,
  createJob,
  deleteJob,
  seedJobs,
} = require("../controllers/job.controller");


// ======================================================
// IMPORT DU MIDDLEWARE JWT
// ======================================================

const authMiddleware = require(
  "../middlewares/auth.middleware"
);


// ======================================================
// DOCUMENTATION SWAGGER - TAG JOBS
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Gestion des offres d'emploi SmartRecruit AI
 */


/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Récupérer toutes les offres d'emploi
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des offres récupérée avec succès
 *       401:
 *         description: Accès non autorisé
 */

router.get(
  "/",
  authMiddleware,
  getJobs
);


/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Créer une nouvelle offre d'emploi
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Offre créée avec succès
 *       401:
 *         description: Accès non autorisé
 */

router.post(
  "/",
  authMiddleware,
  createJob
);


/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Supprimer une offre d'emploi
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offre supprimée avec succès
 *       404:
 *         description: Offre introuvable
 */

router.delete(
  "/:id",
  authMiddleware,
  deleteJob
);


/**
 * @swagger
 * /api/jobs/seed:
 *   post:
 *     summary: Insérer des offres de démonstration
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données de démonstration ajoutées
 */

router.post(
  "/seed",
  authMiddleware,
  seedJobs
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;