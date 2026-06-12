// ===============================
// IMPORTS
// ===============================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaRobot,
  FaPaperPlane,
  FaUserTie,
  FaMagic,
} from "react-icons/fa";

import { motion } from "framer-motion";

// ===============================
// MESSAGE TYPE
// ===============================

type Message = {
  role: "user" | "assistant";
  content: string;
};

// ===============================
// AI ASSISTANT PAGE
// ===============================

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour 👋 Je suis votre assistant RH IA SmartRecruit. Je peux vous aider à analyser des CV, générer des questions d’entretien, rédiger des offres d’emploi et comparer des candidats.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  // ===============================
  // AUTO SCROLL
  // ===============================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ===============================
  // SEND MESSAGE
  // ===============================

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

      const response = await api.post(
        "/ai/ask",
        {
          message: messageToSend,
        }
      );

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
          "Erreur IA SmartRecruit. Vérifiez la connexion backend ou Gemini.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // QUICK ACTIONS
  // ===============================

  const quickActions = [
    {
      title: "Analyser un candidat",
      prompt:
        "Analyse ce candidat et donne une décision RH professionnelle.",
    },
    {
      title: "Questions entretien",
      prompt:
        "Génère des questions d’entretien pour un développeur React.",
    },
    {
      title: "Rédiger une offre",
      prompt:
        "Rédige une offre d’emploi moderne pour un développeur Full Stack.",
    },
    {
      title: "Résumer un CV",
      prompt:
        "Résume ce CV de manière professionnelle.",
    },
    {
      title: "Comparer candidats",
      prompt:
        "Compare deux candidats et propose le meilleur profil.",
    },
  ];

  return (
    <DashboardLayout>
      {/* HEADER */}

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white text-3xl shadow-lg">
            <FaMagic />
          </div>

          <div>
            <h1 className="text-5xl font-bold text-[#0b3d2e]">
              SmartRecruit AI
            </h1>

            <p className="text-gray-500 text-lg mt-2">
              Assistant RH intelligent connecté à Gemini AI.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-3 gap-8">
        {/* CHAT */}

        <div className="col-span-2 bg-white rounded-[36px] shadow-sm border border-gray-100 overflow-hidden">
          {/* TOP BAR */}

          <div className="bg-gradient-to-r from-[#062c22] to-[#0b3d2e] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                <FaRobot />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Assistant RH IA
                </h2>

                <p className="text-green-100 text-sm">
                  SmartRecruit Intelligence
                </p>
              </div>
            </div>

            <div className="bg-green-400/20 px-4 py-2 rounded-full text-sm font-semibold">
              En ligne
            </div>
          </div>

          {/* MESSAGES */}

          <div className="h-[620px] overflow-y-auto p-8 bg-[#f8faf8]">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-[28px] px-6 py-5 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#0b3d2e] text-white"
                        : "bg-white border border-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          message.role === "user"
                            ? "bg-white/10"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {message.role === "user" ? (
                          <FaUserTie />
                        ) : (
                          <FaRobot />
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {message.role === "user"
                            ? "Vous"
                            : "SmartRecruit AI"}
                        </h3>

                        <p
                          className={`text-xs ${
                            message.role === "user"
                              ? "text-green-100"
                              : "text-gray-400"
                          }`}
                        >
                          Assistant RH intelligent
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
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-100 rounded-[28px] px-6 py-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                        <FaRobot />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#0b3d2e]">
                          SmartRecruit AI
                        </h3>

                        <p className="text-xs text-gray-400">
                          Génération en cours...
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce delay-150"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce delay-300"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT */}

          <div className="border-t border-gray-100 p-6 bg-white">
            <div className="flex gap-4">
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
                placeholder="Posez une question RH IA..."
                className="flex-1 border border-gray-200 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-green-500 text-[15px]"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="bg-gradient-to-r from-[#062c22] to-[#0b3d2e] hover:opacity-90 text-white px-8 rounded-2xl font-semibold flex items-center gap-3 shadow-lg disabled:opacity-50"
              >
                <FaPaperPlane />
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#062c22] to-[#0b3d2e] rounded-[32px] p-7 text-white shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl mb-6">
              <FaMagic />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Actions rapides
            </h2>

            <p className="text-green-100 leading-7">
              Lancez automatiquement des tâches RH IA intelligentes.
            </p>
          </div>

          {quickActions.map((action) => (
            <motion.button
              key={action.title}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                handleSend(action.prompt)
              }
              className="w-full bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:border-green-300 hover:bg-green-50 transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-xl">
                  <FaMagic />
                </div>

                <div>
                  <h3 className="font-bold text-[#0b3d2e] text-lg">
                    {action.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    SmartRecruit AI
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;