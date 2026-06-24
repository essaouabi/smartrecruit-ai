// ======================================================
// CONTROLLER IA - SMARTRECRUIT AI
// ======================================================
// Ce contrôleur gère les fonctionnalités liées à l'IA :
// - assistant IA général ;
// - comparaison entre un CV et une offre d'emploi ;
// - génération d'un score de compatibilité ;
// - détection des compétences correspondantes et manquantes ;
// - génération d'une décision RH.
// ======================================================


// ======================================================
// IMPORT DU SERVICE GEMINI
// ======================================================

const {
  askGemini,
} = require("../services/gemini.service");


// ======================================================
// FONCTION UTILITAIRE : NETTOYER UNE RÉPONSE JSON IA
// ======================================================
// Gemini peut parfois retourner du texte autour du JSON.
// Cette fonction essaye d'extraire proprement l'objet JSON.

const extractJsonFromAIResponse = (response) => {
  try {
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      return null;
    }

    const jsonString = response.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};


// ======================================================
// ASK AI - ASSISTANT IA GÉNÉRAL
// ======================================================

const askAI = async (req, res) => {
  try {
    const { message, question } = req.body;

    // Compatibilité avec plusieurs noms de champs frontend
    const finalMessage = message || question;

    if (!finalMessage || finalMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message requis",
      });
    }

    const response = await askGemini(finalMessage);

    res.status(200).json({
      success: true,
      response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Erreur IA",
      response: "Erreur IA. Veuillez réessayer plus tard.",
    });
  }
};


// ======================================================
// MATCH CV ↔ OFFRE D'EMPLOI
// ======================================================
// Cette fonction compare le contenu d'un CV avec une offre.
// Elle retourne un score RH, les compétences détectées,
// les compétences manquantes et une décision intelligente.

const matchCVWithJob = async (req, res) => {
  try {
    const {
      cvText,
      jobDescription,
      jobTitle,
    } = req.body;

    // ===============================
    // VALIDATION DES DONNÉES
    // ===============================

    if (!cvText || cvText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Le contenu du CV est obligatoire.",
      });
    }

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "La description de l'offre est obligatoire.",
      });
    }

    // ===============================
    // PROMPT IA PROFESSIONNEL
    // ===============================

    const prompt = `
Tu es un expert RH spécialisé dans le recrutement informatique.

Analyse le CV du candidat et compare-le avec l'offre d'emploi suivante.

Titre du poste :
${jobTitle || "Poste non précisé"}

Description de l'offre :
${jobDescription}

Contenu du CV :
${cvText}

Tu dois retourner uniquement un objet JSON valide, sans texte avant ni après.

Format JSON obligatoire :
{
  "score": 0,
  "matchingLevel": "Faible | Moyen | Bon | Excellent",
  "detectedSkills": [],
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "summary": "",
  "decision": "Refuser | À revoir | Entretien recommandé | Recruter",
  "decisionColor": "red | yellow | blue | green",
  "recommendations": []
}

Règles :
- Le score doit être un nombre entre 0 et 100.
- Les compétences doivent être techniques et concrètes.
- La décision doit être cohérente avec le score.
- Si le score est inférieur à 40 : Refuser.
- Si le score est entre 40 et 59 : À revoir.
- Si le score est entre 60 et 79 : Entretien recommandé.
- Si le score est supérieur ou égal à 80 : Recruter.
`;

    // ===============================
    // APPEL AU SERVICE GEMINI
    // ===============================

    const aiResponse = await askGemini(prompt);

    // ===============================
    // EXTRACTION DU JSON
    // ===============================

    const parsedResult = extractJsonFromAIResponse(aiResponse);

    // ===============================
    // SI L'IA RETOURNE UN JSON VALIDE
    // ===============================

    if (parsedResult) {
      return res.status(200).json({
        success: true,
        result: parsedResult,
      });
    }

    // ===============================
    // FALLBACK SI LE JSON N'EST PAS PARFAIT
    // ===============================

    return res.status(200).json({
      success: true,
      result: {
        score: 50,
        matchingLevel: "Moyen",
        detectedSkills: [],
        matchingSkills: [],
        missingSkills: [],
        strengths: [],
        weaknesses: [],
        summary:
          "L'analyse IA a été générée, mais la réponse n'a pas pu être convertie automatiquement en JSON.",
        decision: "À revoir",
        decisionColor: "yellow",
        recommendations: [
          "Relancer l'analyse avec un CV plus structuré.",
          "Vérifier manuellement les compétences du candidat.",
        ],
        rawResponse: aiResponse,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la comparaison CV / Offre.",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  askAI,
  matchCVWithJob,
};