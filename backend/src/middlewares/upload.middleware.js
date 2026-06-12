// ===============================
// IMPORTS
// ===============================

const multer = require("multer");

// ===============================
// STORAGE EN MEMOIRE
// ===============================

const storage = multer.memoryStorage();

// ===============================
// CONFIG MULTER
// ===============================

const upload = multer({
  storage: storage,
});

// ===============================
// EXPORT
// ===============================

module.exports = upload;