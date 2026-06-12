// ======================================================
// ROUTES AUTHENTIFICATION - SMARTRECRUIT AI
// ======================================================
// Ce fichier contient les routes liées à l'authentification.
// Il permet :
// - la création d'un compte utilisateur ;
// - la connexion d'un utilisateur ;
// - la génération d'un token JWT via le contrôleur.
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
// IMPORT DES CONTRÔLEURS AUTHENTIFICATION
// ======================================================

const {
  register,
  login,
} = require("../controllers/auth.controller");


// ======================================================
// DOCUMENTATION SWAGGER - TAG AUTH
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification sécurisée avec JWT
 */


// ======================================================
// ROUTE REGISTER
// ======================================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     description: Cette route permet de créer un nouvel utilisateur dans SmartRecruit AI.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Mohamed Amine Essaouabi
 *               email:
 *                 type: string
 *                 example: amine@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: recruiter
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
 */

router.post("/register", register);


// ======================================================
// ROUTE LOGIN
// ======================================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     description: Cette route permet à un utilisateur de se connecter et de recevoir un token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: amine@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Connexion réussie avec génération du token JWT
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

router.post("/login", login);


// ======================================================
// EXPORT DU ROUTER
// ======================================================

module.exports = router;