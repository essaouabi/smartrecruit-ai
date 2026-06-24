// ======================================================
// DASHBOARD RECRUTEUR - SMARTRECRUIT AI
// Design SaaS Premium 2026
// ======================================================

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../services/api";
import socket from "../../services/socket";

import { motion } from "framer-motion";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  FaBriefcase,
  FaUsers,
  FaRobot,
  FaFileAlt,
  FaUserCheck,
  FaUserTimes,
  FaWifi,
  FaSyncAlt,
  FaDatabase,
  FaShieldAlt,
  FaCode,
  FaServer,
  FaBolt,
  FaClock,
  FaBell,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type Job = {
  id: number;
  title: string;
  description?: string;
  company?: string;
  location?: string;
};

type Candidate = {
  id: number;
  fullname?: string;
  name?: string;
  email?: string;
  score?: number;
  decision?: string;
};

type DashboardStatsData = {
  totalJobs: number;
  totalCandidates: number;
  totalAnalyses: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  acceptedCandidates: number;
  rejectedCandidates: number;
};

type DashboardResponse = {
  success: boolean;
  stats: DashboardStatsData;
  latestJobs: Job[];
  topCandidates: Candidate[];
  latestCandidates: Candidate[];
};

type LiveEvent = {
  title: string;
  message: string;
  date: string;
};

type NotificationItem = {
  id: number;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  entity?: string | null;
  entity_id?: number | null;
  is_read?: boolean;
  created_at: string;
};

// ======================================================
// CONSTANTES UI
// ======================================================

const decisionColors = ["#10b981", "#ef4444", "#2563eb"];

const rncpBlocs = [
  {
    id: "E1",
    title: "Data Engineering",
    icon: <FaDatabase />,
    progress: 95,
  },
  {
    id: "E2",
    title: "Service IA",
    icon: <FaRobot />,
    progress: 90,
  },
  {
    id: "E3",
    title: "Développement IA",
    icon: <FaCode />,
    progress: 92,
  },
  {
    id: "E4",
    title: "Full Stack",
    icon: <FaServer />,
    progress: 94,
  },
  {
    id: "E5",
    title: "DevOps",
    icon: <FaShieldAlt />,
    progress: 90,
  },
];

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

const RecruiterDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    {
      title: "Dashboard initialisé",
      message: "SmartRecruit AI est prêt à superviser les données RH.",
      date: new Date().toISOString(),
    },
  ]);

  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/dashboard/stats");
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la récupération du dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setNotifications(data);
    } catch (error) {
      console.log("Erreur récupération notifications :", error);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([fetchDashboardStats(), fetchNotifications()]);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    const handleConnect = () => setLiveConnected(true);
    const handleDisconnect = () => setLiveConnected(false);

    const handleNotification = (payload: any) => {
      setLiveEvents((prev) => [
        {
          title: payload.title || "Notification",
          message: payload.message || "Nouvelle activité détectée.",
          date: payload.date || new Date().toISOString(),
        },
        ...prev,
      ]);

      if (payload.data) {
        setNotifications((prev) => [
          {
            id: payload.data.id || Date.now(),
            type: payload.type || payload.data.type || "info",
            title: payload.title || payload.data.title || "Notification",
            message:
              payload.message ||
              payload.data.message ||
              "Nouvelle notification SmartRecruit.",
            entity: payload.data.entity || null,
            entity_id: payload.data.entity_id || null,
            is_read: false,
            created_at:
              payload.data.created_at ||
              payload.date ||
              new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      fetchDashboardStats();
    };

    const handleMonitoringLog = (payload: any) => {
      setLiveEvents((prev) => [
        {
          title: "Log backend",
          message: payload.message || "Nouvelle activité backend.",
          date: payload.date || new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("monitoring-log", handleMonitoringLog);

    if (socket.connected) {
      setLiveConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("monitoring-log", handleMonitoringLog);
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[420px] flex items-center justify-center">
          <div className="bg-white border border-slate-100 rounded-[32px] p-10 shadow-xl text-center">
            <FaRobot className="text-5xl text-emerald-700 mx-auto mb-4 animate-pulse" />

            <p className="text-slate-500 font-bold">
              Chargement du dashboard intelligent...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboard?.stats;

  const totalJobs = stats?.totalJobs || 0;
  const totalCandidates = stats?.totalCandidates || 0;
  const totalAnalyses = stats?.totalAnalyses || 0;
  const averageScore = stats?.averageScore || 0;
  const maxScore = stats?.maxScore || 0;
  const minScore = stats?.minScore || 0;
  const acceptedCandidates = stats?.acceptedCandidates || 0;
  const rejectedCandidates = stats?.rejectedCandidates || 0;

  const latestJobs = dashboard?.latestJobs || [];
  const topCandidates = dashboard?.topCandidates || [];
  const latestCandidates = dashboard?.latestCandidates || [];

  const pendingCandidates = Math.max(
    totalCandidates - acceptedCandidates - rejectedCandidates,
    0
  );

  const unreadNotifications = notifications.filter(
    (notification) => notification.is_read === false
  ).length;

  const decisionData = [
    { name: "Acceptés", value: acceptedCandidates },
    { name: "Refusés", value: rejectedCandidates },
    { name: "À revoir", value: pendingCandidates },
  ];

  const scoreData = [
    { name: "Min", score: minScore },
    { name: "Moyen", score: averageScore },
    { name: "Max", score: maxScore },
  ];

  const trendData = [
    { name: "Offres", value: totalJobs },
    { name: "Candidats", value: totalCandidates },
    { name: "Analyses", value: totalAnalyses },
    { name: "Acceptés", value: acceptedCandidates },
  ];

  const statsCards = [
    {
      label: "Candidats",
      value: totalCandidates,
      description: "Profils enregistrés",
      icon: <FaUsers />,
      iconBox: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Offres",
      value: totalJobs,
      description: "Offres publiées",
      icon: <FaBriefcase />,
      iconBox: "bg-blue-50 text-blue-700",
    },
    {
      label: "Analyses IA",
      value: totalAnalyses,
      description: "CV analysés",
      icon: <FaFileAlt />,
      iconBox: "bg-purple-50 text-purple-700",
    },
    {
      label: "Score moyen",
      value: `${averageScore}%`,
      description: "Matching moyen",
      icon: <FaRobot />,
      iconBox: "bg-orange-50 text-orange-700",
    },
  ];

  const miniStats = [
    {
      label: "Acceptés",
      value: acceptedCandidates,
      icon: <FaUserCheck />,
      color: "text-emerald-700",
    },
    {
      label: "Refusés",
      value: rejectedCandidates,
      icon: <FaUserTimes />,
      color: "text-red-700",
    },
    {
      label: "À revoir",
      value: pendingCandidates,
      icon: <FaClock />,
      color: "text-blue-700",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HERO PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] p-7 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <div className="absolute right-[-80px] top-[-80px] w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute left-[-70px] bottom-[-70px] w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-emerald-200 font-black text-sm mb-4 backdrop-blur-xl">
                <FaBolt />
                SmartRecruit Intelligence
              </div>

              <h1 className="text-4xl font-black mb-3">
                Tableau de bord recrutement IA
              </h1>

              <p className="text-emerald-100 max-w-3xl leading-7">
                Supervision complète des offres, candidats, analyses IA,
                décisions RH, monitoring, notifications persistantes et
                indicateurs RNCP en temps réel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-3 rounded-2xl border font-black flex items-center gap-2 backdrop-blur-xl ${
                  liveConnected
                    ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/20"
                    : "bg-orange-400/10 text-orange-200 border-orange-400/20"
                }`}
              >
                <FaWifi />
                {liveConnected ? "Realtime actif" : "Mode local"}
              </div>

              <button
                type="button"
                onClick={refreshAllData}
                className="bg-white text-[#064e3b] px-5 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-50 hover:scale-[1.02] transition-all shadow-xl"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                Actualiser
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI PRINCIPAUX */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {statsCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5 ${card.iconBox}`}
                >
                  {card.icon}
                </div>

                <p className="text-sm text-slate-500">{card.label}</p>

                <h2 className="text-4xl font-black text-slate-900 mt-1">
                  {card.value}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <p className="text-sm font-black text-slate-900 mb-3">
              Décisions IA
            </p>

            <div className="space-y-3">
              {miniStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-slate-50 rounded-[24px] p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={item.color}>{item.icon}</span>

                    <span className="text-sm font-bold text-slate-600">
                      {item.label}
                    </span>
                  </div>

                  <span className="font-black text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* NOTIFICATIONS PERSISTANTES */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FaBell />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Notifications persistantes
                </h2>

                <p className="text-sm text-slate-500">
                  Notifications sauvegardées dans PostgreSQL et envoyées en
                  temps réel.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-black">
                Total : {notifications.length}
              </span>

              <span className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-black">
                Non lues : {unreadNotifications}
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[260px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="bg-slate-50 rounded-[24px] p-5 text-center">
                <p className="text-slate-500 font-bold">
                  Aucune notification enregistrée pour le moment.
                </p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-[24px] p-4 border ${
                    notification.is_read
                      ? "bg-slate-50 border-slate-100"
                      : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-900">
                        {notification.title}
                      </h3>

                      <p className="text-sm text-slate-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.created_at).toLocaleString(
                          "fr-FR"
                        )}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        notification.type === "success"
                          ? "bg-emerald-100 text-emerald-700"
                          : notification.type === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all min-w-0">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Évolution des indicateurs RH
                </h2>

                <p className="text-sm text-slate-500">
                  Offres, candidats, analyses et validations IA.
                </p>
              </div>

              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                Live Data
              </span>
            </div>

            <div className="w-full h-[280px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="trendColor"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#064e3b"
                    fill="url(#trendColor)"
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all min-w-0">
            <h2 className="text-xl font-black text-slate-900">
              Répartition IA
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              Acceptés, refusés et profils à revoir.
            </p>

            <div className="w-full h-[280px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={5}
                    label
                  >
                    {decisionData.map((_item, index) => (
                      <Cell
                        key={index}
                        fill={decisionColors[index % decisionColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SCORE + LISTES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all min-w-0">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              Analyse des scores
            </h2>

            <p className="text-sm text-slate-500 mb-5">
              Score min, moyen et max.
            </p>

            <div className="w-full h-[245px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />

                  <Bar
                    dataKey="score"
                    fill="#064e3b"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Top candidats IA
            </h2>

            <div className="space-y-3">
              {topCandidates.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  Aucun candidat disponible.
                </p>
              ) : (
                topCandidates.slice(0, 5).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between bg-slate-50 rounded-[24px] p-4"
                  >
                    <div>
                      <h3 className="font-black text-slate-900">
                        {candidate.fullname || candidate.name || "Candidat"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {candidate.email || "Email non renseigné"}
                      </p>
                    </div>

                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black text-sm">
                      {candidate.score || 0}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <FaWifi className="text-emerald-700" />

              <h2 className="text-xl font-black text-slate-900">
                Activité live
              </h2>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {liveEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="bg-slate-50 rounded-[24px] p-4">
                  <p className="font-black text-slate-900">{event.title}</p>

                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {event.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(event.date).toLocaleString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OFFRES + ANALYSES */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Dernières offres
            </h2>

            <div className="space-y-3">
              {latestJobs.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucune offre récente.</p>
              ) : (
                latestJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex justify-between items-center bg-slate-50 rounded-[24px] p-4"
                  >
                    <div>
                      <h3 className="font-black text-slate-900">
                        {job.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {job.company || "Entreprise"} •{" "}
                        {job.location || "Localisation"}
                      </p>
                    </div>

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Dernières analyses IA
            </h2>

            <div className="space-y-3">
              {latestCandidates.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  Aucune analyse récente.
                </p>
              ) : (
                latestCandidates.slice(0, 5).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex justify-between items-center bg-slate-50 rounded-[24px] p-4"
                  >
                    <div>
                      <h3 className="font-black text-slate-900">
                        {candidate.fullname || candidate.name || "Candidat"}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Décision : {candidate.decision || "Non définie"}
                      </p>
                    </div>

                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-black">
                      {candidate.score || 0}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RNCP */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Couverture RNCP du projet
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Data Engineering, IA, Fullstack, Monitoring et DevOps.
              </p>
            </div>

            <span className="bg-[#064e3b] text-white px-4 py-2 rounded-xl text-sm font-black">
              RNCP Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {rncpBlocs.map((bloc) => (
              <div
                key={bloc.id}
                className="bg-slate-50 rounded-[24px] p-4 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="text-emerald-700 text-2xl mb-3">
                  {bloc.icon}
                </div>

                <h3 className="font-black text-slate-900">{bloc.id}</h3>

                <p className="text-sm text-slate-500 mb-3">{bloc.title}</p>

                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-emerald-600 rounded-full"
                    style={{
                      width: `${bloc.progress}%`,
                    }}
                  />
                </div>

                <p className="text-xs font-bold text-emerald-700 mt-2">
                  {bloc.progress}% validé
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;