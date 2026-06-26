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
const applicationRoutes = require("./routes/application.routes");
const scrapingRoutes = require("./routes/scraping.routes");
const auditRoutes = require("./routes/audit.routes");
const notificationRoutes = require("./routes/notification.routes");
const incidentRoutes = require("./routes/incident.routes");
const aiMonitoringRoutes = require("./routes/aiMonitoring.routes"); // <-- Ajouté ici

// =====================================================
// SERVICES
// =====================================================

const logger = require("./services/logger.service");
const { logAudit } = require("./services/auditLog.service");
const { createNotification } = require("./services/notification.service");
const { createIncident } = require("./services/incident.service");

// =====================================================
// CRÉATION DE L'APPLICATION EXPRESS
// =====================================================

const app = express();

// =====================================================
// CRÉATION DU SERVEUR HTTP
// =====================================================

const server = http.createServer(app);

// =====================================================
// CONFIGURATION CORS GLOBALE
// =====================================================

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// =====================================================
// CONFIGURATION SOCKET.IO POUR LE TEMPS RÉEL
// =====================================================

const io = new Server(server, {
  cors: corsOptions,
});

// Permettre aux contrôleurs et services d'utiliser Socket.IO
app.set("io", io);

// Gestion des connexions temps réel
io.on("connection", (socket) => {
  console.log("Client connecté Socket.io :", socket.id);

  socket.emit("notification", {
    type: "success",
    title: "SmartRecruit connecté",
    message: "Temps réel activé avec Socket.io",
    date: new Date().toISOString(),
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté Socket.io :", socket.id);
  });
});

// =====================================================
// MIDDLEWARES GLOBAUX
// =====================================================

app.use(cors(corsOptions));
app.use(express.json());

// =====================================================
// DOCUMENTATION INTERACTIVE DES API AVEC SWAGGER
// =====================================================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =====================================================
// MONITORING DES REQUÊTES HTTP AVEC MORGAN + WINSTON
// =====================================================

app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.info(message.trim());

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
    auditLogs: "enabled",
    notifications: "enabled",
    incidentCenter: "enabled",
    aiMonitoring: "enabled", // <-- Ajouté ici
  });
});

// =====================================================
// ROUTES PRINCIPALES DE L'API
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/scraping", scrapingRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/ai-monitoring", aiMonitoringRoutes); // <-- Ajouté ici

// =====================================================
// GESTION DES ROUTES INEXISTANTES
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route API introuvable.",
    route: req.originalUrl,
  });
});

// =====================================================
// GESTION GLOBALE DES ERREURS
// =====================================================

app.use(async (err, req, res, _next) => {
  console.error("Erreur serveur :", err);

  logger.error({
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    date: new Date().toISOString(),
  });

  const userId = req.user?.id || req.user?.userId || null;
  const userRole = req.user?.role || null;

  // Audit log + notification + incident PostgreSQL
  await Promise.allSettled([
    logAudit({
      req,
      userId,
      userRole,
      action: "BACKEND_ERROR",
      entity: "server",
      entityId: null,
      description: `${req.method} ${req.originalUrl} - ${err.message}`,
    }),

    createNotification({
      req,
      userId,
      userRole,
      type: "error",
      title: "Erreur backend détectée",
      message: err.message || "Une erreur serveur a été détectée.",
      entity: "server",
      entityId: null,
    }),

    createIncident({
      req,
      title: "Erreur backend détectée",
      description:
        err.message || "Une erreur serveur a été détectée par SmartRecruit AI.",
      severity: "high",
      status: "open",
      source: "backend",
      entity: "server",
      entityId: null,
      detectedBy: "Express Error Handler",
      rootCause: "Erreur non capturée dans une route backend.",
      solution:
        "Analyser les logs backend, identifier la route concernée et appliquer une correction.",
      technicalLogs: `${req.method} ${req.originalUrl} - ${
        err.stack || err.message
      }`,
      userId,
      userRole,
    }),
  ]);

  res.status(500).json({
    status: "error",
    message: "Erreur serveur surveillée par le monitoring.",
  });
});

// =====================================================
// CONFIGURATION DU PORT
// =====================================================

const PORT = process.env.PORT || 5000;

// =====================================================
// INITIALISATION DB + DÉMARRAGE DU SERVEUR
// =====================================================

const startServer = async () => {
  try {
    await initDb();

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);

      console.log(`Server running on port ${PORT}`);
      console.log("Socket.io realtime enabled");
      console.log("Audit logs enabled");
      console.log("Notifications enabled");
      console.log("Incident Center enabled");
      console.log(`Swagger API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Erreur initialisation DB :", error);
    console.error("Erreur initialisation DB :", error);
    process.exit(1);
  }
};

startServer();

// =====================================================
// EXPORT POUR LES TESTS AUTOMATISÉS JEST / SUPERTEST
// =====================================================

module.exports = app;