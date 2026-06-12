/**
 * Configuration Swagger / OpenAPI
 * SmartRecruit AI
 *
 * Objectif :
 * - documenter les API REST du backend ;
 * - faciliter les tests des routes ;
 * - fournir une preuve technique pour les rapports RNCP.
 */

const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SmartRecruit AI API",
      version: "1.0.0",
      description:
        "Documentation des API REST de SmartRecruit AI : authentification, candidats, offres, analyse CV, pipeline et monitoring.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur local de développement",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;