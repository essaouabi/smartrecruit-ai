// ===============================
// IMPORT FS
// ===============================

const fs = require("fs");

const path = require("path");

// ===============================
// GET LOGS
// ===============================

const getLogs = async (
  req,
  res
) => {
  try {

    const logPath =
      path.join(
        __dirname,
        "../logs/combined.log"
      );

    // Vérifier si fichier existe
    if (
      !fs.existsSync(logPath)
    ) {

      return res.json({
        logs: [],
        message:
          "Aucun log disponible",
      });

    }

    // Lire fichier
    const logs =
      fs.readFileSync(
        logPath,
        "utf-8"
      );

    // Découpage lignes
    const data =
      logs
        .split("\n")
        .filter(
          (line) =>
            line.trim() !== ""
        );

    res.json({
      total:
        data.length,
      logs:
        data.reverse(),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur récupération logs",
    });

  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  getLogs,
};