// ======================================================
// SERVICE IA - SMARTRECRUIT AI
// ======================================================
// Ce service permet de communiquer avec OpenRouter.
// Il est utilisé pour :
// - l'assistant RH IA ;
// - la génération d'offres ;
// - la génération de questions d'entretien ;
// - le résumé de CV ;
// - la comparaison CV ↔ Offre ;
// - les réponses IA structurées.
// ======================================================


// ======================================================
// CONFIGURATION OPENROUTER
// ======================================================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  ? process.env.OPENROUTER_API_KEY.trim()
  : "";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ||
  "deepseek/deepseek-chat-v3-0324:free";


// ======================================================
// RÉPONSE LOCALE STRUCTURÉE POUR LE MATCHING CV ↔ OFFRE
// ======================================================
// Cette fonction est utilisée si OpenRouter n'est pas disponible.
// Elle permet de garder l'application fonctionnelle même sans clé API.

const localMatchFallbackResponse = () => {
  return JSON.stringify({
    score: 75,
    matchingLevel: "Bon",
    detectedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Git",
    ],
    matchingSkills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "API REST",
    ],
    missingSkills: [
      "Docker",
      "Kubernetes",
      "CI/CD avancé",
    ],
    strengths: [
      "Bonne maîtrise du développement Full Stack",
      "Compétences backend adaptées au poste",
      "Expérience avec les API REST et PostgreSQL",
    ],
    weaknesses: [
      "Compétences DevOps encore à renforcer",
      "Peu d'informations sur l'expérience cloud",
    ],
    summary:
      "Le candidat présente un profil cohérent avec le poste de développeur Full Stack. Ses compétences principales correspondent aux besoins techniques, notamment React, Node.js et PostgreSQL.",
    decision: "Entretien recommandé",
    decisionColor: "blue",
    recommendations: [
      "Prévoir un entretien technique sur React et Node.js.",
      "Vérifier le niveau réel en DevOps.",
      "Demander des exemples de projets réalisés.",
    ],
  });
};


// ======================================================
// RÉPONSE LOCALE GÉNÉRALE
// ======================================================
// Cette fonction fournit des réponses locales si l'API IA
// est indisponible ou si aucune clé API n'est configurée.

const localFallbackResponse = (prompt) => {
  const question = prompt.toLowerCase();

  if (
    question.includes("match") ||
    question.includes("compatibilité") ||
    question.includes("compare") ||
    question.includes("comparaison") ||
    question.includes("cv") && question.includes("offre")
  ) {
    return localMatchFallbackResponse();
  }

  if (
    question.includes("offre") ||
    question.includes("emploi") ||
    question.includes("job")
  ) {
    return `
Voici une offre d’emploi professionnelle :

Titre : Développeur Full Stack

Missions :
- Développer des interfaces modernes avec React et TypeScript.
- Concevoir des API REST sécurisées avec Node.js et Express.
- Gérer une base de données PostgreSQL.
- Participer aux choix techniques et à l'amélioration continue.

Compétences recherchées :
React, TypeScript, Node.js, Express, PostgreSQL, Git, Docker, API REST.

Profil recherché :
Personne autonome, rigoureuse, curieuse et capable de travailler en équipe.
`;
  }

  if (
    question.includes("question") ||
    question.includes("entretien")
  ) {
    return `
Voici des questions d’entretien :

1. Présentez votre parcours.
2. Quels projets techniques avez-vous réalisés ?
3. Quelle est votre expérience avec React et Node.js ?
4. Comment sécurisez-vous une API REST ?
5. Comment gérez-vous une erreur en production ?
6. Quelle est votre expérience avec PostgreSQL ?
7. Comment travaillez-vous en équipe ?
`;
  }

  if (
    question.includes("cv") ||
    question.includes("résumer") ||
    question.includes("resume")
  ) {
    return `
Résumé RH :

Le candidat présente un profil technique pouvant être analysé selon ses compétences,
son expérience, ses projets réalisés et son adéquation avec le poste.

Recommandation :
Comparer les compétences du CV avec les besoins réels de l’entreprise.
`;
  }

  return `
Je peux vous aider à :
- rédiger une offre d’emploi ;
- générer des questions d’entretien ;
- résumer un CV ;
- comparer un CV avec une offre ;
- proposer une décision RH ;
- analyser les compétences d’un candidat.

Réponse générée en fallback local SmartRecruit AI.
`;
};


// ======================================================
// ASK OPENROUTER
// ======================================================
// Cette fonction envoie une requête à OpenRouter.
// Si l'API est indisponible, elle retourne une réponse locale.

const askOpenRouter = async (prompt) => {
  try {
    // Si aucune clé API n'est configurée, on utilise le fallback local
    if (!OPENROUTER_API_KEY) {
      return localFallbackResponse(prompt);
    }

    const finalPrompt = `
Tu es un assistant RH IA professionnel intégré à SmartRecruit AI.

Contexte :
SmartRecruit AI est une plateforme intelligente de recrutement permettant :
- l'analyse de CV ;
- la détection des compétences ;
- la comparaison CV ↔ Offre ;
- la génération de scores RH ;
- la production de décisions RH ;
- l'assistance aux recruteurs.

Règles générales :
- Réponds toujours en français.
- Sois clair, professionnel et structuré.
- Reste dans le contexte RH, recrutement, CV, offres d'emploi, compétences et candidats.
- Si la demande exige du JSON, retourne uniquement du JSON valide sans texte avant ni après.

Demande utilisateur :
${prompt}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "SmartRecruit AI",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant RH IA expert, professionnel, clair et capable de retourner du JSON valide lorsque demandé.",
            },
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 1200,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("========== OPENROUTER ERROR ==========");
      console.log(data);
      console.log("======================================");

      return localFallbackResponse(prompt);
    }

    const aiResponse =
      data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return localFallbackResponse(prompt);
    }

    return aiResponse;

  } catch (error) {
    console.log("========== OPENROUTER ERROR ==========");
    console.log(error.message);
    console.log("======================================");

    return localFallbackResponse(prompt);
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  askGemini: askOpenRouter,
  askOpenRouter,
  localFallbackResponse,
  localMatchFallbackResponse,
};