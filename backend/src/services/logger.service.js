// ===============================
// IMPORT WINSTON
// ===============================

const winston = require("winston");

// ===============================
// LOGGER CONFIG
// ===============================

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    new winston.transports.File({
      filename: "src/logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "src/logs/combined.log",
    }),

    new winston.transports.Console(),
  ],
});

// ===============================
// EXPORT
// ===============================

module.exports = logger;