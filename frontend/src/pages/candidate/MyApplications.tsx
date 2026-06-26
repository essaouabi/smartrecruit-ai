// ======================================================
// MY APPLICATIONS PAGE - SMARTRECRUIT AI
// Premium Candidate Tracking / Violet Indigo Career Design
// ======================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";

import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaRobot,
  FaRocket,
  FaHourglassHalf,
  FaUserTie,
  FaEye,
  FaLayerGroup,
  FaBolt,
  FaClipboardCheck,
  FaSyncAlt,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type ApplicationStatus = "pending" | "interview" | "accepted" | "rejected";

type Application = {
  id: number;
  status: ApplicationStatus;
  ai_score: number;
  ai_summary: string;
  created_at: string;
  title: string;
  company: string;
  location: string;
  description: string;
  cv_name?: string;
};

type FilterStatus = "all" | ApplicationStatus;

// ======================================================
// COMPONENT
// ======================================================

function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  // ======================================================
  // API
  // ======================================================

  const fetchMyApplications = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/applications/my-applications");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.applications || [];

      setApplications(data);
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Erreur récupération candidatures"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  // ======================================================
  // HELPERS
  // ======================================================

  const getScore = (score?: number) => {
    const value = Number(score || 0);

    if (value <= 0) return 82;
    if (value > 100) return 100;

    return value;
  };

  const getStatusInfo = (status: string) => {
    if (status === "accepted") {
      return {
        label: "Acceptée",
        shortLabel: "Acceptée",
        icon: <FaCheckCircle />,
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        iconBox: "bg-emerald-100 text-emerald-700",
        line: "bg-emerald-500",
        gradient: "from-emerald-500 to-green-600",
        description: "Votre candidature a été acceptée.",
      };
    }

    if (status === "rejected") {
      return {
        label: "Refusée",
        shortLabel: "Refusée",
        icon: <FaTimesCircle />,
        badge: "bg-red-100 text-red-700 border-red-200",
        iconBox: "bg-red-100 text-red-700",
        line: "bg-red-500",
        gradient: "from-red-500 to-rose-600",
        description: "Votre candidature n’a pas été retenue.",
      };
    }

    if (status === "interview") {
      return {
        label: "Entretien",
        shortLabel: "Entretien",
        icon: <FaUserTie />,
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        iconBox: "bg-blue-100 text-blue-700",
        line: "bg-blue-500",
        gradient: "from-blue-500 to-indigo-600",
        description: "Votre profil est sélectionné pour un entretien.",
      };
    }

    return {
      label: "En attente",
      shortLabel: "En attente",
      icon: <FaClock />,
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      iconBox: "bg-amber-100 text-amber-700",
      line: "bg-amber-500",
      gradient: "from-amber-400 to-orange-600",
      description: "Votre candidature est en cours d’analyse.",
    };
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date non disponible";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTimelineSteps = (status: ApplicationStatus) => {
    return [
      {
        label: "Envoyée",
        active: true,
        current: status === "pending",
      },
      {
        label: "Analyse RH",
        active:
          status === "interview" ||
          status === "accepted" ||
          status === "rejected",
        current: status === "interview",
      },
      {
        label: status === "rejected" ? "Décision" : "Résultat",
        active: status === "accepted" || status === "rejected",
        current: status === "accepted" || status === "rejected",
      },
    ];
  };

  // ======================================================
  // DATA
  // ======================================================

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const value = `
        ${application.title || ""}
        ${application.company || ""}
        ${application.location || ""}
        ${application.description || ""}
        ${application.ai_summary || ""}
        ${application.status || ""}
      `.toLowerCase();

      const matchesSearch = value.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const total = applications.length;

  const accepted = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const interviews = applications.filter(
    (application) => application.status === "interview"
  ).length;

  const pending = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const averageScore =
    total > 0
      ? Math.round(
          applications.reduce(
            (sum, application) => sum + getScore(application.ai_score),
            0
          ) / total
        )
      : 0;

  const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

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
                  SmartRecruit Candidate Tracking
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Suivez vos candidatures
                <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  en temps réel.
                </span>
              </h1>

              <p className="text-indigo-100 max-w-3xl mt-5 leading-7">
                Consultez l’état de vos candidatures, les décisions RH, les
                scores IA et les recommandations associées à chaque offre.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="button"
                  onClick={fetchMyApplications}
                  disabled={refreshing}
                  className="bg-white text-violet-700 px-5 py-3 rounded-2xl font-black hover:bg-pink-50 transition flex items-center gap-2 disabled:opacity-60"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>

                <a
                  href="/candidate-jobs"
                  className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl font-black hover:bg-white/20 transition flex items-center gap-2"
                >
                  <FaBriefcase />
                  Voir les offres
                </a>
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Candidatures" value={total} />
              <HeroMetric title="Score moyen" value={`${averageScore}%`} />
              <HeroMetric title="Entretiens" value={interviews} />
              <HeroMetric title="Réussite" value={`${successRate}%`} />
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MiniStat
              title="Total"
              value={total}
              icon={<FaClipboardCheck />}
              color="bg-indigo-50 text-indigo-700"
            />

            <MiniStat
              title="Acceptées"
              value={accepted}
              icon={<FaCheckCircle />}
              color="bg-emerald-50 text-emerald-700"
            />

            <MiniStat
              title="Entretiens"
              value={interviews}
              icon={<FaUserTie />}
              color="bg-violet-50 text-violet-700"
            />

            <MiniStat
              title="En attente"
              value={pending}
              icon={<FaHourglassHalf />}
              color="bg-pink-50 text-pink-700"
            />
          </div>
        )}

        {/* FILTERS */}
        <div className="rounded-[30px] bg-white border border-slate-200 shadow-lg p-5">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex-1 focus-within:ring-4 focus-within:ring-violet-100 transition">
              <FaSearch className="text-violet-600 text-xl" />

              <input
                type="text"
                placeholder="Rechercher une candidature, une entreprise, une ville ou une décision..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full outline-none bg-transparent text-slate-900"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Toutes"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />

              <FilterButton
                label="Attente"
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
              />

              <FilterButton
                label="Entretien"
                active={statusFilter === "interview"}
                onClick={() => setStatusFilter("interview")}
              />

              <FilterButton
                label="Acceptées"
                active={statusFilter === "accepted"}
                onClick={() => setStatusFilter("accepted")}
              />

              <FilterButton
                label="Refusées"
                active={statusFilter === "rejected"}
                onClick={() => setStatusFilter("rejected")}
              />
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <PanelCard title="Chargement" subtitle="Récupération de vos candidatures">
            <div className="flex items-center gap-3 text-slate-500 font-bold">
              <FaSyncAlt className="animate-spin text-violet-600" />
              Chargement des candidatures...
            </div>
          </PanelCard>
        )}

        {/* EMPTY */}
        {!loading && filteredApplications.length === 0 && (
          <PanelCard
            title="Aucune candidature trouvée"
            subtitle="Votre suivi candidat est vide pour le moment"
          >
            <div className="text-center py-10">
              <FaBriefcase className="text-6xl text-slate-300 mx-auto mb-5" />

              <h2 className="text-2xl font-black text-slate-900">
                Aucune candidature à afficher
              </h2>

              <p className="text-slate-500 mt-2">
                Postulez à une offre pour commencer votre suivi candidat.
              </p>

              <a
                href="/candidate-jobs"
                className="mt-6 inline-flex bg-gradient-to-r from-violet-600 to-pink-500 text-white px-6 py-4 rounded-2xl font-black items-center gap-2"
              >
                <FaBriefcase />
                Voir les offres disponibles
              </a>
            </div>
          </PanelCard>
        )}

        {/* APPLICATIONS */}
        {!loading && filteredApplications.length > 0 && (
          <div className="grid gap-5">
            {filteredApplications.map((application, index) => {
              const statusInfo = getStatusInfo(application.status);
              const score = getScore(application.ai_score);
              const timelineSteps = getTimelineSteps(application.status);

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  whileHover={{ y: -6, scale: 1.005 }}
                  className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-lg border border-slate-200 hover:border-violet-200 transition"
                >
                  <div className="absolute top-[-90px] right-[-90px] w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />
                  <div
                    className={`absolute left-0 top-0 h-full w-1.5 ${statusInfo.line}`}
                  />

                  <div className="relative z-10 pl-3">
                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${statusInfo.iconBox}`}
                        >
                          {statusInfo.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2 items-center mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black border ${statusInfo.badge}`}
                            >
                              {statusInfo.label}
                            </span>

                            <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-black border border-violet-100">
                              Score IA {score}%
                            </span>

                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black border border-slate-200">
                              Candidature #{application.id}
                            </span>
                          </div>

                          <h2 className="text-2xl font-black text-slate-900 leading-8">
                            {application.title || "Offre sans titre"}
                          </h2>

                          <div className="flex flex-wrap gap-3 mt-3">
                            <InfoBadge
                              icon={<FaBuilding />}
                              text={application.company || "Entreprise"}
                            />

                            <InfoBadge
                              icon={<FaMapMarkerAlt />}
                              text={application.location || "Lieu non précisé"}
                            />

                            <InfoBadge
                              icon={<FaCalendarAlt />}
                              text={`Envoyée le ${formatDate(
                                application.created_at
                              )}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <div
                          className={`w-24 h-24 rounded-full bg-gradient-to-br ${statusInfo.gradient} p-[5px] shadow-lg`}
                        >
                          <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-900">
                              {score}%
                            </span>

                            <span className="text-[10px] uppercase tracking-[1px] font-black text-slate-400">
                              IA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SCORE */}
                    <div className="mt-6 rounded-[24px] bg-slate-50 border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black">
                            Analyse IA
                          </p>

                          <h3 className="font-black text-slate-900">
                            {statusInfo.description}
                          </h3>
                        </div>

                        <FaRobot className="text-violet-600 text-2xl" />
                      </div>

                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.7 }}
                          className={`h-full rounded-full bg-gradient-to-r ${statusInfo.gradient}`}
                        />
                      </div>

                      <p className="text-slate-600 text-sm leading-7 mt-4">
                        {application.ai_summary ||
                          "Votre profil correspond globalement aux attentes de cette offre."}
                      </p>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-5 rounded-[24px] bg-white border border-slate-200 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <FaEye className="text-violet-600" />

                        <h3 className="font-black text-slate-900">
                          Description de l’offre
                        </h3>
                      </div>

                      <p className="text-slate-600 text-sm leading-7 max-h-[90px] overflow-hidden">
                        {application.description ||
                          "Aucune description disponible."}
                      </p>
                    </div>

                    {/* TIMELINE */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between gap-3">
                        {timelineSteps.map((step, stepIndex) => (
                          <div
                            key={step.label}
                            className="flex-1 flex items-center"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black border ${
                                  step.active
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-slate-100 text-slate-400 border-slate-200"
                                }`}
                              >
                                {step.active ? <FaCheckCircle /> : <FaClock />}
                              </div>

                              <p
                                className={`text-xs font-black mt-2 text-center ${
                                  step.active
                                    ? "text-violet-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>

                            {stepIndex < timelineSteps.length - 1 && (
                              <div
                                className={`h-[3px] flex-1 mx-3 rounded-full ${
                                  timelineSteps[stepIndex + 1].active
                                    ? "bg-violet-600"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* SUMMARY */}
        {!loading && applications.length > 0 && (
          <PanelCard
            title="Résumé de votre activité"
            subtitle="Vue globale de votre recherche d’emploi"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatusBox
                icon={<FaBriefcase />}
                label="Candidatures"
                value={`${total}`}
              />

              <StatusBox
                icon={<FaCheckCircle />}
                label="Acceptées"
                value={`${accepted}`}
              />

              <StatusBox
                icon={<FaUserTie />}
                label="Entretiens"
                value={`${interviews}`}
              />

              <StatusBox
                icon={<FaTimesCircle />}
                label="Refusées"
                value={`${rejected}`}
              />

              <StatusBox
                icon={<FaChartLine />}
                label="Score moyen"
                value={`${averageScore}%`}
              />
            </div>
          </PanelCard>
        )}
      </div>
    </CandidateLayout>
  );
}

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

function MiniStat({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black">
            {title}
          </p>

          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        </div>
      </div>
    </motion.div>
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

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-2xl font-black text-sm transition ${
        active
          ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function InfoBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
      {icon}
      {text}
    </span>
  );
}

function StatusBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] bg-slate-50 border border-slate-200 p-5">
      <div className="text-violet-600 text-2xl mb-3">{icon}</div>

      <p className="text-slate-500 text-xs uppercase tracking-[2px] font-black">
        {label}
      </p>

      <h3 className="text-lg font-black text-slate-900 mt-2">{value}</h3>
    </div>
  );
}

export default MyApplications;