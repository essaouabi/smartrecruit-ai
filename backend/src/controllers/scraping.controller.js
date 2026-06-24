// =====================================================
// CONTROLLER SCRAPING - SMARTRECRUIT AI
// =====================================================

const {
  scrapeJobs,
} = require("../services/scraping.service");

const startScraping = async (req, res) => {
  try {
    const result = await scrapeJobs();

    res.status(200).json({
      status: "success",
      message: "Scraping terminé avec succès.",
      data: result,
    });
  } catch (error) {
    console.error("Erreur scraping controller :", error);

    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'importation des offres.",
      error: error.message,
    });
  }
};

module.exports = {
  startScraping,
};