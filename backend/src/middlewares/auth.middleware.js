// ===============================
// IMPORTS
// ===============================

const multer = require("multer");

// ===============================
// MEMORY STORAGE
// ===============================

const storage = multer.memoryStorage();

// ===============================
// PDF FILTER
// ===============================

const fileFilter = (
  req,
  file,
  cb
) => {

  // Vérifier type PDF
  if (
    file.mimetype ===
    "application/pdf"
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Seuls les fichiers PDF sont autorisés."
      ),
      false
    );

  }

};

// ===============================
// MULTER CONFIG
// ===============================

const upload = multer({

  // Stockage mémoire
  storage,

  // Vérification type fichier
  fileFilter,

  // Limite taille fichier
  limits: {

    // 10 MB max
    fileSize:
      10 * 1024 * 1024,

  },

});

// ===============================
// MIDDLEWARE ERROR HANDLER
// ===============================

const uploadMiddleware = (
  req,
  res,
  next
) => {

  upload.single("cv")(
    req,
    res,
    (error) => {

      // Erreur multer
      if (error instanceof multer.MulterError) {

        return res.status(400).json({

          message:
            "Fichier trop volumineux. Maximum 10 MB.",

        });

      }

      // Erreur type fichier
      if (error) {

        return res.status(400).json({

          message:
            error.message,

        });

      }

      // Continuer
      next();

    }
  );

};

// ===============================
// EXPORT
// ===============================

module.exports =
  uploadMiddleware;