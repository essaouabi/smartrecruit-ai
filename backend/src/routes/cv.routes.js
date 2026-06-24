// ======================================================
// ROUTES CV - SMARTRECRUIT AI
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// MIDDLEWARES
// ======================================================

const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// ======================================================
// CONTROLLERS - ANALYSE CV
// ======================================================

const {
  analyzeUploadedCV,
} = require("../controllers/cv.upload.controller");

// ======================================================
// CONTROLLERS - CANDIDATE CVS
// ======================================================

const {
  saveCandidateCV,
  getMyCandidateCVs,
} = require("../controllers/candidateCv.controller");

// ======================================================
// ANALYSER UN CV PDF
// ======================================================

router.post(
  "/analyze-file",
  authMiddleware,
  upload.single("cv"),
  analyzeUploadedCV
);

// ======================================================
// RÉCUPÉRER MES CVS
// ======================================================

router.get(
  "/my-cvs",
  authMiddleware,
  getMyCandidateCVs
);

// ======================================================
// SAUVEGARDER UN CV
// ======================================================

router.post(
  "/save-cv",
  authMiddleware,
  saveCandidateCV
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;