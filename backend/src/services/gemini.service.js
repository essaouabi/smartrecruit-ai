// ===============================
// OPENROUTER CONFIG
// ===============================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  ? process.env.OPENROUTER_API_KEY.trim()
  : "";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ||
  "deepseek/deepseek-chat-v3-0324:free";

// ===============================
// LOCAL FALLBACK RESPONSE
// ===============================

const localFallbackResponse = (prompt) => {
  const question = prompt.toLowerCase();

  if (
    question.includes("offre") ||
    question.includes("emploi") ||
    question.includes("job")
  ) {
    return `
Voici une offre d’emploi professionnelle :

Titre : Développeur Full Stack

Missions :
- Développer des interfaces modernes
- Concevoir des API sécurisées
- Gérer une base PostgreSQL
- Participer aux choix techniques

Compétences :
React, TypeScript, Node.js, Express, PostgreSQL, Git, Docker.

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
3. Quelle est votre expérience avec React / Node.js ?
4. Comment gérez-vous un bug complexe ?
5. Comment travaillez-vous en équipe ?
6. Pourquoi ce poste vous intéresse ?
`;
  }

  if (
    question.includes("cv") ||
    question.includes("résumer") ||
    question.includes("resume")
  ) {
    return `
Résumé RH :

Le candidat présente un profil technique à analyser selon ses compétences,
son expérience, ses projets réalisés et son adéquation avec le poste.

Recommandation :
Comparer les compétences du CV avec les besoins de l’entreprise.
`;
  }

  return `
Je peux vous aider à :
- rédiger une offre d’emploi
- générer des questions d’entretien
- résumer un CV
- comparer des candidats
- proposer une décision RH

Réponse générée en fallback local.
`;
};

// ===============================
// ASK OPENROUTER
// ===============================

const askOpenRouter = async (prompt) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return localFallbackResponse(prompt);
    }

    const finalPrompt = `
Tu es un assistant RH IA professionnel pour SmartRecruit AI.

Règles :
- Réponds toujours en français.
- Sois clair, professionnel et structuré.
- Réponse courte mais utile.
- Contexte : recrutement, CV, offres d’emploi, entretiens, candidats.

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
                "Tu es un assistant RH IA expert, professionnel et clair.",
            },
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 900,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("========== OPENROUTER ERROR ==========");
      console.log(data);
      console.log("======================================");

      return `
OpenRouter est temporairement indisponible.

Réponse alternative SmartRecruit AI :

${localFallbackResponse(prompt)}
`;
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

// ===============================
// COMPATIBILITY EXPORT
// ===============================

module.exports = {
  askGemini: askOpenRouter,
  askOpenRouter,
};