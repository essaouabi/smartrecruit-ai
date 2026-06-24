// ===============================
// IMPORTATIONS
// ===============================

const pdfParse = require("pdf-parse");
const pool = require("../config/db");

// ===============================
// BASE DE DONNÉES DES COMPÉTENCES
// ===============================

const skillsDatabase = [
  "React", "Angular", "Vue", "Node.js", "Express", "NestJS", 
  "PostgreSQL", "MySQL", "MongoDB", "SQL", "TypeScript", 
  "JavaScript", "Python", "Java", "PHP", "Laravel", "HTML", 
  "CSS", "Bootstrap", "Tailwind", "Docker", "Kubernetes", 
  "AWS", "Azure", "Git", "GitHub", "API", "REST", "FastAPI", 
  "Django", "Flutter", "Data", "Machine Learning", "Deep Learning", 
  "IA", "AI", "NLP", "Linux", "DevOps",
  "Node JS", "Node", "Express.js", "Postgres", "Postgre", 
  "REST API", "API REST", "React.js", "Next.js", "SQL Server", 
  "HTML5", "CSS3"
];

// ===============================
// FONCTIONS UTILITAIRES
// ===============================

const cleanText = (value) => {
  return value
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
};

const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ===============================
// DÉTECTION ANNÉES EXPÉRIENCE
// ===============================

const detectYearsExperience = (text) => {
  const matches = [
    ...text.matchAll(
      /(\d+)\s*(ans|année|années|years|year)\s*(d'expérience|of experience|expérience|experience)/gi
    ),
  ];

  if (matches.length === 0) {
    return 0;
  }

  return Number(matches[0][1]) || 0;
};

// ===============================
// NIVEAU DU PROFIL
// ===============================

const getProfileLevel = (score) => {
  if (score >= 90) return "Senior Expert";
  if (score >= 75) return "Senior";
  if (score >= 60) return "Intermédiaire";
  return "Junior";
};

// ===============================
// DÉCISION RH
// ===============================

const getDecision = (score) => {
  if (score >= 85) {
    return { decision: "Excellent profil — recrutement recommandé", decisionColor: "green" };
  }
  if (score >= 70) {
    return { decision: "Bon profil — entretien conseillé", decisionColor: "blue" };
  }
  if (score >= 50) {
    return { decision: "Profil moyen — CV à améliorer", decisionColor: "yellow" };
  }
  return { decision: "Profil faible — non recommandé", decisionColor: "red" };
};

// ===============================
// EXTRACTION TÉLÉPHONE ROBUSTE
// ===============================

const extractPhone = (text) => {
  const phoneRegex =
    /(\+33|0033|0)[\s.-]*[1-9](?:[\s.-]*\d{2}){4}|(\+212|00212|0)[\s.-]*[5-7](?:[\s.-]*\d{2}){4}/g;

  const matches = text.match(phoneRegex);

  if (!matches || matches.length === 0) {
    return "Non renseigné";
  }

  return matches[0].trim();
};

// ===============================
// VÉRIFICATION LIGNE INTERDITE (NOM)
// ===============================

const isForbiddenNameLine = (line) => {
  const lower = line.toLowerCase();

  const forbidden = [
    "cv", "contact", "centre", "intérêt", "interet", "conseiller",
    "commercial", "vente", "profil", "formation", "expérience",
    "experience", "compétences", "competences", "langues", "projets",
    "adresse", "email", "linkedin", "github", "téléphone", "telephone",
    "2023", "2024"
  ];

  return forbidden.some((word) => lower.includes(word));
};

// ===============================
// EXTRACTION NOM ROBUSTE
// ===============================

const extractCandidateName = (lines) => {
  for (let i = 0; i < lines.length - 1; i++) {
    const line1 = lines[i].trim();
    const line2 = lines[i + 1].trim();

    const isLastname = /^[A-ZÀ-Ÿ]{2,}$/.test(line1);
    const isFirstname = /^[A-ZÀ-Ÿ][a-zà-ÿ]+$/i.test(line2);

    if (isLastname && isFirstname) {
      return `${line2} ${line1}`;
    }
  }

  for (const line of lines.slice(0, 50)) {
    const cleanLine = line.trim();

    if (
      cleanLine.length >= 6 &&
      cleanLine.length <= 45 &&
      cleanLine.split(" ").length >= 2 &&
      cleanLine.split(" ").length <= 4 &&
      !/\d/.test(cleanLine) &&
      !cleanLine.includes("@") &&
      !isForbiddenNameLine(cleanLine)
    ) {
      return cleanLine;
    }
  }

  return "Nom non détecté";
};

// ===============================
// EXTRACTION TITRE / POSTE (DYNAMIQUE)
// ===============================

const extractDynamicJobTitle = (lines) => {
  const titleKeywords = [
    "développeur", "developer", "ingénieur", "engineer", "data",
    "architecte", "architect", "consultant", "chef de projet",
    "manager", "lead", "tech", "technicien", "analyst", "analyste",
    "administrateur", "admin", "expert", "scientifique", "scientist",
    "développeuse", "full stack", "frontend", "backend"
  ];

  for (const line of lines.slice(0, 30)) {
    const cleanLine = line.trim();
    const lowerLine = cleanLine.toLowerCase();

    if (cleanLine.length < 4 || cleanLine.length > 60) continue;

    if (
      lowerLine.includes("@") ||
      lowerLine.includes("expérience") ||
      lowerLine.includes("formation") ||
      lowerLine.includes("compétences") ||
      /^\d/.test(cleanLine)
    ) {
      continue;
    }

    const hasTitleKeyword = titleKeywords.some(keyword => lowerLine.includes(keyword));

    if (hasTitleKeyword) {
      return cleanLine; 
    }
  }

  return "Profil Informatique"; 
};

// ===============================
// ANALYSE D'UN CV PDF
// ===============================

const analyzeUploadedCV = async (req, res) => {
  try {
    // ===============================
    // VÉRIFICATION FICHIER
    // ===============================

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier PDF reçu." });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Le fichier doit être un PDF." });
    }

    // ===============================
    // LECTURE PDF
    // ===============================

    const data = await pdfParse(req.file.buffer);

    console.log("===== TEXTE PDF EXTRAIT =====");
    console.log(data.text.split("\n").slice(0, 40).join("\n"));
    console.log("===== FIN TEXTE PDF =====");

    const cvText = cleanText(data.text || "");
    console.log(cvText);

    const cvLower = normalizeText(cvText);

    // ===============================
    // NOMBRE DE MOTS
    // ===============================

    const wordCount = cvText.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount < 80) {
      return res.status(400).json({
        message: "Document refusé : fichier trop court pour être un CV professionnel.",
      });
    }

    // ===============================
    // DÉTECTION DOCUMENTS INTERDITS
    // ===============================

    const forbiddenDocuments = [
      "lettre de motivation", "madame, monsieur", "veuillez agréer",
      "facture", "devis", "attestation", "contrat de bail"
    ];

    const isNotCV = forbiddenDocuments.some((word) => cvLower.includes(word));

    if (isNotCV) {
      return res.status(400).json({
        message: "Document refusé : ce fichier ne semble pas être un CV.",
      });
    }

    // ===============================
    // VALIDATION STRUCTURE CV
    // ===============================

    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cvText);
    const hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(cvText);
    const hasContact = hasEmail || hasPhone;

    const hasExperience = [
      "expérience", "experience", "stage", "emploi", "mission", "poste", "alternance"
    ].some((word) => cvLower.includes(word));

    const hasEducation = [
      "formation", "diplôme", "master", "licence", "bachelor", "université", "école"
    ].some((word) => cvLower.includes(word));

    const hasSkillsSection = [
      "compétences", "skills", "technologies", "outils"
    ].some((word) => cvLower.includes(word));

    if (!hasContact || !hasEducation || !hasSkillsSection) {
      return res.status(400).json({
        message: "Le CV doit contenir contact, formation et compétences.",
      });
    }

    // ===============================
    // BESOIN ENTREPRISE
    // ===============================

    const jobContext = req.body.jobContext || "";
    
    if (jobContext.trim().length < 10) {
      return res.status(400).json({
        message: "Veuillez renseigner le besoin de l’entreprise.",
      });
    }

    const jobLower = normalizeText(jobContext);

    // ===============================
    // DÉTECTION COMPÉTENCES
    // ===============================

    const detectedSkills = skillsDatabase.filter((skill) =>
      cvLower.includes(normalizeText(skill))
    );

    const requiredSkills = skillsDatabase.filter((skill) =>
      jobLower.includes(normalizeText(skill))
    );

    if (requiredSkills.length === 0) {
      return res.status(400).json({
        message: "Aucune compétence technique détectée dans le besoin entreprise.",
      });
    }

    const matchingSkills = detectedSkills.filter((skill) => requiredSkills.includes(skill));
    const missingSkills = requiredSkills.filter((skill) => !detectedSkills.includes(skill));

    // ===============================
    // EXTRACTIONS
    // ===============================

    const emailMatch = cvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const extractedEmail = emailMatch ? emailMatch[0] : "Non renseigné";

    const extractedPhone = extractPhone(cvText);

    const linkedinMatch = cvText.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/i);
    const extractedLinkedin = linkedinMatch ? linkedinMatch[0] : "Non renseigné";

    const githubMatch = cvText.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s]+/i);
    const extractedGithub = githubMatch ? githubMatch[0] : "Non renseigné";

    // Préparation des lignes pour l'extraction de nom et titre
    const lines = (data.text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const extractedName = extractCandidateName(lines);
    const extractedTitle = extractDynamicJobTitle(lines);

    // ===============================
    // ANALYSE EXPÉRIENCE & DIVERS
    // ===============================

    const yearsExperience = detectYearsExperience(cvText);
    const hasProjects = cvLower.includes("projet") || cvLower.includes("project");
    const speaksEnglish = cvLower.includes("anglais") || cvLower.includes("english");

    // ===============================
    // CALCUL SCORE IA
    // ===============================

    const matchingRate = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 0;
    let score = 20;

    score += Math.round(matchingRate * 55);
    score += Math.min(detectedSkills.length * 3, 15);
    score += Math.min(yearsExperience * 2, 10);

    if (hasExperience) score += 5;
    if (hasEducation) score += 5;
    if (hasProjects) score += 5;
    if (speaksEnglish) score += 4;

    if (matchingSkills.length === 0) {
      score = Math.min(score, 35);
    }

    score = Math.max(0, Math.min(score, 100));

    // ===============================
    // PROFIL + DÉCISION
    // ===============================

    const profileLevel = getProfileLevel(score);
    const { decision, decisionColor } = getDecision(score);

    // ===============================
    // POINTS FORTS & FAIBLES
    // ===============================

    const strengths = [];
    if (matchingSkills.length > 0) strengths.push("Compétences alignées avec le poste.");
    if (detectedSkills.length >= 4) strengths.push("Bon profil technique.");
    if (hasExperience) strengths.push("Expérience professionnelle détectée.");
    if (hasProjects) strengths.push("Présence de projets techniques.");

    const weaknesses = [];
    if (missingSkills.length > 0) weaknesses.push(`Compétences manquantes : ${missingSkills.join(", ")}`);
    if (extractedLinkedin === "Non renseigné") weaknesses.push("LinkedIn non renseigné.");
    if (extractedGithub === "Non renseigné") weaknesses.push("GitHub non renseigné.");

    // ===============================
    // RÉSUMÉ IA NARRATIF
    // ===============================
    
    const uniqueDetectedSkills = [...new Set(detectedSkills)];

    const summary = `Le candidat ${extractedName} présente un profil de ${extractedTitle}.

L'analyse du CV a permis d'identifier ${uniqueDetectedSkills.length} compétence(s) technique(s).

Le score IA global est de ${score}%, ce qui indique un profil ${score >= 70 ? "intéressant" : "à évaluer plus en détail"} pour le besoin de l'entreprise.

${missingSkills.length > 0
  ? `Des améliorations sont recommandées sur les compétences manquantes suivantes : ${missingSkills.join(", ")}.`
  : "Aucune compétence critique manquante n'a été détectée par rapport au besoin initial."}

Décision RH proposée : ${decision}.`;

    // ===============================
    // ÉTAPES 1 & 2 : IA & RECO RH
    // ===============================

    const advice = [
      "Ajouter plus de projets.",
      "Détailler les expériences.",
      "Ajouter des résultats mesurables.",
      "Adapter le CV à l’offre.",
    ];

    const interviewQuestions = [];

    matchingSkills.slice(0, 5).forEach((skill) => {
      interviewQuestions.push(`Expliquez votre expérience avec ${skill}.`);
    });

    missingSkills.slice(0, 3).forEach((skill) => {
      interviewQuestions.push(`Comment comptez-vous développer votre compétence en ${skill} ?`);
    });

    interviewQuestions.push("Présentez un projet dont vous êtes le plus fier.");
    interviewQuestions.push("Pourquoi souhaitez-vous rejoindre notre entreprise ?");

    let hrRecommendation = "";

    if (score >= 85) {
      hrRecommendation = "Profil fortement recommandé. Le candidat possède une excellente adéquation avec le poste.";
    } else if (score >= 70) {
      hrRecommendation = "Profil intéressant. Un entretien technique est recommandé pour valider les acquis.";
    } else if (score >= 50) {
      hrRecommendation = "Profil moyen. Des compétences importantes sont manquantes, à évaluer selon l'urgence.";
    } else {
      hrRecommendation = "Profil peu adapté au besoin actuel de l'entreprise.";
    }

    // ===============================
    // ENREGISTREMENT POSTGRESQL
    // ===============================

    await pool.query(
      `
      INSERT INTO candidates
      (
        name, title, email, phone, linkedin, github,
        score, skills, missing_skills, summary, job_context,
        strengths, weaknesses, advice, profile_level, years_experience,
        interview_questions, hr_recommendation
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,
        $17,$18
      )
      `,
      [
        extractedName,
        extractedTitle,
        extractedEmail,
        extractedPhone,
        extractedLinkedin,
        extractedGithub,
        score,
        detectedSkills.join(", "),
        missingSkills.join(", "),
        summary,
        jobContext,
        strengths.join(" | "),
        weaknesses.join(" | "),
        advice.join(" | "),
        profileLevel,
        yearsExperience,
        interviewQuestions.join(" | "),
        hrRecommendation,
      ]
    );

    // ===============================
    // SOCKET NOTIFICATION
    // ===============================

    const io = req.app.get("io");
    if (io) {
      io.emit("notification", {
        type: "success",
        title: "Nouveau CV analysé",
        message: `${extractedName} analysé avec un score de ${score}%`,
        date: new Date().toISOString(),
      });
    }

    // ===============================
    // RÉPONSE API
    // ===============================

    console.log("================================");
    console.log("Nom détecté :", extractedName);
    console.log("Titre détecté :", extractedTitle);
    console.log("Téléphone détecté :", extractedPhone);
    console.log("Niveau de profil :", profileLevel);
    console.log("================================");

    res.json({
      name: extractedName,
      title: extractedTitle,
      email: extractedEmail,
      phone: extractedPhone,
      linkedin: extractedLinkedin,
      github: extractedGithub,
      score,
      decision,
      decisionColor,
      summary,
      skills: detectedSkills,
      requiredSkills,
      matchingSkills,
      missingSkills,
      strengths,
      weaknesses,
      advice,
      interviewQuestions, 
      hrRecommendation,   
      statistics: {
        detectedSkills: detectedSkills.length,
        requiredSkills: requiredSkills.length,
        matchingSkills: matchingSkills.length,
        missingSkills: missingSkills.length,
        yearsExperience,
        wordCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur analyse PDF." });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  analyzeUploadedCV,
};