// =====================================================
// IMPORTATIONS PRINCIPALES
// =====================================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// =====================================================
// DOCUMENTATION API - SWAGGER / OPENAPI
// =====================================================

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// =====================================================
// INITIALISATION DE LA BASE DE DONNÉES
// =====================================================

const initDb = require("./config/initDb");

// =====================================================
// IMPORTATION DES ROUTES API
// =====================================================

const authRoutes = require("./routes/auth.routes");
const cvRoutes = require("./routes/cv.routes");
const jobRoutes = require("./routes/job.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const candidateRoutes = require("./routes/candidate.routes");
const aiRoutes = require("./routes/ai.routes");
const monitoringRoutes = require("./routes/monitoring.routes");
const dataRoutes = require("./routes/data.routes");

// =====================================================
// SERVICE DE JOURNALISATION WINSTON
// =====================================================

const logger = require("./services/logger.service");

// =====================================================
// CRÉATION DE L'APPLICATION EXPRESS
// =====================================================

const app = express();

// =====================================================
// CRÉATION DU SERVEUR HTTP
// =====================================================

const server = http.createServer(app);

// =====================================================
// CONFIGURATION SOCKET.IO POUR LE TEMPS RÉEL
// =====================================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Permettre aux contrôleurs d'utiliser Socket.IO
app.set("io", io);

// Gestion des connexions temps réel
io.on("connection", (socket) => {
  console.log("Client connecté Socket.io :", socket.id);

  // Notification envoyée au frontend après connexion
  socket.emit("notification", {
    type: "success",
    title: "SmartRecruit connecté",
    message: "Temps réel activé avec Socket.io",
    date: new Date().toISOString(),
  });

  // Gestion de la déconnexion client
  socket.on("disconnect", () => {
    console.log("Client déconnecté Socket.io :", socket.id);
  });
});

// =====================================================
// MIDDLEWARES GLOBAUX
// =====================================================

// Permet de lire les données JSON envoyées dans les requêtes
app.use(express.json());

// Configuration CORS pour autoriser le frontend React
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// =====================================================
// DOCUMENTATION INTERACTIVE DES API AVEC SWAGGER
// =====================================================

// Route Swagger disponible sur : http://localhost:5000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =====================================================
// MONITORING DES REQUÊTES HTTP AVEC MORGAN + WINSTON
// =====================================================

app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        // Enregistrement du log dans Winston
        logger.info(message.trim());

        // Envoi du log en temps réel vers le frontend Monitoring
        io.emit("monitoring-log", {
          type: "info",
          message: message.trim(),
          date: new Date().toISOString(),
        });
      },
    },
  })
);

// =====================================================
// ROUTE RACINE DE TEST DU BACKEND
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "SmartRecruit AI Backend Running",
    status: "success",
    documentation: "http://localhost:5000/api-docs",
    monitoring: "enabled",
    dataPipeline: "enabled",
    realtime: "enabled",
  });
});

// =====================================================
// ROUTES PRINCIPALES DE L'API
// =====================================================

// Authentification JWT
app.use("/api/auth", authRoutes);

// Analyse des CV PDF
app.use("/api/cv", cvRoutes);

// Gestion des offres d'emploi
app.use("/api/jobs", jobRoutes);

// Pipeline Data Engineering CSV → PostgreSQL
app.use("/api/data", dataRoutes);

// Dashboard principal
app.use("/api/dashboard", dashboardRoutes);

// Gestion des candidats
app.use("/api/candidates", candidateRoutes);

// Assistant IA / API IA
app.use("/api/ai", aiRoutes);

// Monitoring DevOps
app.use("/api/monitoring", monitoringRoutes);

// =====================================================
// GESTION GLOBALE DES ERREURS
// =====================================================

app.use((err, req, res, next) => {
  // Enregistrement de l'erreur avec Winston
  logger.error({
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    date: new Date().toISOString(),
  });

  // Envoi d'une notification temps réel au frontend
  io.emit("notification", {
    type: "error",
    title: "Erreur backend détectée",
    message: err.message,
    route: req.originalUrl,
    date: new Date().toISOString(),
  });

  // Réponse standardisée au client
  res.status(500).json({
    status: "error",
    message: "Erreur serveur surveillée par le monitoring.",
  });
});

// =====================================================
// INITIALISATION DE LA BASE DE DONNÉES POSTGRESQL
// =====================================================

initDb();

// =====================================================
// CONFIGURATION DU PORT
// =====================================================

const PORT = process.env.PORT || 5000;

// =====================================================
// DÉMARRAGE DU SERVEUR
// =====================================================

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  console.log(`Server running on port ${PORT}`);
  console.log("Socket.io realtime enabled");
  console.log(`Swagger API Docs: http://localhost:${PORT}/api-docs`);
});

// =====================================================
// EXPORT POUR LES TESTS AUTOMATISÉS JEST / SUPERTEST
// =====================================================

module.exports = app;