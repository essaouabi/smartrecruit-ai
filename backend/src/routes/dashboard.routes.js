// ======================================================
// DASHBOARD ROUTES - SMARTRECRUIT AI
// ======================================================

const express = require("express");

const router = express.Router();

// ======================================================
// CONTROLLERS
// ======================================================

const {
  getDashboardStats,
} = require(
  "../controllers/dashboard.controller"
);

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

// ======================================================
// SWAGGER TAG
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et supervision SmartRecruit AI
 */


/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Récupérer les statistiques du dashboard
 *     description: Retourne les statistiques globales de SmartRecruit AI
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *
 *       401:
 *         description: Utilisateur non authentifié
 *
 *       500:
 *         description: Erreur serveur
 */

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;