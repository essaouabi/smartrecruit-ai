// ======================================================
// ROUTES CV ANALYZER - SMARTRECRUIT AI
// ======================================================
// Ce fichier contient les routes liées à l'analyse des CV.
// Il permet :
// - l'importation d'un fichier CV au format PDF ;
// - l'analyse automatique du CV ;
// - la détection des compétences ;
// - la génération d'un score IA ;
// - la production d'une décision RH.
// ======================================================


// ======================================================
// IMPORT EXPRESS
// ======================================================

const express = require("express");


// ======================================================
// INITIALISATION DU ROUTER EXPRESS
// ======================================================

const router = express.Router();


// ======================================================
// IMPORT DU MIDDLEWARE D'UPLOAD
// ======================================================
// Multer permet de recevoir un fichier PDF envoyé depuis le frontend.

const upload = require("../middlewares/upload.middleware");


// ======================================================
// IMPORT DU CONTRÔLEUR D'ANALYSE CV
// ======================================================

const {
  analyzeUploadedCV,
} = require("../controllers/cv.upload.controller");


// ======================================================
// DOCUMENTATION SWAGGER - TAG CV
// ======================================================

/**
 * @swagger
 * tags:
 *   name: CV Analyzer
 *   description: Analyse intelligente des CV avec extraction PDF et IA
 */


// ======================================================
// ROUTE ANALYSE CV PDF
// ======================================================

/**
 * @swagger
 * /api/cv/analyze-file:
 *   post:
 *     summary: Analyser un CV PDF avec l'intelligence artificielle
 *     description: Cette route permet d'envoyer un fichier PDF afin d'extraire son contenu, détecter les compétences du candidat, calculer un score de compatibilité et générer une décision RH.
 *     tags: [CV Analyzer]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: Fichier CV au format PDF
 *     responses:
 *       200:
 *         description: CV analysé avec succès
 *       400:
 *         description: Aucun fichier envoyé ou fichier invalide
 *       500:
 *         description: Erreur serveur lors de l'analyse du CV
 */

router.post(
  "/analyze-file",
  upload.single("cv"),
  analyzeUploadedCV
);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;