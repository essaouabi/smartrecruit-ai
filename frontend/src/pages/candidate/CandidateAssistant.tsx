// ======================================================
// CANDIDATE ASSISTANT PAGE - SMARTRECRUIT AI
// Premium Candidate AI Coach / Violet Indigo Career Design
// ======================================================

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";

import {
  FaRobot,
  FaPaperPlane,
  FaMagic,
  FaUserGraduate,
  FaFileAlt,
  FaBriefcase,
  FaLightbulb,
  FaComments,
  FaRocket,
  FaBrain,
  FaCheckCircle,
  FaSyncAlt,
  FaTrash,
  FaClipboardList,
  FaStar,
  FaBolt,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type Message = {
  role: "user" | "assistant";
  content: string;
};

type QuickAction = {
  title: string;
  description: string;
  icon: ReactNode;
  prompt: string;
  gradient: string;
};

// ======================================================
// COMPONENT
// ======================================================

const CandidateAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis votre coach IA SmartRecruit. Je peux vous aider à améliorer votre CV, préparer vos entretiens, analyser vos candidatures et renforcer vos compétences.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ======================================================
  // AUTO SCROLL
  // ======================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  const handleSend = async (customMessage?: string) => {
    try {
      const messageToSend = customMessage || input;

      if (!messageToSend.trim()) return;

      const userMessage: Message = {
        role: "user",
        content: messageToSend,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      const response = await api.post("/ai/ask", {
        message: messageToSend,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response || "Aucune réponse IA.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.log(error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "Erreur IA SmartRecruit. Vérifiez la connexion backend ou la configuration du service IA.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversation réinitialisée. Je suis prêt à vous accompagner pour votre CV, vos entretiens et vos candidatures.",
      },
    ]);
  };

  // ======================================================
  // DATA
  // ======================================================

  const quickActions: QuickAction[] = [
    {
      title: "Améliorer mon CV",
      description: "Conseils précis et professionnels",
      icon: <FaFileAlt />,
      prompt:
        "Analyse mon CV et donne-moi des conseils précis pour l'améliorer : structure, compétences, expérience, mots-clés et présentation.",
      gradient: "from-violet-600 to-indigo-600",
    },
    {
      title: "Préparer un entretien",
      description: "Questions + réponses attendues",
      icon: <FaComments />,
      prompt:
        "Aide-moi à préparer un entretien pour un poste de développeur informatique avec questions techniques, RH et conseils de réponse.",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Compétences à renforcer",
      description: "Plan de progression carrière",
      icon: <FaLightbulb />,
      prompt:
        "Quelles compétences techniques dois-je renforcer pour devenir développeur full stack et améliorer mon employabilité ?",
      gradient: "from-amber-400 to-orange-600",
    },
    {
      title: "Stratégie candidature",
      description: "Obtenir plus d’entretiens",
      icon: <FaBriefcase />,
      prompt:
        "Donne-moi une stratégie professionnelle pour réussir mes candidatures, améliorer mon profil et obtenir plus d’entretiens.",
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const coachingAreas = [
    "Optimisation CV",
    "Préparation entretien",
    "Lettre de motivation",
    "Stratégie candidature",
    "Compétences techniques",
    "Plan carrière",
  ];

  const totalMessages = messages.length;
  const userMessages = messages.filter((message) => message.role === "user").length;
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  ).length;

  // ======================================================
  // UI
  // ======================================================

  return (
    <CandidateLayout>
      <div className="space-y-7">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#312e81] via-[#7c3aed] to-[#ec4899] p-8 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-pink-300/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-300/25 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaRocket className="text-pink-100" />

                <span className="text-xs uppercase tracking-[3px] font-black text-pink-100">
                  SmartRecruit Candidate AI Coach
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Assistant IA candidat
                <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  pour booster votre carrière.
                </span>
              </h1>

              <p className="text-indigo-100 max-w-3xl mt-5 leading-7">
                Posez vos questions sur votre CV, vos entretiens, vos
                candidatures, vos compétences ou votre stratégie professionnelle.
              </p>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Messages" value={totalMessages} />
              <HeroMetric title="Questions" value={userMessages} />
              <HeroMetric title="Réponses IA" value={assistantMessages} />
              <HeroMetric title="Statut" value={loading ? "Actif" : "Prêt"} />
            </div>
          </div>
        </motion.section>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSend(action.prompt)}
              className="relative overflow-hidden rounded-[26px] bg-white border border-slate-200 p-5 text-left shadow-lg hover:shadow-xl hover:border-violet-200 transition"
            >
              <div
                className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center text-xl shadow-md mb-4`}
              >
                {action.icon}
              </div>

              <h3 className="font-black text-slate-900 text-lg">
                {action.title}
              </h3>

              <p className="text-slate-500 text-sm mt-1 leading-6">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* CHAT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#312e81] via-[#7c3aed] to-[#ec4899] text-white p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                    <FaRobot />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      Coach carrière IA
                    </h2>

                    <p className="text-indigo-100 text-sm mt-1">
                      Réponses personnalisées pour votre progression
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 text-emerald-100 border border-emerald-300/20 px-4 py-2 rounded-full text-sm font-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    En ligne
                  </span>

                  <button
                    type="button"
                    onClick={clearConversation}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 transition"
                  >
                    <FaTrash />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="h-[540px] overflow-y-auto p-6 bg-slate-50">
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[26px] px-6 py-5 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-violet-600 to-pink-500 text-white"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-white/15 text-white"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <FaUserGraduate />
                          ) : (
                            <FaRobot />
                          )}
                        </div>

                        <div>
                          <h3 className="font-black">
                            {message.role === "user"
                              ? "Vous"
                              : "SmartRecruit Coach IA"}
                          </h3>

                          <p
                            className={`text-xs ${
                              message.role === "user"
                                ? "text-pink-100"
                                : "text-slate-400"
                            }`}
                          >
                            {message.role === "user"
                              ? "Candidat"
                              : "Assistant carrière"}
                          </p>
                        </div>
                      </div>

                      <div className="leading-8 whitespace-pre-line text-[15px]">
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-slate-200 rounded-[26px] px-6 py-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FaRobot className="text-violet-600 text-xl" />

                        <p className="font-bold text-slate-700">
                          Génération en cours...
                        </p>

                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150" />
                          <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-slate-200 p-5 bg-white">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Posez une question sur votre CV, entretien ou candidature..."
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-violet-100 text-[15px]"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-pink-500 hover:scale-[1.01] transition text-white px-7 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSyncAlt className="animate-spin" />
                      ...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="xl:col-span-4 space-y-5">
            <PanelCard title="Domaines de coaching" subtitle="Votre assistant peut vous aider sur">
              <div className="space-y-3">
                {coachingAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-[18px] bg-slate-50 border border-slate-200 p-4"
                  >
                    <FaCheckCircle className="text-violet-600" />
                    <span className="text-sm font-bold text-slate-700">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard title="Conseil carrière" subtitle="Optimisation candidat">
              <div className="rounded-[24px] bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FaLightbulb className="text-violet-700 text-2xl" />

                  <h3 className="font-black text-violet-900">
                    Soyez précis dans vos demandes
                  </h3>
                </div>

                <p className="text-sm text-violet-900 leading-7">
                  Donnez le poste visé, vos compétences actuelles et vos
                  difficultés. L’assistant pourra vous fournir des conseils plus
                  adaptés à votre profil.
                </p>
              </div>
            </PanelCard>

            <PanelCard title="Objectifs candidat" subtitle="Progression professionnelle">
              <div className="space-y-3">
                <StatusLine icon={<FaFileAlt />} label="CV" value="Optimiser" />
                <StatusLine icon={<FaComments />} label="Entretien" value="Préparer" />
                <StatusLine icon={<FaBriefcase />} label="Candidature" value="Réussir" />
                <StatusLine icon={<FaStar />} label="Profil" value="Renforcer" />
              </div>
            </PanelCard>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

function HeroMetric({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-indigo-100 font-black">
        {title}
      </p>

      <h3 className="text-3xl font-black mt-2 text-white">{value}</h3>
    </div>
  );
}

function PanelCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-5">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function StatusLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="text-violet-600">{icon}</div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <span className="text-sm font-black text-violet-700">{value}</span>
    </div>
  );
}

export default CandidateAssistant;