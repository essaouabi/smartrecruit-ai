import {
  useEffect,
  useRef,
  useState,
} from "react";

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
} from "react-icons/fa";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CandidateAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour 👋 Je suis votre coach IA SmartRecruit. Je peux vous aider à améliorer votre CV, préparer vos entretiens, analyser vos candidatures et renforcer vos compétences.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

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

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      setInput("");
      setLoading(true);

      const response = await api.post("/ai/ask", {
        message: messageToSend,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.data.response ||
          "Aucune réponse IA.",
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.log(error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "Erreur IA SmartRecruit. Vérifiez la connexion backend.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Améliorer mon CV",
      icon: <FaFileAlt />,
      prompt:
        "Analyse mon CV et donne-moi des conseils précis pour l'améliorer.",
    },
    {
      title: "Préparer un entretien",
      icon: <FaComments />,
      prompt:
        "Aide-moi à préparer un entretien pour un poste de développeur informatique.",
    },
    {
      title: "Compétences à renforcer",
      icon: <FaLightbulb />,
      prompt:
        "Quelles compétences techniques dois-je renforcer pour devenir développeur full stack ?",
    },
    {
      title: "Stratégie candidature",
      icon: <FaBriefcase />,
      prompt:
        "Donne-moi une stratégie professionnelle pour réussir mes candidatures et obtenir plus d’entretiens.",
    },
  ];

  return (
    <CandidateLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-cyan-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-80px] w-80 h-80 bg-blue-600/30 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <span className="inline-flex bg-white/10 border border-white/10 text-cyan-200 px-4 py-2 rounded-full text-sm font-bold">
                SmartRecruit AI Coach
              </span>

              <h1 className="text-5xl font-black mt-6">
                Assistant IA Candidat
              </h1>

              <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                Un coach intelligent pour améliorer votre CV, préparer vos entretiens et booster vos candidatures.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 min-w-[260px]">
              <p className="text-slate-300 text-sm">
                Statut IA
              </p>

              <div className="flex items-center gap-3 mt-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center text-3xl">
                  <FaRobot />
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    En ligne
                  </h3>

                  <p className="text-slate-300 text-sm">
                    Coach carrière actif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="xl:col-span-2 bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center text-2xl">
                  <FaRobot />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Coach Candidat IA
                  </h2>

                  <p className="text-slate-300 text-sm">
                    Réponses personnalisées pour votre carrière
                  </p>
                </div>
              </div>

              <div className="bg-emerald-400/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold">
                En ligne
              </div>
            </div>

            <div className="h-[560px] overflow-y-auto p-6 bg-slate-50">
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-[28px] px-6 py-5 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-white/20"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <FaUserGraduate />
                          ) : (
                            <FaRobot />
                          )}
                        </div>

                        <h3 className="font-black">
                          {message.role === "user"
                            ? "Vous"
                            : "SmartRecruit Coach IA"}
                        </h3>
                      </div>

                      <div className="leading-8 whitespace-pre-line text-sm">
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-slate-200 rounded-[28px] px-6 py-5 shadow-sm w-fit"
                  >
                    <div className="flex items-center gap-3">
                      <FaRobot className="text-blue-600" />

                      <p className="font-bold text-slate-700">
                        Génération en cours...
                      </p>

                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-slate-200 p-5 bg-white">
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Posez une question sur votre CV, entretien ou candidature..."
                  className="flex-1 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-6 rounded-2xl font-black flex items-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  <FaPaperPlane />
                  Envoyer
                </button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden bg-[#020617] rounded-[32px] p-6 text-white shadow-xl border border-white/10"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

              <div className="relative z-10">
                <FaMagic className="text-4xl mb-4 text-cyan-300" />

                <h2 className="text-3xl font-black">
                  Actions rapides
                </h2>

                <p className="text-slate-300 mt-3">
                  Lancez automatiquement les meilleurs prompts IA pour votre carrière.
                </p>
              </div>
            </motion.div>

            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                onClick={() =>
                  handleSend(action.prompt)
                }
                className="w-full bg-white rounded-[28px] p-5 shadow-xl border border-slate-200 hover:border-cyan-300 text-left transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                    {action.icon}
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {action.title}
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      SmartRecruit AI
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateAssistant;