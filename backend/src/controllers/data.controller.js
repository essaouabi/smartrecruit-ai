// ===============================
// IMPORTS
// ===============================

const csv = require("csv-parser");

const pool = require("../config/db");

const {
  cleanJobData,
  isValidJob,
} = require(
  "../services/dataCleaning.service"
);

// ===============================
// IMPORT CSV PIPELINE
// ===============================

const importCSV = async (
  req,
  res
) => {
  try {

    if (!req.file) {

      return res.status(400).json({
        message:
          "Fichier CSV requis",
      });

    }

    const rows = [];

    const csvString =
      req.file.buffer.toString();

    const Readable =
      require("stream")
        .Readable;

    const stream =
      Readable.from(
        csvString
      );

    stream
      .pipe(csv())
      .on(
        "data",
        (data) => {

          rows.push(data);

        }
      )
      .on(
        "end",
        async () => {

          let inserted = 0;

          let rejected = 0;

          for (
            const row of rows
          ) {

            const cleanData =
              cleanJobData(
                row
              );

            if (
              !isValidJob(
                cleanData
              )
            ) {

              rejected++;

              continue;

            }

            await pool.query(
              `
              INSERT INTO jobs
              (
                title,
                company,
                location,
                description
              )
              VALUES
              (
                $1,
                $2,
                $3,
                $4
              )
              `,
              [
                cleanData.title,
                cleanData.company,
                cleanData.location,
                cleanData.description,
              ]
            );

            inserted++;

          }

          // ===============================
          // SAVE IMPORT HISTORY
          // ===============================

          await pool.query(
            `
            INSERT INTO data_imports
            (
              filename,
              total_rows,
              inserted_rows,
              rejected_rows
            )
            VALUES
            (
              $1,
              $2,
              $3,
              $4
            )
            `,
            [
              req.file.originalname,
              rows.length,
              inserted,
              rejected,
            ]
          );

          res.json({
            message:
              "Pipeline exécuté",
            filename:
              req.file.originalname,
            total:
              rows.length,
            inserted,
            rejected,
          });

        }
      );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur pipeline CSV",
    });

  }
};

// ===============================
// GET IMPORT HISTORY
// ===============================

const getImportHistory = async (
  req,
  res
) => {
  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM data_imports
        ORDER BY id DESC
        `
      );

    res.json(
      result.rows
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erreur récupération historique imports",
    });

  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  importCSV,
  getImportHistory,
};