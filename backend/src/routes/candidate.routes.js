// ======================================================
// ROUTES CANDIDATES - SMARTRECRUIT AI
// RGPD READY
// ======================================================

const express = require("express");
const router = express.Router();

// ===============================
// IMPORT DES CONTRÔLEURS
// ===============================

const {
  saveCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateDecision,
  anonymizeCandidate,
  deleteCandidate,
} = require("../controllers/candidate.controller");

// ===============================
// IMPORT DES MIDDLEWARES
// ===============================

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// ===============================
// SAVE CANDIDATE
// ===============================

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  saveCandidate
);

// ===============================
// GET ALL CANDIDATES
// ===============================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  getCandidates
);

// ===============================
// GET CANDIDATE BY ID
// ===============================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  getCandidateById
);

// ===============================
// UPDATE DECISION
// ===============================

router.patch(
  "/:id/decision",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  updateCandidateDecision
);

// ===============================
// ANONYMIZE CANDIDATE - RGPD
// ===============================

router.patch(
  "/:id/anonymize",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  anonymizeCandidate
);

// ===============================
// DELETE CANDIDATE - SUPPRESSION LOGIQUE RGPD
// ===============================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["recruiter"]),
  deleteCandidate
);

// ===============================
// EXPORT
// ===============================

module.exports = router;                                                                                      