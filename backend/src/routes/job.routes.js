// ======================================================
// ROUTES JOBS - SMARTRECRUIT AI
// ======================================================
// Gestion des offres d'emploi.
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// IMPORT DES CONTRÔLEURS
// ======================================================

const {
  getJobs,
  createJob,
  deleteJob,
  seedJobs,
  applyJob,
} = require("../controllers/job.controller");

// ======================================================
// IMPORT DU MIDDLEWARE JWT
// ======================================================

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

// ======================================================
// RÉCUPÉRER TOUTES LES OFFRES
// Accessible sans connexion
// ======================================================

router.get("/", getJobs);

// ======================================================
// CRÉER UNE OFFRE
// ======================================================

router.post(
  "/",
  authMiddleware,
  createJob
);

// ======================================================
// SUPPRIMER UNE OFFRE
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteJob
);

// ======================================================
// INSÉRER DES OFFRES DE DÉMONSTRATION
// ======================================================

router.post(
  "/seed",
  authMiddleware,
  seedJobs
);

// ======================================================
// POSTULER À UNE OFFRE
// ======================================================

router.post(
  "/:id/apply",
  authMiddleware,
  applyJob
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;