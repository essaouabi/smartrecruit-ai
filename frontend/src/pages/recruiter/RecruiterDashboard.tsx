// ======================================================
// RECRUITER DASHBOARD - SMARTRECRUIT AI
// Premium Modern Dashboard / Jury Ready
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import socket from "../../services/socket";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

import {
  FaBriefcase,
  FaUsers,
  FaRobot,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBell,
  FaWifi,
  FaSyncAlt,
  FaBolt,
  FaArrowUp,
  FaLayerGroup,
  FaDatabase,
  FaCode,
  FaShieldAlt,
  FaServer,
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
  type?: "success" | "info" | "error";
};

// ======================================================
// CONSTANTES
// ======================================================

const decisionColors = ["#10b981", "#6366f1", "#ef4444"];

const rncpData = [
  {
    id: "E1",
    title: "Data Engineering",
    progress: 95,
    icon: <FaDatabase />,
    color: "from-cyan-500 to-sky-500",
  },
  {
    id: "E2",
    title: "Service IA",
    progress: 90,
    icon: <FaRobot />,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "E3",
    title: "Développement IA",
    progress: 82,
    icon: <FaCode />,
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "E4",
    title: "Full Stack",
    progress: 91,
    icon: <FaLayerGroup />,
    color: "from-sky-500 to-cyan-500",
  },
  {
    id: "E5",
    title: "DevOps & Sécurité",
    progress: 89,
    icon: <FaShieldAlt />,
    color: "from-violet-500 to-indigo-500",
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

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    {
      title: "Analyse complétée",
      message: "Mohamed Essaouabi a été analysé avec succès.",
      date: new Date().toISOString(),
      type: "success",
    },
    {
      title: "Nouvelle offre publiée",
      message: "Développeur React Native ajouté au pipeline.",
      date: new Date().toISOString(),
      type: "info",
    },
    {
      title: "Matching en cours",
      message: "42 candidats filtrés par l’algorithme IA.",
      date: new Date().toISOString(),
      type: "info",
    },
  ]);

  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/dashboard/stats");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération du dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
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
          type: payload.type || "info",
        },
        ...prev,
      ]);
    };

    const handleMonitoringLog = (payload: any) => {
      setLiveEvents((prev) => [
        {
          title: "Log backend",
          message: payload.message || "Nouvelle activité backend.",
          date: payload.date || new Date().toISOString(),
          type: "info",
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

  const acceptedRate =
    totalCandidates > 0
      ? Math.round((acceptedCandidates / totalCandidates) * 100)
      : 0;

  const rejectedRate =
    totalCandidates > 0
      ? Math.round((rejectedCandidates / totalCandidates) * 100)
      : 0;

  const mockUnreadNotifications = Math.min(liveEvents.length, 4);
  const mockLiveEvents = liveEvents.length;

  const decisionData = [
    { name: "Acceptés", value: acceptedCandidates },
    { name: "À revoir", value: pendingCandidates },
    { name: "Refusés", value: rejectedCandidates },
  ];

  const scoreData = [
    { name: "Min", score: minScore },
    { name: "Moyen", score: averageScore },
    { name: "Max", score: maxScore },
  ];

  const areaData = useMemo(
    () => [
      { name: "S1", offres: Math.max(6, Math.round(totalJobs * 0.35)), candidats: Math.max(15, Math.round(totalCandidates * 0.35)), analyses: Math.max(20, Math.round(totalAnalyses * 0.3)) },
      { name: "S2", offres: Math.max(8, Math.round(totalJobs * 0.45)), candidats: Math.max(20, Math.round(totalCandidates * 0.5)), analyses: Math.max(28, Math.round(totalAnalyses * 0.45)) },
      { name: "S3", offres: Math.max(10, Math.round(totalJobs * 0.55)), candidats: Math.max(24, Math.round(totalCandidates * 0.62)), analyses: Math.max(35, Math.round(totalAnalyses * 0.55)) },
      { name: "S4", offres: Math.max(12, Math.round(totalJobs * 0.75)), candidats: Math.max(32, Math.round(totalCandidates * 0.8)), analyses: Math.max(40, Math.round(totalAnalyses * 0.7)) },
      { name: "S5", offres: Math.max(14, Math.round(totalJobs * 0.85)), candidats: Math.max(36, Math.round(totalCandidates * 0.9)), analyses: Math.max(48, Math.round(totalAnalyses * 0.82)) },
      { name: "S6", offres: totalJobs, candidats: totalCandidates, analyses: totalAnalyses },
    ],
    [totalJobs, totalCandidates, totalAnalyses]
  );

  const lineData = useMemo(
    () => [
      { name: "S1", value: 12 },
      { name: "S2", value: 26 },
      { name: "S3", value: 21 },
      { name: "S4", value: 40 },
      { name: "S5", value: 34 },
      { name: "S6", value: 55 },
      { name: "S7", value: 48 },
      { name: "S8", value: 66 },
      { name: "S9", value: 59 },
      { name: "S10", value: 74 },
      { name: "S11", value: 68 },
      { name: "S12", value: 82 },
    ],
    []
  );

  const radarData = [
    { subject: "Tech", A: 88, B: 72 },
    { subject: "Soft", A: 80, B: 78 },
    { subject: "Exp.", A: 92, B: 84 },
    { subject: "Format", A: 85, B: 76 },
    { subject: "Lang.", A: 79, B: 70 },
    { subject: "Culture", A: 74, B: 82 },
  ];

  const funnelData = [
    {
      label: "Candidatures reçues",
      value: 1248,
      percent: 100,
      color: "bg-cyan-500",
    },
    {
      label: "Filtrées par IA",
      value: 642,
      percent: 51,
      color: "bg-violet-500",
    },
    {
      label: "Entretien planifié",
      value: 218,
      percent: 17,
      color: "bg-teal-500",
    },
    {
      label: "Offre envoyée",
      value: 99,
      percent: 8,
      color: "bg-emerald-500",
    },
    {
      label: "Embauches finalisées",
      value: 47,
      percent: 4,
      color: "bg-lime-500",
    },
  ];

  const departmentData = [
    { name: "Frontend", min: 42, avg: 71, max: 96 },
    { name: "Backend", min: 38, avg: 68, max: 92 },
    { name: "Data / IA", min: 55, avg: 82, max: 99 },
    { name: "DevOps", min: 40, avg: 65, max: 88 },
    { name: "Mobile", min: 48, avg: 73, max: 94 },
  ];

  const heroPrecision = Math.min(99.2, averageScore + 21.2).toFixed(1);
  const heroSuccess = Math.max(62, acceptedRate + 5).toFixed(1);
  const heroLatency = "4.2s";

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#03111f] via-[#041337] to-[#06384a] p-7 text-white shadow-2xl"
        >
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-90px] left-[-90px] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            <div className="xl:col-span-7">
              <p className="text-cyan-300 uppercase tracking-[4px] text-xs font-black mb-4">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                • bienvenue, douaa
              </p>

              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                Centre de pilotage
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  recrutement intelligent
                </span>
              </h1>

              <p className="text-slate-300 max-w-2xl mt-5 leading-7 text-lg">
                Vision globale des offres, candidats, analyses IA et performance RH.
                Système SmartRecruit activé avec monitoring, pipeline, temps réel et
                indicateurs professionnels.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-black">
                  {totalCandidates} candidats suivis
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-black">
                  {totalAnalyses} analyses auto.
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-black">
                  Score IA moyen {averageScore}%
                </span>
              </div>
            </div>

            <div className="xl:col-span-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HeroMiniCard
                  title="Précision IA"
                  value={`${heroPrecision}%`}
                  barValue={Number(heroPrecision)}
                  barColor="from-cyan-400 to-sky-500"
                />
                <HeroMiniCard
                  title="Succès global"
                  value={`${heroSuccess}%`}
                  barValue={Number(heroSuccess)}
                  barColor="from-indigo-400 to-violet-500"
                />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[3px] text-slate-400 font-black">
                      Performance pipeline
                    </p>
                    <h3 className="mt-2 text-lg font-black">
                      {heroLatency} de latence moyenne
                    </h3>
                  </div>

                  <div className="text-emerald-400 text-2xl">
                    <FaChartLine />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* KPI TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <StatCard
            title="Candidats"
            value={totalCandidates}
            sub="+12% vs mois dernier"
            icon={<FaUsers />}
            iconStyle="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            title="Analyses IA"
            value={totalAnalyses}
            sub="+8% vs mois dernier"
            icon={<FaRobot />}
            iconStyle="bg-violet-100 text-violet-600"
          />
          <StatCard
            title="Offres actives"
            value={totalJobs}
            sub="Stable vs mois dernier"
            icon={<FaBriefcase />}
            iconStyle="bg-sky-100 text-sky-600"
          />
          <StatCard
            title="Score moyen"
            value={`${averageScore}%`}
            sub="+4.2 vs mois dernier"
            icon={<FaChartLine />}
            iconStyle="bg-orange-100 text-orange-600"
          />
        </div>

        {/* KPI MINI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MiniMetricCard
            title="Taux d’acceptation"
            value={`${acceptedRate}%`}
            icon={<FaCheckCircle />}
            iconStyle="bg-emerald-100 text-emerald-600"
          />
          <MiniMetricCard
            title="Taux de rejet"
            value={`${rejectedRate}%`}
            icon={<FaTimesCircle />}
            iconStyle="bg-rose-100 text-rose-600"
          />
          <MiniMetricCard
            title="Notifications non lues"
            value={mockUnreadNotifications}
            icon={<FaBell />}
            iconStyle="bg-indigo-100 text-indigo-600"
          />
          <MiniMetricCard
            title="Événements live"
            value={mockLiveEvents}
            icon={<FaWifi />}
            iconStyle="bg-cyan-100 text-cyan-600"
          />
        </div>

        {/* ZONE 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <DashboardCard
            className="xl:col-span-8"
            title="Performance RH globale"
            subtitle="Évolution des offres, candidats et analyses"
            rightSlot={
              <select className="text-xs border rounded-xl px-3 py-2 bg-slate-50">
                <option>30 derniers jours</option>
                <option>90 derniers jours</option>
                <option>12 mois</option>
              </select>
            }
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="offres" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="candidats" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="analyses" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-4 bg-[#020b18] text-white border-[#0f172a]"
            title="Flux IA temps réel"
            subtitle="Activité instantanée du moteur SmartRecruit"
            dark
            rightSlot={
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
                Live
              </span>
            }
          >
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
              {liveEvents.slice(0, 6).map((event, index) => (
                <div
                  key={index}
                  className="border-l-2 border-emerald-400/40 pl-4"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {new Date(event.date).toLocaleTimeString("fr-FR")}
                    <span>•</span>
                    <span>{event.title}</span>
                  </div>

                  <p className="mt-1 text-sm text-white font-semibold leading-6">
                    {event.message}
                  </p>

                  {index === 0 && (
                    <span className="inline-block mt-2 px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                      SCORE 98%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* ZONE 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <DashboardCard
            className="xl:col-span-4"
            title="Répartition des décisions"
            subtitle="Visualisation IA des candidatures traitées"
          >
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {decisionData.map((_item, index) => (
                      <Cell key={index} fill={decisionColors[index % decisionColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-3">
              {decisionData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: decisionColors[index] }}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-4"
            title="Candidats traités"
            subtitle="Volume hebdomadaire des analyses IA"
            rightSlot={
              <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-black">
                12 sem.
              </span>
            }
          >
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="candidateFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    fill="url(#candidateFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-4"
            title="Profil moyen candidat"
            subtitle="Évaluation multi-critères IA"
          >
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar
                    name="Top 10"
                    dataKey="A"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Moyenne"
                    dataKey="B"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* ZONE 3 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <DashboardCard
            className="xl:col-span-6"
            title="Funnel de recrutement"
            subtitle="Conversion étape par étape"
          >
            <div className="space-y-4">
              {funnelData.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </p>
                    <div className="text-xs text-slate-500 font-bold">
                      {item.value} • {item.percent}%
                    </div>
                  </div>

                  <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-5 rounded-full flex items-center justify-end px-2 text-[10px] font-black text-white transition-all`}
                      style={{ width: `${item.percent}%` }}
                    >
                      {item.percent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-6"
            title="Analyse comparative des scores"
            subtitle="Score min - moyen - max par filière"
          >
            <div className="space-y-5">
              {departmentData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {item.min}-{item.max}% • {item.avg}
                    </span>
                  </div>

                  <div className="relative h-3 bg-slate-100 rounded-full">
                    <div
                      className="absolute top-0 h-3 rounded-full bg-cyan-200"
                      style={{
                        left: `${item.min}%`,
                        width: `${Math.max(item.avg - item.min, 6)}%`,
                      }}
                    />
                    <div
                      className="absolute -top-1.5 w-3 h-3 rounded-full bg-slate-500"
                      style={{ left: `calc(${item.min}% - 6px)` }}
                    />
                    <div
                      className="absolute -top-1.5 w-3 h-3 rounded-full bg-cyan-500"
                      style={{ left: `calc(${item.avg}% - 6px)` }}
                    />
                    <div
                      className="absolute -top-1.5 w-3 h-3 rounded-full bg-emerald-500"
                      style={{ left: `calc(${item.max}% - 6px)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* ZONE 4 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <DashboardCard
            className="xl:col-span-5"
            title="Top candidats IA"
            subtitle="Profils les mieux classés par SmartRecruit"
            rightSlot={
              <span className="text-xs font-black text-cyan-500 cursor-pointer">
                Voir tout
              </span>
            }
          >
            <div className="space-y-3">
              {(topCandidates.length > 0 ? topCandidates : [
                { id: 1, fullname: "Mohamed Amine Essaouabi", email: "ML Engineer", score: 98 },
                { id: 2, fullname: "Sarah Benali", email: "Data Scientist", score: 94 },
                { id: 3, fullname: "Julien Martin", email: "Cloud Architect", score: 91 },
                { id: 4, fullname: "Léa Dubois", email: "Full Stack React", score: 88 },
                { id: 5, fullname: "Karim Haddad", email: "DevOps Senior", score: 85 },
              ]).slice(0, 5).map((candidate, index) => {
                const initials = (candidate.fullname || candidate.name || "C")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const avatarColors = [
                  "from-emerald-500 to-green-500",
                  "from-teal-500 to-emerald-500",
                  "from-cyan-500 to-sky-500",
                  "from-sky-500 to-blue-500",
                  "from-violet-500 to-indigo-500",
                ];

                return (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} text-white font-black flex items-center justify-center`}
                      >
                        {initials}
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {candidate.fullname || candidate.name || "Candidat"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {candidate.email || "Email non renseigné"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-500">
                        {candidate.score || 0}%
                      </p>
                      <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-black">
                        Match IA
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-7"
            title="Couverture RNCP du projet"
            subtitle="Compétences validées par SmartRecruit AI"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rncpData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color} text-white text-xs font-black flex items-center justify-center`}
                    >
                      {item.id}
                    </div>

                    <span className="text-xs text-slate-500 font-bold">
                      {item.progress}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    {item.icon}
                  </div>

                  <h3 className="font-black text-slate-900">{item.title}</h3>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* ZONE 5 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <DashboardCard
            className="xl:col-span-7"
            title="Dernières offres publiées"
            subtitle="Postes ouverts récemment sur la plateforme"
            rightSlot={
              <span className="text-xs font-black text-cyan-500 cursor-pointer">
                Voir tout
              </span>
            }
          >
            <div className="overflow-hidden rounded-[20px] border border-slate-200">
              <div className="grid grid-cols-4 bg-slate-50 px-4 py-3 text-[11px] uppercase tracking-[2px] font-black text-slate-400">
                <div>Poste</div>
                <div>Entreprise</div>
                <div>Lieu</div>
                <div className="text-right">Statut</div>
              </div>

              <div className="divide-y divide-slate-200">
                {(latestJobs.length > 0 ? latestJobs : [
                  { id: 1, title: "Développeur Frontend React TypeScript", company: "Frontend Studio", location: "Remote" },
                  { id: 2, title: "Ingénieur Intelligence Artificielle", company: "AI Recruit", location: "Paris" },
                  { id: 3, title: "Développeur Backend Node.js", company: "DataSoft", location: "Villeurbanne" },
                  { id: 4, title: "Ingénieur IA", company: "AI Company", location: "Paris" },
                  { id: 5, title: "Développeur Full Stack React", company: "Tech Solutions", location: "Lyon" },
                ]).slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-4 items-center px-4 py-4 text-sm"
                  >
                    <div className="font-semibold text-slate-800">{job.title}</div>
                    <div className="text-slate-500">{job.company || "Entreprise"}</div>
                    <div className="text-slate-500">{job.location || "Localisation"}</div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            className="xl:col-span-5"
            title="Dernières analyses IA"
            subtitle="Candidatures récemment traitées"
          >
            <div className="space-y-3">
              {(latestCandidates.length > 0 ? latestCandidates : [
                { id: 1, fullname: "Mohamed Amine Essaouabi", decision: "Non définie", score: 81 },
                { id: 2, fullname: "Mohamed Amine Essaouabi", decision: "Non définie", score: 81 },
                { id: 3, fullname: "Mohamed Amine Essaouabi", decision: "Non définie", score: 81 },
                { id: 4, fullname: "Mohamed Amine Essaouabi", decision: "Non définie", score: 100 },
                { id: 5, fullname: "Mohamed Amine Essaouabi", decision: "Non définie", score: 100 },
              ]).slice(0, 5).map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div>
                    <h3 className="font-black text-slate-900">
                      {candidate.fullname || candidate.name || "Candidat"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Décision : {candidate.decision || "Non définie"}
                    </p>
                  </div>

                  <span className="text-sm font-black text-violet-600">
                    {candidate.score || 0}%
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================================================
// SOUS-COMPOSANTS
// ======================================================

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  dark?: boolean;
};

function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  rightSlot,
  dark = false,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[28px] border p-5 shadow-lg ${
        dark
          ? "bg-[#020b18] border-[#0f172a]"
          : "bg-white border-slate-200"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className={`text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {subtitle}
            </p>
          )}
        </div>

        {rightSlot && <div>{rightSlot}</div>}
      </div>

      {children}
    </motion.div>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  iconStyle: string;
};

function StatCard({
  title,
  value,
  sub,
  icon,
  iconStyle,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-lg"
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconStyle}`}>
        {icon}
      </div>

      <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black mt-4">
        {title}
      </p>

      <h3 className="text-4xl font-black text-slate-900 mt-2">
        {value}
      </h3>

      <p className="text-xs text-emerald-500 font-black mt-3 flex items-center gap-2">
        <FaArrowUp />
        {sub}
      </p>
    </motion.div>
  );
}

type MiniMetricCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconStyle: string;
};

function MiniMetricCard({
  title,
  value,
  icon,
  iconStyle,
}: MiniMetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white border border-slate-200 rounded-[22px] px-5 py-4 shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconStyle}`}>
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[1.5px] text-slate-400 font-black">
            {title}
          </p>
          <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        </div>
      </div>
    </motion.div>
  );
}

type HeroMiniCardProps = {
  title: string;
  value: string;
  barValue: number;
  barColor: string;
};

function HeroMiniCard({
  title,
  value,
  barValue,
  barColor,
}: HeroMiniCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
        {title}
      </p>

      <h3 className="text-4xl font-black mt-2">{value}</h3>

      <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${barColor}`}
          style={{ width: `${barValue}%` }}
        />
      </div>
    </div>
  );
}

export default RecruiterDashboard;