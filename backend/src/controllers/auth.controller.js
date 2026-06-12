// ===============================
// IMPORTATIONS
// ===============================

// Connexion PostgreSQL
const pool = require("../config/db");

// Cryptage mot de passe
const bcrypt = require("bcryptjs");

// JWT
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER
// ===============================

const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      role,
    } = req.body;

    // ===============================
    // VALIDATIONS
    // ===============================

    if (
      !fullname ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          "Tous les champs sont obligatoires.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    const allowedRoles = [
      "recruiter",
      "candidate",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Rôle invalide.",
      });
    }

    // ===============================
    // CHECK EMAIL
    // ===============================

    const existingUser =
      await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cet email existe déjà.",
      });
    }

    // ===============================
    // HASH PASSWORD
    // ===============================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ===============================
    // INSERT USER
    // ===============================

    const newUser = await pool.query(
      `
      INSERT INTO users
      (
        fullname,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, fullname, email, role, created_at
      `,
      [
        fullname,
        email,
        hashedPassword,
        role,
      ]
    );

    // ===============================
    // CREATE JWT TOKEN
    // ===============================

    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        role: newUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json({
      message:
        "Compte créé avec succès.",
      token,
      user: newUser.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Erreur serveur lors de la création du compte.",
    });
  }
};

// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ===============================
    // VALIDATIONS
    // ===============================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email et mot de passe obligatoires.",
      });
    }

    // ===============================
    // FIND USER
    // ===============================

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message:
          "Email ou mot de passe incorrect.",
      });
    }

    // ===============================
    // CHECK PASSWORD
    // ===============================

    const validPassword =
      await bcrypt.compare(
        password,
        user.rows[0].password
      );

    if (!validPassword) {
      return res.status(400).json({
        message:
          "Email ou mot de passe incorrect.",
      });
    }

    // ===============================
    // CREATE JWT TOKEN
    // ===============================

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===============================
    // RESPONSE
    // ===============================

    res.status(200).json({
      message:
        "Connexion réussie.",
      token,
      user: {
        id: user.rows[0].id,
        fullname: user.rows[0].fullname,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Erreur serveur lors de la connexion.",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  register,
  login,
};