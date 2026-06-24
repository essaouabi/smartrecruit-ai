// ===============================
// IMPORTS
// ===============================

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  applyToJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
} = require("../controllers/application.controller");

// ===============================
// CANDIDAT : STATISTIQUES DES CANDIDATURES
// ===============================

router.get(
  "/stats",
  authMiddleware,
  getApplicationStats
);

// ===============================
// POSTULER À UNE OFFRE
// ===============================

router.post(
  "/apply",
  authMiddleware,
  applyToJob
);

// ===============================
// CANDIDAT : MES CANDIDATURES
// ===============================

router.get(
  "/my-applications",
  authMiddleware,
  getMyApplications
);

// ===============================
// RECRUTEUR : TOUTES LES CANDIDATURES
// ===============================

router.get(
  "/",
  authMiddleware,
  getAllApplications
);

// ===============================
// RECRUTEUR : MODIFIER STATUT
// ===============================

router.patch(
  "/:id/status",
  authMiddleware,
  updateApplicationStatus
);

// ===============================
// EXPORT
// ===============================

module.exports = router;