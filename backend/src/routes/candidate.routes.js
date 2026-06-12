// ======================================================
// ROUTES CANDIDATES - SMARTRECRUIT AI
// ======================================================
// Ces routes permettent :
// - l'enregistrement d'un candidat ;
// - la récupération de la liste des candidats ;
// - la suppression d'un candidat.
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
  saveCandidate,
  getCandidates,
  deleteCandidate,
} = require("../controllers/candidate.controller");


// ======================================================
// IMPORT DU MIDDLEWARE JWT
// ======================================================

const authMiddleware = require("../middlewares/auth.middleware");


// ======================================================
// DOCUMENTATION SWAGGER - CANDIDATES
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Gestion des candidats analysés par SmartRecruit AI
 */


/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Enregistrer un candidat
 *     description: Cette route permet d'enregistrer les informations d'un candidat après l'analyse de son CV.
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Candidat enregistré avec succès
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */

router.post(
  "/",
  authMiddleware,
  saveCandidate
);


/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Récupérer tous les candidats
 *     description: Cette route permet de consulter la liste des candidats enregistrés dans SmartRecruit AI.
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidats récupérée avec succès
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */

router.get(
  "/",
  authMiddleware,
  getCandidates
);


/**
 * @swagger
 * /api/candidates/{id}:
 *   delete:
 *     summary: Supprimer un candidat
 *     description: Cette route permet de supprimer un candidat enregistré à partir de son identifiant.
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du candidat à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidat supprimé avec succès
 *       401:
 *         description: Accès non autorisé
 *       404:
 *         description: Candidat introuvable
 *       500:
 *         description: Erreur serveur
 */

router.delete(
  "/:id",
  authMiddleware,
  deleteCandidate
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;