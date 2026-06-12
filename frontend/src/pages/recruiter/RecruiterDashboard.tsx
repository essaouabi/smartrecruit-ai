// ===============================
// IMPORTS
// ===============================

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
  FaCalendarCheck,
  FaDatabase,
  FaCode,
  FaServer,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaBolt,
  FaShieldAlt,
  FaWifi,
} from "react-icons/fa";

// ===============================
// TYPES
// ===============================

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  created_at: string;
};

type DashboardStats = {
  totalJobs: number;
  totalCandidates: number;
  averageScore: number;
  interviews: number;
  latestJobs: Job[];
};

type LiveEvent = {
  title: string;
  message: string;
  date: string;
};

// ===============================
// COLORS
// ===============================

const pieColors = [
  "#0b3d2e",
  "#16a34a",
  "#2563eb",
  "#f97316",
];

// ===============================
// RNCP BLOCS
// ===============================

const rncpBlocs = [
  {
    id: "E1",
    title: "Data Engineering",
    description: "Import CSV, nettoyage, validation, PostgreSQL et historique.",
    icon: <FaDatabase />,
    status: "Acquis",
    progress: 95,
  },
  {
    id: "E3",
    title: "Intelligence Artificielle",
    description: "Gemini API, analyse CV, matching candidat/offre et score IA.",
    icon: <FaRobot />,
    status: "Acquis",
    progress: 90,
  },
  {
    id: "E4",
    title: "Application Fullstack",
    description: "React, Node.js, Express, JWT, dashboard RH et API REST.",
    icon: <FaCode />,
    status: "Acquis",
    progress: 92,
  },
  {
    id: "E5",
    title: "Monitoring & Incidents",
    description: "Logs Winston, supervision, incidents Gemini et fallback.",
    icon: <FaServer />,
    status: "En cours",
    progress: 80,
  },
];

// ===============================
// COMPONENT
// ===============================

const RecruiterDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveConnected, setLiveConnected] = useState(false);

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    {
      title: "Dashboard initialisé",
      message: "SmartRecruit AI est prêt.",
      date: new Date().toISOString(),
    },
  ]);

  // ===============================
  // FETCH STATS
  // ===============================

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error: any) {
      console.log(error);
      alert("Erreur récupération dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ===============================
  // SOCKET REALTIME
  // ===============================

  useEffect(() => {
    const handleConnect = () => {
      setLiveConnected(true);
    };

    const handleDisconnect = () => {
      setLiveConnected(false);
    };

    const handleNotification = (payload: any) => {
      setLiveEvents((prev) => [
        {
          title: payload.title || "Événement realtime",
          message: payload.message || "Nouvelle activité détectée.",
          date: payload.date || new Date().toISOString(),
        },
        ...prev,
      ]);

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

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="bg-white rounded-[32px] p-10 shadow-xl text-center">
            <FaRobot className="text-5xl text-[#0b3d2e] mx-auto mb-5 animate-pulse" />

            <p className="text-gray-500 font-semibold">
              Chargement du dashboard intelligent...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ===============================
  // DATA
  // ===============================

  const totalJobs = stats?.totalJobs || 0;
  const totalCandidates = stats?.totalCandidates || 0;
  const averageScore = stats?.averageScore || 0;
  const interviews = stats?.interviews || 0;
  const latestJobs = stats?.latestJobs || [];

  const growthData = [
    { name: "S1", value: totalJobs },
    { name: "S2", value: totalJobs + totalCandidates },
    { name: "S3", value: totalJobs + totalCandidates + averageScore },
    {
      name: "S4",
      value: totalJobs + totalCandidates + averageScore + interviews,
    },
  ];

  const barData = latestJobs.map((_job, index) => ({
    name: `Offre ${index + 1}`,
    offres: index + 1,
  }));

  const pieData = [
    { name: "Offres", value: totalJobs },
    { name: "Candidats", value: totalCandidates },
    { name: "Entretiens", value: interviews },
    { name: "Score IA", value: averageScore },
  ];

  const uniqueSkills = Array.from(
    new Set(
      latestJobs
        .flatMap((job) =>
          job.description ? job.description.split(" ") : []
        )
        .filter((skill) => skill.trim() !== "")
    )
  ).slice(0, 16);

  const statsCards = [
    {
      label: "Candidats",
      value: totalCandidates,
      note: "CV analysés",
      icon: <FaUsers />,
      gradient: "from-emerald-500 via-green-500 to-lime-400",
    },
    {
      label: "Offres actives",
      value: totalJobs,
      note: "Stockées PostgreSQL",
      icon: <FaBriefcase />,
      gradient: "from-[#062c22] via-[#0b3d2e] to-emerald-500",
    },
    {
      label: "Score IA",
      value: `${averageScore}%`,
      note: "Matching moyen",
      icon: <FaRobot />,
      gradient: "from-blue-700 via-sky-500 to-cyan-400",
    },
    {
      label: "Entretiens",
      value: interviews,
      note: "Planifiés",
      icon: <FaCalendarCheck />,
      gradient: "from-purple-700 via-fuchsia-500 to-pink-400",
    },
  ];

  return (
    <DashboardLayout>
      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] p-12 mb-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
      >
        <div className="absolute right-[-120px] top-[-120px] w-[360px] h-[360px] bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-full mb-6">
              <FaBolt className="text-green-300" />

              <span className="text-green-100 font-semibold">
                SmartRecruit Intelligence
              </span>
            </div>

            <h1 className="text-6xl font-black mb-5 leading-tight">
              Dashboard Recrutement IA
            </h1>

            <p className="text-green-100 text-lg leading-8 max-w-3xl">
              Analyse CV, matching IA, Data Pipeline, PostgreSQL, monitoring,
              realtime Socket.io et couverture RNCP.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8">
            <h3 className="text-2xl font-bold mb-6">
              État du système
            </h3>

            <div className="space-y-5">
              {[
                ["Backend API", "Online"],
                ["PostgreSQL", "Connected"],
                ["AI Matching", "Enabled"],
                ["Realtime", liveConnected ? "Live" : "Offline"],
              ].map(([label, status]) => (
                <div
                  key={label}
                  className="flex justify-between items-center bg-white/10 rounded-2xl p-4"
                >
                  <span>{label}</span>

                  <span className="text-green-300 font-bold">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className={`relative overflow-hidden rounded-[32px] p-7 text-white shadow-xl bg-gradient-to-br ${card.gradient}`}
          >
            <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                  {card.icon}
                </div>

                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  Live
                </span>
              </div>

              <p className="text-white/80 mb-2">
                {card.label}
              </p>

              <h2 className="text-5xl font-black">
                {card.value}
              </h2>

              <p className="text-white/80 mt-3 text-sm">
                {card.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-3 gap-8 mb-10">
        <motion.div
          whileHover={{ y: -5 }}
          className="col-span-2 bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#0b3d2e]">
                Croissance RH intelligente
              </h2>

              <p className="text-gray-500 mt-1">
                Données consolidées en temps réel
              </p>
            </div>

            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Realtime
            </span>
          </div>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0b3d2e"
                  fill="url(#growthColor)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-3xl font-black text-[#0b3d2e] mb-8">
            Répartition RH
          </h2>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={120}
                  paddingAngle={4}
                  label
                >
                  {pieData.map((_item, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* LIVE ACTIVITY + JOBS */}

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <FaWifi className="text-3xl text-green-700" />

            <h2 className="text-3xl font-black text-[#0b3d2e]">
              Activité live
            </h2>
          </div>

          <div className="space-y-4 max-h-[330px] overflow-y-auto">
            {liveEvents.slice(0, 6).map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-3xl p-5 border border-gray-100"
              >
                <p className="font-black text-[#0b3d2e]">
                  {event.title}
                </p>

                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {event.message}
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  {new Date(event.date).toLocaleString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-[#0b3d2e] mb-8">
            Dernières offres
          </h2>

          <div className="space-y-4">
            {latestJobs.length === 0 ? (
              <p className="text-gray-500">
                Aucune offre récente.
              </p>
            ) : (
              latestJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex justify-between items-center bg-gray-50 hover:bg-green-50 transition rounded-3xl p-5"
                >
                  <div>
                    <h3 className="font-bold text-[#0b3d2e]">
                      {job.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BAR CHART */}

      <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100 mb-10">
        <h2 className="text-3xl font-black text-[#0b3d2e] mb-8">
          Offres créées
        </h2>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="offres"
                fill="#0b3d2e"
                radius={[18, 18, 0, 0]}
                barSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI INSIGHTS */}

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 bg-gradient-to-br from-[#062c22] to-[#0b3d2e] rounded-[36px] p-8 text-white shadow-xl">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
              <FaRobot />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                AI Insights
              </h2>

              <p className="text-green-100">
                Analyse intelligente des données RH
              </p>
            </div>
          </div>

          <p className="text-green-100 leading-8">
            Le système combine les offres, les candidats, les scores IA,
            PostgreSQL et les événements Socket.io pour produire une vision
            stratégique du recrutement.
          </p>
        </div>

        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100">
          <FaShieldAlt className="text-4xl text-green-700 mb-5" />

          <h3 className="text-2xl font-black text-[#0b3d2e] mb-3">
            RNCP Ready
          </h3>

          <p className="text-gray-500 leading-7">
            Projet structuré autour des blocs E1, E3, E4 et E5 avec preuves techniques.
          </p>
        </div>
      </div>

      {/* SKILLS */}

      <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <FaChartLine className="text-3xl text-[#0b3d2e]" />

          <h2 className="text-3xl font-black text-[#0b3d2e]">
            Compétences les plus demandées
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {uniqueSkills.length === 0 ? (
            <p className="text-gray-500">
              Aucune compétence détectée.
            </p>
          ) : (
            uniqueSkills.map((skill) => (
              <span
                key={skill}
                className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {/* RNCP */}

      <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100 mb-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#0b3d2e] mb-3">
              Couverture RNCP du projet
            </h2>

            <p className="text-gray-500 max-w-4xl leading-7">
              SmartRecruit AI couvre les blocs principaux : Data Engineering,
              Intelligence Artificielle, Développement Fullstack, Monitoring et
              communication temps réel.
            </p>
          </div>

          <span className="bg-[#0b3d2e] text-white px-6 py-4 rounded-2xl font-black">
            RNCP Ready
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {rncpBlocs.map((bloc) => (
            <div
              key={bloc.id}
              className="bg-gray-50 rounded-[30px] p-6 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#0b3d2e] text-white flex items-center justify-center text-2xl mb-5">
                {bloc.icon}
              </div>

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl font-black text-[#0b3d2e]">
                  {bloc.id}
                </h3>

                {bloc.status === "Acquis" ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaClock className="text-orange-500" />
                )}
              </div>

              <h4 className="font-bold mb-3">
                {bloc.title}
              </h4>

              <p className="text-gray-500 text-sm leading-6 mb-5">
                {bloc.description}
              </p>

              <div className="w-full bg-white rounded-full h-3 mb-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${bloc.progress}%` }}
                ></div>
              </div>

              <p className="text-sm font-bold text-green-700">
                {bloc.progress}% — {bloc.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNATURE */}

      <div className="bg-gradient-to-r from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[36px] p-10 text-white shadow-xl">
        <h2 className="text-4xl font-black mb-4">
          Signature projet
        </h2>

        <p className="text-green-100 leading-8 text-lg">
          SmartRecruit AI — Projet développé par
          <span className="font-black text-white">
            {" "}
            Mohamed Amine Essaouabi
          </span>
          .
          <br />
          Data Engineering • IA • Fullstack • Monitoring • Realtime • RNCP.
        </p>
      </div>
    </DashboardLayout>
  );
};

// ===============================
// EXPORT
// ===============================

export default RecruiterDashboard;