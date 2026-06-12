// ===============================
// IMPORT GEMINI SERVICE
// ===============================

const {
  askGemini,
} = require("../services/gemini.service");

// ===============================
// ASK AI
// ===============================

const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message requis",
      });
    }

    const response = await askGemini(message);

    res.status(200).json({
      response,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur IA",
      response:
        "Erreur IA. Veuillez réessayer plus tard.",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  askAI,
};