// ======================================================
// TESTS AUTHENTIFICATION - SMARTRECRUIT AI
// ======================================================
// Ces tests permettent de vérifier :
// - la création d'un compte utilisateur ;
// - les validations du formulaire ;
// - la connexion utilisateur ;
// - la génération d'un token JWT.
// ======================================================


// ======================================================
// MOCKS DES DÉPENDANCES
// ======================================================

jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));


// ======================================================
// IMPORTS
// ======================================================

const pool = require("../src/config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  register,
  login,
} = require("../src/controllers/auth.controller");


// ======================================================
// FONCTION UTILITAIRE POUR SIMULER RES EXPRESS
// ======================================================

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};


// ======================================================
// RESET AVANT CHAQUE TEST
// ======================================================

beforeEach(() => {
  jest.clearAllMocks();

  process.env.JWT_SECRET = "test_secret";
});


// ======================================================
// TESTS REGISTER
// ======================================================

describe("Register - Création de compte", () => {
  test("doit créer un utilisateur et retourner un token JWT", async () => {
    const req = {
      body: {
        fullname: "Mohamed Amine Essaouabi",
        email: "amine@test.com",
        password: "password123",
        role: "recruiter",
      },
    };

    const res = mockResponse();

    pool.query
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            fullname: "Mohamed Amine Essaouabi",
            email: "amine@test.com",
            role: "recruiter",
            created_at: "2026-01-01",
          },
        ],
      });

    bcrypt.hash.mockResolvedValue("hashed_password");

    jwt.sign.mockReturnValue("fake_jwt_token");

    await register(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(jwt.sign).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Compte créé avec succès.",
        token: "fake_jwt_token",
      })
    );
  });

  test("doit refuser si un champ est manquant", async () => {
    const req = {
      body: {
        fullname: "",
        email: "amine@test.com",
        password: "password123",
        role: "recruiter",
      },
    };

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tous les champs sont obligatoires.",
    });
  });

  test("doit refuser un mot de passe trop court", async () => {
    const req = {
      body: {
        fullname: "Amine",
        email: "amine@test.com",
        password: "123",
        role: "recruiter",
      },
    };

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    });
  });

  test("doit refuser un rôle invalide", async () => {
    const req = {
      body: {
        fullname: "Amine",
        email: "amine@test.com",
        password: "password123",
        role: "admin",
      },
    };

    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Rôle invalide.",
    });
  });

  test("doit refuser un email déjà existant", async () => {
    const req = {
      body: {
        fullname: "Amine",
        email: "amine@test.com",
        password: "password123",
        role: "recruiter",
      },
    };

    const res = mockResponse();

    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          email: "amine@test.com",
        },
      ],
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cet email existe déjà.",
    });
  });
});


// ======================================================
// TESTS LOGIN
// ======================================================

describe("Login - Connexion utilisateur", () => {
  test("doit connecter un utilisateur et retourner un token JWT", async () => {
    const req = {
      body: {
        email: "amine@test.com",
        password: "password123",
      },
    };

    const res = mockResponse();

    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          fullname: "Mohamed Amine Essaouabi",
          email: "amine@test.com",
          password: "hashed_password",
          role: "recruiter",
        },
      ],
    });

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue("fake_login_token");

    await login(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password"
    );
    expect(jwt.sign).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Connexion réussie.",
        token: "fake_login_token",
      })
    );
  });

  test("doit refuser si email ou mot de passe manquant", async () => {
    const req = {
      body: {
        email: "",
        password: "",
      },
    };

    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email et mot de passe obligatoires.",
    });
  });

  test("doit refuser si utilisateur introuvable", async () => {
    const req = {
      body: {
        email: "inconnu@test.com",
        password: "password123",
      },
    };

    const res = mockResponse();

    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email ou mot de passe incorrect.",
    });
  });

  test("doit refuser si mot de passe incorrect", async () => {
    const req = {
      body: {
        email: "amine@test.com",
        password: "wrongpassword",
      },
    };

    const res = mockResponse();

    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          fullname: "Amine",
          email: "amine@test.com",
          password: "hashed_password",
          role: "recruiter",
        },
      ],
    });

    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email ou mot de passe incorrect.",
    });
  });
});