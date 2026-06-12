// ===============================
// IMPORTATIONS
// ===============================

const pdfParse = require("pdf-parse");
const pool = require("../config/db");

// ===============================
// BASE DE DONNÉES DES COMPÉTENCES
// ===============================

const skillsDatabase = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "NestJS",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQL",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "PHP",
  "Laravel",
  "HTML",
  "CSS",
  "Bootstrap",
  "Tailwind",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Git",
  "GitHub",
  "API",
  "REST",
  "FastAPI",
  "Django",
  "Flutter",
  "Data",
  "Machine Learning",
  "Deep Learning",
  "IA",
  "AI",
  "NLP",
  "Linux",
  "DevOps",
];

// ===============================
// NETTOYAGE TEXTE
// ===============================

const cleanText = (value) => {
  return value
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
};

// ===============================
// DÉTECTION ANNÉES EXPÉRIENCE
// ===============================

const detectYearsExperience = (text) => {
  const matches = [
    ...text.matchAll(
      /(\d+)\s*(ans|année|années|years|year)/gi
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
    return {
      decision:
        "Excellent profil — recrutement recommandé",

      decisionColor: "green",
    };
  }

  if (score >= 70) {
    return {
      decision:
        "Bon profil — entretien conseillé",

      decisionColor: "blue",
    };
  }

  if (score >= 50) {
    return {
      decision:
        "Profil moyen — CV à améliorer",

      decisionColor: "yellow",
    };
  }

  return {
    decision:
      "Profil faible — non recommandé",

    decisionColor: "red",
  };
};

// ===============================
// ANALYSE D'UN CV PDF
// ===============================

const analyzeUploadedCV = async (
  req,
  res
) => {
  try {
    // ===============================
    // VÉRIFICATION FICHIER
    // ===============================

    if (!req.file) {
      return res.status(400).json({
        message:
          "Aucun fichier PDF reçu.",
      });
    }

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return res.status(400).json({
        message:
          "Le fichier doit être un PDF.",
      });
    }

    // ===============================
    // LECTURE PDF
    // ===============================

    const data = await pdfParse(
      req.file.buffer
    );

    const cvText = cleanText(
      data.text || ""
    );

    const cvLower =
      cvText.toLowerCase();

    // ===============================
    // NOMBRE DE MOTS
    // ===============================

    const wordCount = cvText
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (wordCount < 80) {
      return res.status(400).json({
        message:
          "Document refusé : fichier trop court pour être un CV professionnel.",
      });
    }

    // ===============================
    // DÉTECTION DOCUMENTS INTERDITS
    // ===============================

    const forbiddenDocuments = [
      "lettre de motivation",
      "madame, monsieur",
      "veuillez agréer",
      "facture",
      "devis",
      "attestation",
      "contrat de bail",
    ];

    const isNotCV =
      forbiddenDocuments.some(
        (word) =>
          cvLower.includes(word)
      );

    if (isNotCV) {
      return res.status(400).json({
        message:
          "Document refusé : ce fichier ne semble pas être un CV.",
      });
    }

    // ===============================
    // VALIDATION STRUCTURE CV
    // ===============================

    const hasEmail =
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
        cvText
      );

    const hasPhone =
      /(\+?\d[\d\s().-]{7,}\d)/.test(
        cvText
      );

    const hasContact =
      hasEmail || hasPhone;

    const hasExperience = [
      "expérience",
      "experience",
      "stage",
      "emploi",
      "mission",
      "poste",
      "alternance",
    ].some((word) =>
      cvLower.includes(word)
    );

    const hasEducation = [
      "formation",
      "diplôme",
      "master",
      "licence",
      "bachelor",
      "université",
      "école",
    ].some((word) =>
      cvLower.includes(word)
    );

    const hasSkillsSection = [
      "compétences",
      "skills",
      "technologies",
      "outils",
    ].some((word) =>
      cvLower.includes(word)
    );

    if (
      !hasContact ||
      !hasEducation ||
      !hasSkillsSection
    ) {
      return res.status(400).json({
        message:
          "Le CV doit contenir contact, formation et compétences.",
      });
    }

    // ===============================
    // BESOIN ENTREPRISE
    // ===============================

    const jobContext =
      req.body.jobContext || "";

    const jobLower =
      jobContext.toLowerCase();

    if (
      jobContext.trim().length < 10
    ) {
      return res.status(400).json({
        message:
          "Veuillez renseigner le besoin de l’entreprise.",
      });
    }

    // ===============================
    // DÉTECTION COMPÉTENCES
    // ===============================

    const detectedSkills =
      skillsDatabase.filter(
        (skill) =>
          cvLower.includes(
            skill.toLowerCase()
          )
      );

    const requiredSkills =
      skillsDatabase.filter(
        (skill) =>
          jobLower.includes(
            skill.toLowerCase()
          )
      );

    if (
      requiredSkills.length === 0
    ) {
      return res.status(400).json({
        message:
          "Aucune compétence technique détectée dans le besoin entreprise.",
      });
    }

    const matchingSkills =
      detectedSkills.filter(
        (skill) =>
          requiredSkills.includes(
            skill
          )
      );

    const missingSkills =
      requiredSkills.filter(
        (skill) =>
          !detectedSkills.includes(
            skill
          )
      );

    // ===============================
    // EXTRACTION EMAIL
    // ===============================

    const emailMatch =
      cvText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );

    const extractedEmail =
      emailMatch
        ? emailMatch[0]
        : "Non renseigné";

    // ===============================
    // EXTRACTION TÉLÉPHONE
    // ===============================

    const phoneMatch =
      cvText.match(
        /(\+?\d[\d\s().-]{7,}\d)/
      );

    const extractedPhone =
      phoneMatch
        ? phoneMatch[0]
        : "Non renseigné";

    // ===============================
    // EXTRACTION LINKEDIN
    // ===============================

    const linkedinMatch =
      cvText.match(
        /(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/i
      );

    const extractedLinkedin =
      linkedinMatch
        ? linkedinMatch[0]
        : "Non renseigné";

    // ===============================
    // EXTRACTION GITHUB
    // ===============================

    const githubMatch =
      cvText.match(
        /(https?:\/\/)?(www\.)?github\.com\/[^\s]+/i
      );

    const extractedGithub =
      githubMatch
        ? githubMatch[0]
        : "Non renseigné";

    // ===============================
    // EXTRACTION NOM
    // ===============================

    const lines = (
      data.text || ""
    )
      .split("\n")
      .map((line) =>
        line.trim()
      )
      .filter(Boolean);

    let extractedName =
      "Nom non détecté";

    for (const line of lines.slice(
      0,
      12
    )) {
      const lowerLine =
        line.toLowerCase();

      const isBadLine =
        lowerLine.includes("cv") ||
        lowerLine.includes(
          "email"
        ) ||
        lowerLine.includes(
          "linkedin"
        ) ||
        line.includes("@");

      const isValidName =
        line.length > 4 &&
        line.length < 45 &&
        !/\d/.test(line) &&
        line.split(" ").length >=
          2 &&
        line.split(" ").length <=
          4 &&
        !isBadLine;

      if (isValidName) {
        extractedName = line;
        break;
      }
    }

    // ===============================
    // ANALYSE EXPÉRIENCE
    // ===============================

    const yearsExperience =
      detectYearsExperience(
        cvText
      );

    const hasProjects =
      cvLower.includes("projet") ||
      cvLower.includes("project");

    const speaksEnglish =
      cvLower.includes("anglais") ||
      cvLower.includes("english");

    // ===============================
    // CALCUL SCORE IA
    // ===============================

    const matchingRate =
      requiredSkills.length > 0
        ? matchingSkills.length /
          requiredSkills.length
        : 0;

    let score = 20;

    score += Math.round(
      matchingRate * 55
    );

    score += Math.min(
      detectedSkills.length * 3,
      15
    );

    score += Math.min(
      yearsExperience * 2,
      10
    );

    if (hasExperience)
      score += 5;

    if (hasEducation)
      score += 5;

    if (hasProjects)
      score += 5;

    if (speaksEnglish)
      score += 4;

    if (
      matchingSkills.length === 0
    ) {
      score = Math.min(score, 35);
    }

    score = Math.max(
      0,
      Math.min(score, 100)
    );

    // ===============================
    // PROFIL + DÉCISION
    // ===============================

    const profileLevel =
      getProfileLevel(score);

    const {
      decision,
      decisionColor,
    } = getDecision(score);

    // ===============================
    // POINTS FORTS
    // ===============================

    const strengths = [];

    if (
      matchingSkills.length > 0
    ) {
      strengths.push(
        "Compétences alignées avec le poste."
      );
    }

    if (
      detectedSkills.length >= 4
    ) {
      strengths.push(
        "Bon profil technique."
      );
    }

    if (hasExperience) {
      strengths.push(
        "Expérience professionnelle détectée."
      );
    }

    if (hasProjects) {
      strengths.push(
        "Présence de projets techniques."
      );
    }

    // ===============================
    // POINTS FAIBLES
    // ===============================

    const weaknesses = [];

    if (
      missingSkills.length > 0
    ) {
      weaknesses.push(
        `Compétences manquantes : ${missingSkills.join(
          ", "
        )}`
      );
    }

    if (
      extractedLinkedin ===
      "Non renseigné"
    ) {
      weaknesses.push(
        "LinkedIn non renseigné."
      );
    }

    if (
      extractedGithub ===
      "Non renseigné"
    ) {
      weaknesses.push(
        "GitHub non renseigné."
      );
    }

    // ===============================
    // RÉSUMÉ IA
    // ===============================

    const summary = `
CV validé avec succès.

Profil :
${profileLevel}

Compétences détectées :
${detectedSkills.length}

Compétences correspondantes :
${matchingSkills.length}

Compétences manquantes :
${missingSkills.length}

Score IA :
${score}%
`;

    // ===============================
    // ENREGISTREMENT POSTGRESQL
    // ===============================

    await pool.query(
      `
      INSERT INTO candidates
      (
        name,
        title,
        email,
        phone,
        linkedin,
        github,
        score,
        skills,
        missing_skills,
        summary,
        job_context
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        extractedName,
        profileLevel,
        extractedEmail,
        extractedPhone,
        extractedLinkedin,
        extractedGithub,
        score,
        detectedSkills.join(", "),
        missingSkills.join(", "),
        summary,
        jobContext,
      ]
    );

    // ===============================
    // SOCKET NOTIFICATION
    // ===============================

    const io =
      req.app.get("io");

    if (io) {
      io.emit(
        "notification",
        {
          type: "success",

          title:
            "Nouveau CV analysé",

          message: `${extractedName} analysé avec un score de ${score}%`,

          date: new Date().toISOString(),
        }
      );
    }

    // ===============================
    // RÉPONSE API
    // ===============================

    res.json({
      name: extractedName,

      title: profileLevel,

      email: extractedEmail,

      phone: extractedPhone,

      linkedin:
        extractedLinkedin,

      github: extractedGithub,

      score,

      decision,

      decisionColor,

      summary,

      skills:
        detectedSkills,

      requiredSkills,

      matchingSkills,

      missingSkills,

      strengths,

      weaknesses,

      advice: [
        "Ajouter plus de projets.",
        "Détailler les expériences.",
        "Ajouter des résultats mesurables.",
        "Adapter le CV à l’offre.",
      ],

      statistics: {
        detectedSkills:
          detectedSkills.length,

        requiredSkills:
          requiredSkills.length,

        matchingSkills:
          matchingSkills.length,

        missingSkills:
          missingSkills.length,

        yearsExperience,

        wordCount,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Erreur analyse PDF.",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  analyzeUploadedCV,
};