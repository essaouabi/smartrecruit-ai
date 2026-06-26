// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// IMPORT AI MONITORING SERVICE
// ===============================

const {
  logAISuccess,
  logAIError,
} = require("../services/aiMonitoring.service");

// ===============================
// SKILLS DATABASE
// ===============================

const skillsList = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "PHP",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Docker",
  "AWS",
  "Azure",
  "Git",
  "API REST",
  "Machine Learning",
  "Deep Learning",
  "Data",
  "IA",
  "NLP",
  "TensorFlow",
  "PyTorch",
  "DevOps",
  "Kubernetes",
  "Linux",
  "HTML",
  "CSS",
  "Tailwind",
  "Bootstrap",
];

// ===============================
// DETECT LEVEL
// ===============================

const detectLevel = (score) => {
  if (score >= 90) {
    return "Senior Expert";
  }

  if (score >= 75) {
    return "Senior";
  }

  if (score >= 60) {
    return "Intermédiaire";
  }

  return "Junior";
};

// ===============================
// DETECT CANDIDATE NAME
// ===============================

const detectCandidateName = (cvText) => {
  const lines = cvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const forbiddenWords = [
    "cv",
    "curriculum",
    "vitae",
    "profil",
    "profile",
    "contact",
    "email",
    "mail",
    "téléphone",
    "telephone",
    "phone",
    "adresse",
    "address",
    "compétences",
    "competences",
    "skills",
    "expérience",
    "experience",
    "formation",
    "education",
    "centre",
    "intérêt",
    "interet",
    "loisirs",
    "hobbies",
    "projet",
    "projects",
    "langues",
    "languages",
  ];

  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i;

  const phoneRegex =
    /(\+?\d[\d\s().-]{7,})/;

  for (const line of lines.slice(0, 15)) {
    const lowerLine = line.toLowerCase();

    const hasForbiddenWord = forbiddenWords.some((word) =>
      lowerLine.includes(word)
    );

    const looksLikeEmail = emailRegex.test(line);
    const looksLikePhone = phoneRegex.test(line);
    const hasNumber = /\d/.test(line);

    const words = line
      .split(/\s+/)
      .filter((word) => word.length > 1);

    const isNameLength =
      words.length >= 2 &&
      words.length <= 4 &&
      line.length <= 45;

    const looksLikeName =
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(line);

    if (
      isNameLength &&
      looksLikeName &&
      !hasForbiddenWord &&
      !looksLikeEmail &&
      !looksLikePhone &&
      !hasNumber
    ) {
      return line;
    }
  }

  return "Candidat IA";
};

// ===============================
// DETECT EMAIL
// ===============================

const detectEmail = (cvText) => {
  const match = cvText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i
  );

  return match ? match[0] : "";
};

// ===============================
// DETECT PHONE
// ===============================

const detectPhone = (cvText) => {
  const match = cvText.match(
    /(\+?\d[\d\s().-]{7,})/
  );

  return match ? match[0].trim() : "";
};

// ===============================
// ANALYZE CV
// ===============================

const analyzeCV = async (req, res) => {
  const startTime = Date.now();

  try {
    const { cvText, jobContext } = req.body;

    if (!cvText || cvText.trim() === "") {
      return res.status(400).json({
        message: "Texte CV requis",
      });
    }

    const cvLower = cvText.toLowerCase();

    const jobLower = jobContext
      ? jobContext.toLowerCase()
      : "";

    // ===============================
    // DETECT BASIC INFO
    // ===============================

    const candidateName = detectCandidateName(cvText);
    const candidateEmail = detectEmail(cvText);
    const candidatePhone = detectPhone(cvText);

    // ===============================
    // DETECT SKILLS
    // ===============================

    const detectedSkills = skillsList.filter((skill) =>
      cvLower.includes(skill.toLowerCase())
    );

    // ===============================
    // REQUIRED SKILLS
    // ===============================

    const requiredSkills = skillsList.filter((skill) =>
      jobLower.includes(skill.toLowerCase())
    );

    // ===============================
    // MATCHING SKILLS
    // ===============================

    const matchingSkills = detectedSkills.filter((skill) =>
      requiredSkills.includes(skill)
    );

    // ===============================
    // MISSING SKILLS
    // ===============================

    const missingSkills = requiredSkills.filter(
      (skill) => !detectedSkills.includes(skill)
    );

    // ===============================
    // EXPERIENCE DETECTION
    // ===============================

    let yearsExperience = 0;

    const experienceRegex =
      /(\d+)\s*(ans|année|années|years)/gi;

    const experienceMatch =
      [...cvText.matchAll(experienceRegex)];

    if (experienceMatch.length > 0) {
      yearsExperience = parseInt(
        experienceMatch[0][1]
      );
    }

    // ===============================
    // LANGUAGE DETECTION
    // ===============================

    const speaksEnglish =
      cvLower.includes("anglais") ||
      cvLower.includes("english");

    // ===============================
    // PROJECT DETECTION
    // ===============================

    const hasProjects =
      cvLower.includes("projet") ||
      cvLower.includes("project");

    // ===============================
    // CERTIFICATIONS
    // ===============================

    const hasCertification =
      cvLower.includes("certification") ||
      cvLower.includes("aws certified") ||
      cvLower.includes("azure");

    // ===============================
    // IA SCORE
    // ===============================

    let score = 35;

    score += detectedSkills.length * 3;
    score += matchingSkills.length * 12;
    score += yearsExperience * 2;

    if (hasProjects) {
      score += 8;
    }

    if (speaksEnglish) {
      score += 6;
    }

    if (hasCertification) {
      score += 7;
    }

    if (score > 100) {
      score = 100;
    }

    // ===============================
    // PROFILE LEVEL
    // ===============================

    const level = detectLevel(score);

    // ===============================
    // DECISION RH
    // ===============================

    let decision = "";
    let decisionColor = "";

    if (score >= 85) {
      decision =
        "Excellent profil — recrutement recommandé";
      decisionColor = "green";
    } else if (score >= 70) {
      decision =
        "Bon profil — entretien recommandé";
      decisionColor = "blue";
    } else if (score >= 55) {
      decision =
        "Profil intermédiaire — amélioration possible";
      decisionColor = "yellow";
    } else {
      decision =
        "Profil insuffisant pour ce poste";
      decisionColor = "red";
    }

    // ===============================
    // SUMMARY
    // ===============================

    const summary = `
Le candidat possède ${detectedSkills.length} compétences techniques détectées.

${matchingSkills.length} compétence(s) correspondent directement aux besoins du poste.

Le niveau estimé est : ${level}.

Le score IA global est de ${score}%.
`;

    // ===============================
    // STRENGTHS
    // ===============================

    const strengths = [];

    if (detectedSkills.length >= 5) {
      strengths.push(
        "Large stack technique détectée."
      );
    }

    if (matchingSkills.length >= 3) {
      strengths.push(
        "Très bon matching avec le poste."
      );
    }

    if (hasProjects) {
      strengths.push(
        "Présence de projets techniques."
      );
    }

    if (speaksEnglish) {
      strengths.push(
        "Compétence linguistique détectée."
      );
    }

    if (yearsExperience >= 2) {
      strengths.push(
        "Expérience professionnelle intéressante."
      );
    }

    // ===============================
    // WEAKNESSES
    // ===============================

    const weaknesses = [];

    if (missingSkills.length > 0) {
      weaknesses.push(
        `Compétences manquantes : ${missingSkills.join(", ")}`
      );
    }

    if (!speaksEnglish) {
      weaknesses.push(
        "Anglais non détecté."
      );
    }

    if (!hasProjects) {
      weaknesses.push(
        "Peu de projets détectés."
      );
    }

    if (yearsExperience === 0) {
      weaknesses.push(
        "Expérience professionnelle peu détaillée."
      );
    }

    // ===============================
    // ADVICE
    // ===============================

    const advice = [
      "Ajouter davantage de projets techniques.",
      "Préciser les technologies utilisées.",
      "Ajouter les résultats mesurables.",
      "Structurer les expériences professionnelles.",
      "Ajouter certifications et compétences cloud.",
    ];

    // ===============================
    // SAVE DATABASE
    // ===============================

    await pool.query(
      `
      INSERT INTO candidates
      (
        name,
        title,
        email,
        phone,
        score,
        skills,
        missing_skills,
        summary,
        job_context
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        candidateName,
        level,
        candidateEmail,
        candidatePhone,
        score,
        detectedSkills.join(", "),
        missingSkills.join(", "),
        summary,
        jobContext || "",
      ]
    );

    // ===============================
    // AI MONITORING LOG
    // ===============================

    await logAISuccess({
      req,
      endpoint: "/api/cv/analyze",
      model: "SmartRecruit CV Scoring Engine",
      score,
      decision,
      responseTimeMs: Date.now() - startTime,
      cvName: candidateName,
      jobContext: jobContext || "Analyse CV sans contexte poste",
      promptTokens: Math.round(cvText.length / 4),
      completionTokens: Math.round(summary.length / 4),
      totalTokens:
        Math.round(cvText.length / 4) +
        Math.round(summary.length / 4),
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
    });

    // ===============================
    // RESPONSE
    // ===============================

    res.status(200).json({
      name: candidateName,
      title: level,
      email: candidateEmail,
      phone: candidatePhone,

      score,

      decision,
      decisionColor,

      summary,

      yearsExperience,

      skills: detectedSkills,

      requiredSkills,

      matchingSkills,

      missingSkills,

      strengths,

      weaknesses,

      advice,

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
      },
    });
  } catch (error) {
    console.log(error);

    await logAIError({
      req,
      endpoint: "/api/cv/analyze",
      model: "SmartRecruit CV Scoring Engine",
      responseTimeMs: Date.now() - startTime,
      errorMessage: error.message || "Erreur serveur analyse CV",
      cvName: "Analyse CV texte",
      jobContext: req.body?.jobContext || null,
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
    });

    res.status(500).json({
      message:
        "Erreur serveur analyse CV",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  analyzeCV,
};