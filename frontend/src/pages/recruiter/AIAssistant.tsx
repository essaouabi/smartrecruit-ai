// ======================================================
// AI ASSISTANT PAGE - SMARTRECRUIT AI
// Premium Clean Version / Jury Ready
// ======================================================

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaRobot,
  FaPaperPlane,
  FaUserTie,
  FaMagic,
  FaBrain,
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaSyncAlt,
  FaTrash,
  FaLightbulb,
  FaComments,
  FaClipboardList,
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
  prompt: string;
  icon: ReactNode;
  gradient: string;
};

// ======================================================
// COMPONENT
// ======================================================

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis votre assistant RH IA SmartRecruit. Je peux vous aider à analyser des CV, générer des questions d’entretien, rédiger des offres d’emploi, comparer des candidats et préparer des décisions RH professionnelles.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
          "Conversation réinitialisée. Je suis prêt à vous aider pour vos tâches RH, vos analyses de CV et vos décisions de recrutement.",
      },
    ]);
  };

  const quickActions: QuickAction[] = [
    {
      title: "Analyser candidat",
      description: "Décision RH complète",
      prompt:
        "Analyse ce candidat et donne une décision RH professionnelle avec points forts, points faibles et recommandation finale.",
      icon: <FaUsers />,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      title: "Questions entretien",
      description: "Technique + RH",
      prompt:
        "Génère des questions d’entretien pour un développeur React avec questions techniques, comportementales et critères d’évaluation.",
      icon: <FaBriefcase />,
      gradient: "from-indigo-500 to-violet-600",
    },
    {
      title: "Rédiger offre",
      description: "Offre moderne",
      prompt:
        "Rédige une offre d’emploi moderne pour un développeur Full Stack avec missions, profil recherché, compétences et avantages.",
      icon: <FaFileAlt />,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Résumer CV",
      description: "Résumé recruteur",
      prompt:
        "Résume ce CV de manière professionnelle pour un recruteur avec profil, compétences, expérience et niveau estimé.",
      icon: <FaClipboardList />,
      gradient: "from-amber-400 to-orange-600",
    },
    {
      title: "Comparer profils",
      description: "Meilleur candidat",
      prompt:
        "Compare deux candidats et propose le meilleur profil avec justification RH, risques et recommandation finale.",
      icon: <FaBrain />,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  const capabilities = [
    "Analyse RH des profils",
    "Questions d’entretien",
    "Rédaction d’offres",
    "Comparaison de candidats",
    "Recommandations recruteur",
    "Décision assistée",
  ];

  const totalMessages = messages.length;

  const userMessages = messages.filter(
    (message) => message.role === "user"
  ).length;

  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#020617] via-[#041337] to-[#06384a] p-7 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaBolt className="text-cyan-300" />
                <span className="text-xs uppercase tracking-[3px] font-black text-cyan-200">
                  SmartRecruit Assistant RH
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Assistant IA recruteur
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  rapide, clair et professionnel
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-4 leading-7">
                Centralisez vos demandes RH : analyse de profils, préparation
                d’entretien, rédaction d’offres, comparaison de candidats et
                aide à la décision.
              </p>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Messages" value={totalMessages} />
              <HeroMetric title="Demandes RH" value={userMessages} />
              <HeroMetric title="Réponses IA" value={assistantMessages} />
              <HeroMetric title="Statut" value={loading ? "Analyse" : "Prêt"} />
            </div>
          </div>
        </motion.section>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSend(action.prompt)}
              className="relative overflow-hidden rounded-[24px] bg-white border border-slate-200 p-5 text-left shadow-lg hover:shadow-xl hover:border-cyan-200 transition"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center text-xl shadow-md mb-4`}
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

        {/* MAIN */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* CHAT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden"
          >
            {/* CHAT HEADER */}
            <div className="bg-gradient-to-br from-[#020617] via-[#041337] to-[#06384a] text-white p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                    <FaRobot />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      Conversation RH IA
                    </h2>

                    <p className="text-slate-300 text-sm mt-1">
                      Assistant recruteur connecté au backend SmartRecruit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 px-4 py-2 rounded-full text-sm font-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
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

            {/* MESSAGES */}
            <div className="h-[520px] overflow-y-auto p-6 bg-slate-50">
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
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-white/15 text-white"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {message.role === "user" ? <FaUserTie /> : <FaRobot />}
                        </div>

                        <div>
                          <h3 className="font-black">
                            {message.role === "user"
                              ? "Vous"
                              : "SmartRecruit AI"}
                          </h3>

                          <p
                            className={`text-xs ${
                              message.role === "user"
                                ? "text-cyan-100"
                                : "text-slate-400"
                            }`}
                          >
                            {message.role === "user"
                              ? "Recruteur"
                              : "Assistant RH intelligent"}
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
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                          <FaRobot />
                        </div>

                        <div>
                          <h3 className="font-black text-slate-900">
                            SmartRecruit AI
                          </h3>

                          <p className="text-xs text-slate-400">
                            Génération en cours...
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce" />
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce delay-150" />
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce delay-300" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* INPUT */}
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
                  placeholder="Posez une question RH IA..."
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-cyan-100 text-[15px]"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] transition text-white px-7 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
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
            <PanelCard title="Capacités IA" subtitle="Fonctions disponibles">
              <div className="grid grid-cols-1 gap-3">
                {capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="flex items-center gap-3 rounded-[18px] bg-slate-50 border border-slate-200 p-4"
                  >
                    <FaCheckCircle className="text-emerald-600" />

                    <span className="text-sm font-bold text-slate-700">
                      {capability}
                    </span>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard title="Statut du service" subtitle="Connexion IA">
              <div className="space-y-3">
                <StatusLine
                  icon={<FaRobot />}
                  label="Assistant IA"
                  value="Disponible"
                />

                <StatusLine
                  icon={<FaClock />}
                  label="Temps moyen"
                  value="Instantané"
                />

                <StatusLine
                  icon={<FaShieldAlt />}
                  label="Backend"
                  value="Connecté"
                />
              </div>
            </PanelCard>

            <PanelCard title="Conseil jury" subtitle="Valeur professionnelle">
              <div className="rounded-[20px] bg-cyan-50 border border-cyan-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FaLightbulb className="text-cyan-700 text-xl" />

                  <h3 className="font-black text-cyan-900">
                    Pourquoi cette page est importante
                  </h3>
                </div>

                <p className="text-sm text-cyan-900 leading-7">
                  Elle montre l’intégration concrète d’un assistant IA dans un
                  processus RH réel : analyse, rédaction, préparation
                  d’entretien, comparaison et aide à la décision.
                </p>
              </div>
            </PanelCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
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
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
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
        <div className="text-cyan-600">{icon}</div>

        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <span className="text-sm font-black text-emerald-600">{value}</span>
    </div>
  );
}

export default AIAssistant;