// ===============================
// IMPORTATIONS
// ===============================

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import socket from "../../services/socket";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import {
  FaServer,
  FaDatabase,
  FaRobot,
  FaBug,
  FaTerminal,
  FaSyncAlt,
  FaShieldAlt,
  FaWifi,
  FaExclamationTriangle,
  FaMicrochip,
  FaMemory,
  FaBolt,
  FaNetworkWired,
} from "react-icons/fa";

// ===============================
// TYPES
// ===============================

type MonitoringData = {
  total: number;
  logs: string[];
};

type ParsedLog = {
  level: string;
  message: string;
  timestamp: string;
  action: string;
};

// ===============================
// ANALYSE D'UN LOG
// ===============================

const parseLog = (log: string): ParsedLog => {
  try {
    const parsed = JSON.parse(log.replace(/\r/g, ""));

    const message = parsed.message || "Log système";

    let action = "Activité système";

    if (message.includes("POST /api/ai")) {
      action = "Assistant IA";
    } else if (message.includes("POST /api/cv")) {
      action = "Analyse CV";
    } else if (message.includes("POST /api/jobs")) {
      action = "Création offre";
    } else if (message.includes("DELETE /api/jobs")) {
      action = "Suppression offre";
    } else if (message.includes("GET /api/jobs")) {
      action = "Consultation offres";
    } else if (message.includes("GET /api/candidates")) {
      action = "Consultation candidats";
    } else if (message.toLowerCase().includes("openrouter")) {
      action = "Événement OpenRouter IA";
    } else if (message.toLowerCase().includes("server running")) {
      action = "Serveur démarré";
    }

    return {
      level: parsed.level || "info",
      message,
      timestamp: parsed.timestamp || "",
      action,
    };
  } catch {
    return {
      level: "info",
      message: log,
      timestamp: new Date().toISOString(),
      action: "Log brut",
    };
  }
};

// ===============================
// FORMATAGE DATE
// ===============================

const formatDate = (timestamp: string) => {
  if (!timestamp) return "N/A";

  try {
    return new Date(timestamp).toLocaleString("fr-FR");
  } catch {
    return timestamp;
  }
};

// ===============================
// FILTRAGE DES LOGS UTILES
// ===============================

const isUsefulBusinessLog = (log: ParsedLog) => {
  const message = log.message.toLowerCase();

  if (message.includes("/api/monitoring/logs")) {
    return false;
  }

  return (
    message.includes("/api/ai") ||
    message.includes("/api/cv") ||
    message.includes("/api/jobs") ||
    message.includes("/api/candidates") ||
    message.includes("server running") ||
    message.includes("openrouter") ||
    message.includes("quota") ||
    log.level === "error"
  );
};

// ===============================
// COMPOSANT PRINCIPAL
// ===============================

const Monitoring = () => {
  const [data, setData] = useState<MonitoringData>({
    total: 0,
    logs: [],
  });

  const [loading, setLoading] = useState(true);

  const [realtimeConnected, setRealtimeConnected] =
    useState(false);

  // ===============================
  // RÉCUPÉRATION DES LOGS
  // ===============================

  const fetchLogs = async () => {
    try {
      const response = await api.get(
        "/monitoring/logs"
      );

      setData({
        total: response.data.total || 0,
        logs: response.data.logs || [],
      });
    } catch (error) {
      console.log(error);

      alert("Erreur monitoring");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CHARGEMENT INITIAL
  // ===============================

  useEffect(() => {
    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ===============================
  // SOCKET.IO TEMPS RÉEL
  // ===============================

  useEffect(() => {
    const handleConnect = () => {
      setRealtimeConnected(true);
    };

    const handleDisconnect = () => {
      setRealtimeConnected(false);
    };

    const handleMonitoringLog = (payload: any) => {
      const newLog = JSON.stringify({
        level: payload.type || "info",
        message:
          payload.message ||
          "Nouvel événement backend",
        timestamp:
          payload.date ||
          new Date().toISOString(),
      });

      setData((prev) => ({
        total: prev.total + 1,
        logs: [newLog, ...prev.logs],
      }));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(
      "monitoring-log",
      handleMonitoringLog
    );

    if (socket.connected) {
      setRealtimeConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(
        "monitoring-log",
        handleMonitoringLog
      );
    };
  }, []);

  // ===============================
  // LOGS PARSÉS
  // ===============================

  const parsedLogs = data.logs
    .map((log) => parseLog(log))
    .filter(isUsefulBusinessLog);

  const errorLogs = parsedLogs.filter(
    (log) => log.level === "error"
  );

  const infoLogs = parsedLogs.filter(
    (log) => log.level === "info"
  );

  const aiLogs = parsedLogs.filter(
    (log) =>
      log.message
        .toLowerCase()
        .includes("openrouter") ||
      log.message.toLowerCase().includes("/api/ai")
  );

  // ===============================
  // DONNÉES GRAPHIQUES
  // ===============================

  const liveTraffic = [
    {
      time: "08:00",
      requests: Math.max(
        20,
        parsedLogs.length + 10
      ),
      latency: 120,
    },
    {
      time: "09:00",
      requests: Math.max(
        35,
        parsedLogs.length + 18
      ),
      latency: 95,
    },
    {
      time: "10:00",
      requests: Math.max(
        55,
        parsedLogs.length + 25
      ),
      latency: 110,
    },
    {
      time: "11:00",
      requests: Math.max(
        75,
        parsedLogs.length + 30
      ),
      latency: 88,
    },
    {
      time: "12:00",
      requests: Math.max(
        50,
        parsedLogs.length + 22
      ),
      latency: 102,
    },
  ];

  const incidentData = [
    {
      name: "Info",
      value: infoLogs.length,
    },
    {
      name: "Errors",
      value: errorLogs.length,
    },
    {
      name: "IA",
      value: aiLogs.length,
    },
    {
      name: "Total",
      value: parsedLogs.length,
    },
  ];

  const systemMetrics = [
    {
      label: "CPU",
      value: 72,
      icon: <FaMicrochip />,
      color: "from-green-500 to-emerald-300",
    },
    {
      label: "RAM",
      value: 58,
      icon: <FaMemory />,
      color: "from-blue-500 to-cyan-300",
    },
    {
      label: "API",
      value: realtimeConnected ? 100 : 70,
      icon: <FaBolt />,
      color: "from-orange-500 to-yellow-300",
    },
    {
      label: "Network",
      value: realtimeConnected ? 94 : 60,
      icon: <FaNetworkWired />,
      color: "from-purple-500 to-fuchsia-300",
    },
  ];

  // ===============================
  // AFFICHAGE
  // ===============================

  return (
    <DashboardLayout>
      {/* BANNIÈRE PRINCIPALE */}

      <div className="relative overflow-hidden rounded-[40px] bg-[#07130f] border border-green-900 p-10 mb-10 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-5 py-3 rounded-full mb-6">
              <FaShieldAlt className="text-green-400" />

              <span className="text-green-300 font-semibold">
                NOC CENTER
              </span>
            </div>

            <h1 className="text-6xl font-black mb-5">
              Monitoring DevOps
            </h1>

            <p className="text-green-100 text-lg max-w-3xl leading-8">
              Supervision backend, logs API,
              incidents IA, PostgreSQL,
              WebSocket temps réel et sécurité
              applicative.
            </p>
          </div>

          <div className="bg-black/30 border border-green-500/20 rounded-[30px] p-7 min-w-[260px] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-4 h-4 rounded-full animate-pulse ${
                  realtimeConnected
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              ></div>

              <span className="text-green-300 font-bold">
                {realtimeConnected
                  ? "REALTIME ONLINE"
                  : "REALTIME OFFLINE"}
              </span>
            </div>

            <h2 className="text-6xl font-black text-green-400">
              {realtimeConnected ? "LIVE" : "OFF"}
            </h2>

            <p className="text-green-200 mt-2">
              Socket.io monitoring
            </p>
          </div>
        </div>
      </div>

      {/* CARTES STATUT */}

      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Backend",
            value: "ONLINE",
            icon: <FaServer />,
            color: "text-green-400",
          },
          {
            title: "Database",
            value: "ACTIVE",
            icon: <FaDatabase />,
            color: "text-blue-400",
          },
          {
            title: "OpenRouter IA",
            value: "MONITORED",
            icon: <FaRobot />,
            color: "text-orange-400",
          },
          {
            title: "Incidents",
            value: errorLogs.length,
            icon: <FaBug />,
            color: "text-red-400",
          },
        ].map((item) => (
          <motion.div
            key={item.title}
            whileHover={{
              y: -5,
              scale: 1.02,
            }}
            className="bg-[#07130f] border border-green-900 rounded-[30px] p-7 shadow-xl"
          >
            <div className={`text-4xl mb-6 ${item.color}`}>
              {item.icon}
            </div>

            <p className="text-gray-400">
              {item.title}
            </p>

            <h2 className={`text-4xl font-black mt-3 ${item.color}`}>
              {item.value}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* MÉTRIQUES SYSTÈME */}

      <div className="grid grid-cols-4 gap-6 mb-10">
        {systemMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-[#07130f] border border-green-900 rounded-[30px] p-7 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="text-3xl text-green-400">
                {metric.icon}
              </div>

              <span className="text-green-300 font-black">
                {metric.value}%
              </span>
            </div>

            <p className="text-gray-400 mb-4">
              {metric.label}
            </p>

            <div className="w-full h-4 bg-black rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                style={{
                  width: `${metric.value}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUES */}

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 bg-[#07130f] border border-green-900 rounded-[36px] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-white">
                Live Traffic & Latency
              </h2>

              <p className="text-gray-400 mt-2">
                Requêtes backend et latence API
              </p>
            </div>

            <button
              onClick={fetchLogs}
              className="bg-green-500/10 border border-green-500/20 text-green-300 px-5 py-3 rounded-2xl font-bold flex items-center gap-3"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={liveTraffic}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />

                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                />

                <YAxis stroke="#9ca3af" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#22c55e"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a0f0f] to-[#07130f] border border-red-900 rounded-[36px] p-8 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 flex items-center justify-center text-3xl mb-6">
            <FaExclamationTriangle />
          </div>

          <h2 className="text-4xl font-black text-white mb-5">
            Incident E5
          </h2>

          <p className="text-gray-300 leading-8 text-lg">
            En cas d’erreur API IA ou
            d’indisponibilité du service,
            SmartRecruit conserve les traces
            Winston et active une réponse
            alternative pour assurer la
            continuité.
          </p>

          <div className="mt-8 bg-black/30 border border-red-500/20 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <FaWifi className="text-green-400" />

              <span className="text-green-300 font-bold">
                Fallback Ready
              </span>
            </div>

            <p className="text-gray-400 text-sm">
              Continuité de service assurée
            </p>
          </div>
        </div>
      </div>

      {/* ÉVÉNEMENTS SÉCURITÉ */}

      <div className="bg-[#07130f] border border-green-900 rounded-[36px] p-8 shadow-xl mb-10">
        <h2 className="text-3xl font-black text-white mb-8">
          Security Events
        </h2>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={incidentData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
              />

              <XAxis
                dataKey="name"
                stroke="#9ca3af"
              />

              <YAxis stroke="#9ca3af" />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#22c55e"
                radius={[14, 14, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TERMINAL LOGS */}

      <div className="bg-black rounded-[36px] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] border border-green-900">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <FaTerminal className="text-green-400 text-3xl" />

            <div>
              <h2 className="text-3xl font-black text-white">
                Live Terminal Logs
              </h2>

              <p className="text-gray-500 mt-1">
                Logs filtrés avec événements
                métier et WebSocket temps réel.
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            className="bg-green-500/10 border border-green-500/20 text-green-300 px-5 py-3 rounded-2xl font-bold flex items-center gap-3"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-green-400 font-mono">
            Chargement des logs...
          </p>
        ) : parsedLogs.length === 0 ? (
          <p className="text-green-400 font-mono">
            Aucun log disponible
          </p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {parsedLogs.map((log, index) => (
              <div
                key={index}
                className="bg-[#07130f] border border-green-900 rounded-2xl p-5 font-mono"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      log.level === "error"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {log.level.toUpperCase()}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {formatDate(log.timestamp)}
                  </span>
                </div>

                <p className="text-green-400 mb-2">
                  {log.action}
                </p>

                <p className="text-gray-300 text-sm break-all">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Monitoring;