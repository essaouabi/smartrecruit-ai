import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaUsers,
  FaEnvelope,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserTie,
  FaSyncAlt,
  FaRobot,
  FaSearch,
  FaFilter,
  FaPaperPlane,
  FaEye,
  FaUserSecret,
  FaTrash,
  FaShieldAlt,
  FaLock,
  FaUndo,
  FaInfoCircle,
  FaUniversalAccess,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";

type ApplicationStatus = "pending" | "interview" | "accepted" | "rejected";

type Application = {
  id: number;

  candidate_id?: number;
  candidateId?: number;
  user_id?: number;

  status: ApplicationStatus;
  ai_score: number;
  ai_summary: string;
  created_at: string;

  fullname: string;
  email: string;

  title: string;
  company: string;
  location: string;
  cv_name?: string;

  is_anonymized?: boolean;
  anonymized_at?: string | null;
  deleted_at?: string | null;
};

type Feedback = {
  type: "success" | "error" | "info" | "warning";
  message: string;
};

const focusClass =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 focus-visible:ring-offset-2";

function Candidates() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rgpdFilter, setRgpdFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  const [rgpdLoadingId, setRgpdLoadingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showFeedback = (type: Feedback["type"], message: string) => {
    setFeedback({
      type,
      message,
    });
  };

  useEffect(() => {
    if (!feedback) return;

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/applications");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.applications || [];

      setApplications(data);

      showFeedback(
        "success",
        "Liste des candidatures actualisée avec succès."
      );
    } catch (error: any) {
      console.log(error);

      showFeedback(
        "error",
        error.response?.data?.message ||
          "Erreur lors de la récupération des candidatures."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    applicationId: number,
    status: ApplicationStatus
  ) => {
    try {
      setStatusLoadingId(applicationId);

      await api.patch(`/applications/${applicationId}/status`, {
        status,
      });

      setApplications((prev) =>
        prev.map((item) =>
          item.id === applicationId
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      showFeedback(
        "success",
        `Statut mis à jour : ${getStatusLabel(status)}.`
      );
    } catch (error: any) {
      console.log(error);

      showFeedback(
        "error",
        error.response?.data?.message ||
          "Erreur lors de la modification du statut."
      );
    } finally {
      setStatusLoadingId(null);
    }
  };

  const getCandidateRgpdId = (application: Application) => {
    const candidateId =
      application.candidate_id ||
      application.candidateId ||
      application.user_id ||
      application.id;

    return Number(candidateId) || null;
  };

  const isAnonymized = (application: Application) => {
    return (
      application.is_anonymized === true ||
      application.fullname?.toLowerCase().includes("anonymisé") ||
      application.email?.toLowerCase().includes("anonymized")
    );
  };

  const anonymizeCandidate = async (application: Application) => {
    const candidateId = getCandidateRgpdId(application);

    if (!candidateId) {
      showFeedback(
        "error",
        "ID candidat introuvable pour l’anonymisation."
      );
      return;
    }

    const confirmAction = window.confirm(
      `Voulez-vous anonymiser ce candidat ?\n\nNom : ${
        application.fullname || "Candidat"
      }\nEmail : ${
        application.email || "Non renseigné"
      }\n\nCette action masque les données personnelles conformément au RGPD.`
    );

    if (!confirmAction) return;

    try {
      setRgpdLoadingId(`anonymize-${application.id}`);

      const response = await api.patch(`/candidates/${candidateId}/anonymize`);

      const anonymizedCandidate = response.data?.candidate;

      setApplications((prev) =>
        prev.map((item) =>
          item.id === application.id
            ? {
                ...item,
                fullname:
                  anonymizedCandidate?.name ||
                  `Candidat anonymisé ${candidateId}`,
                email:
                  anonymizedCandidate?.email ||
                  `anonymized_${candidateId}@smartrecruit.local`,
                is_anonymized: true,
                anonymized_at:
                  anonymizedCandidate?.anonymized_at ||
                  new Date().toISOString(),
              }
            : item
        )
      );

      showFeedback(
        "success",
        response.data?.message ||
          "Candidat anonymisé avec succès. Les données personnelles sont maintenant masquées."
      );
    } catch (error: any) {
      console.log(error);

      showFeedback(
        "error",
        error.response?.data?.message ||
          "Erreur lors de l’anonymisation du candidat."
      );
    } finally {
      setRgpdLoadingId(null);
    }
  };

  const deleteCandidateRgpd = async (application: Application) => {
    const candidateId = getCandidateRgpdId(application);

    if (!candidateId) {
      showFeedback(
        "error",
        "ID candidat introuvable pour la suppression RGPD."
      );
      return;
    }

    const confirmAction = window.confirm(
      `Voulez-vous supprimer logiquement ce candidat ?\n\nNom : ${
        application.fullname || "Candidat"
      }\nEmail : ${
        application.email || "Non renseigné"
      }\n\nLa suppression sera logique : les données seront anonymisées et une trace technique sera conservée.`
    );

    if (!confirmAction) return;

    try {
      setRgpdLoadingId(`delete-${application.id}`);

      const response = await api.delete(`/candidates/${candidateId}`);

      setApplications((prev) =>
        prev.filter((item) => item.id !== application.id)
      );

      showFeedback(
        "success",
        response.data?.message ||
          "Candidat supprimé logiquement avec succès."
      );
    } catch (error: any) {
      console.log(error);

      showFeedback(
        "error",
        error.response?.data?.message ||
          "Erreur lors de la suppression RGPD du candidat."
      );
    } finally {
      setRgpdLoadingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRgpdFilter("all");
    setScoreFilter("all");

    showFeedback("info", "Filtres réinitialisés.");
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "accepted") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "interview") return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  };

  const getStatusLabel = (status: string) => {
    if (status === "accepted") return "Accepté";
    if (status === "rejected") return "Refusé";
    if (status === "interview") return "Entretien";

    return "En attente";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-400 to-green-600";
    if (score >= 60) return "from-blue-400 to-cyan-600";
    if (score >= 40) return "from-orange-400 to-red-500";

    return "from-red-500 to-rose-700";
  };

  const getDecisionLabel = (score: number) => {
    if (score >= 80) return "Profil prioritaire";
    if (score >= 60) return "Profil intéressant";
    if (score >= 40) return "À analyser";

    return "Faible correspondance";
  };

  const clampScore = (score: number) => {
    return Math.max(0, Math.min(100, score));
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchValue = search.toLowerCase().trim();
      const score = Number(application.ai_score || 0);
      const applicationIsAnonymized = isAnonymized(application);

      const matchesSearch =
        !searchValue ||
        application.fullname?.toLowerCase().includes(searchValue) ||
        application.email?.toLowerCase().includes(searchValue) ||
        application.title?.toLowerCase().includes(searchValue) ||
        application.company?.toLowerCase().includes(searchValue) ||
        application.location?.toLowerCase().includes(searchValue) ||
        application.cv_name?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      const matchesRgpd =
        rgpdFilter === "all" ||
        (rgpdFilter === "anonymized" && applicationIsAnonymized) ||
        (rgpdFilter === "not_anonymized" && !applicationIsAnonymized);

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "high" && score >= 80) ||
        (scoreFilter === "medium" && score >= 60 && score < 80) ||
        (scoreFilter === "low" && score < 60);

      return matchesSearch && matchesStatus && matchesRgpd && matchesScore;
    });
  }, [applications, search, statusFilter, rgpdFilter, scoreFilter]);

  const totalApplications = applications.length;

  const acceptedCount = applications.filter(
    (app) => app.status === "accepted"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "interview"
  ).length;

  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  const anonymizedCount = applications.filter((app) =>
    isAnonymized(app)
  ).length;

  const highScoreCount = applications.filter(
    (app) => Number(app.ai_score || 0) >= 80
  ).length;

  const averageScore =
    totalApplications > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + Number(app.ai_score || 0),
            0
          ) / totalApplications
        )
      : 0;

  const visibleAverageScore =
    filteredApplications.length > 0
      ? Math.round(
          filteredApplications.reduce(
            (sum, app) => sum + Number(app.ai_score || 0),
            0
          ) / filteredApplications.length
        )
      : 0;

  const feedbackStyle =
    feedback?.type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : feedback?.type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : feedback?.type === "warning"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <DashboardLayout>
      <a
        href="#main-candidates-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-emerald-600 focus:text-white focus:px-5 focus:py-3 focus:rounded-2xl focus:font-black"
      >
        Aller au contenu principal
      </a>

      <main
        id="main-candidates-content"
        role="main"
        aria-labelledby="candidates-page-title"
        className="space-y-6"
      >
        {feedback && (
          <div
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`rounded-2xl border px-5 py-4 font-bold shadow-sm flex items-center gap-3 ${feedbackStyle}`}
          >
            {feedback.type === "error" ? (
              <FaExclamationTriangle aria-hidden="true" />
            ) : (
              <FaInfoCircle aria-hidden="true" />
            )}

            <span>{feedback.message}</span>
          </div>
        )}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
          aria-labelledby="candidates-page-title"
        >
          <div
            className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-emerald-500/30 blur-3xl rounded-full"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[-90px] left-[-80px] w-96 h-96 bg-teal-600/20 blur-3xl rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-10 grid xl:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex bg-emerald-400/10 border border-emerald-400/20 text-emerald-200 px-4 py-2 rounded-full text-sm font-black">
                SmartRecruit AI Recruiter Hub
              </span>

              <h1
                id="candidates-page-title"
                className="text-5xl font-black mt-6 leading-tight"
              >
                Centre de recrutement intelligent.
              </h1>

              <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                Analysez les candidatures, priorisez les meilleurs profils,
                prenez des décisions RH avec l’intelligence artificielle et
                protégez les données personnelles avec une gestion RGPD.
              </p>

              <div className="flex gap-3 mt-6 flex-wrap">
                <button
                  type="button"
                  onClick={fetchApplications}
                  aria-label="Actualiser la liste des candidatures"
                  className={`bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-300 transition ${focusClass}`}
                >
                  <FaSyncAlt aria-hidden="true" />
                  Actualiser
                </button>

                <button
                  type="button"
                  aria-label="Voir la section des candidats"
                  onClick={() => {
                    document
                      .getElementById("candidates-list")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className={`bg-white/10 border border-white/10 px-5 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-white/15 transition ${focusClass}`}
                >
                  <FaEye aria-hidden="true" />
                  Voir candidats
                </button>

                <span className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl font-black flex items-center gap-2">
                  <FaShieldAlt
                    className="text-emerald-300"
                    aria-hidden="true"
                  />
                  RGPD activé
                </span>

                <span className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl font-black flex items-center gap-2">
                  <FaUniversalAccess
                    className="text-cyan-300"
                    aria-hidden="true"
                  />
                  Accessibilité C14
                </span>
              </div>
            </div>

            <aside
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-6"
              aria-label="Résumé qualité du recrutement"
            >
              <p className="text-slate-300 text-sm">
                Score qualité recrutement
              </p>

              <div className="flex items-end gap-2 mt-3">
                <span className="text-7xl font-black text-emerald-300">
                  {averageScore}
                </span>

                <span className="text-3xl font-black text-emerald-300 mb-2">
                  %
                </span>
              </div>

              <div
                className="h-3 bg-white/10 rounded-full mt-5 overflow-hidden"
                role="progressbar"
                aria-label="Score moyen de qualité recrutement"
                aria-valuenow={averageScore}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-emerald-300 rounded-full"
                  style={{
                    width: `${clampScore(averageScore)}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <MiniMetric label="Candidatures" value={totalApplications} />
                <MiniMetric label="Acceptées" value={acceptedCount} />
                <MiniMetric label="RGPD" value={anonymizedCount} />
              </div>
            </aside>
          </div>
        </motion.section>

        <section
          className="grid grid-cols-1 md:grid-cols-7 gap-5"
          aria-label="Statistiques des candidatures"
        >
          <StatCard
            title="Candidatures"
            value={totalApplications}
            icon={<FaUsers aria-hidden="true" />}
            gradient="from-emerald-500 to-teal-700"
          />

          <StatCard
            title="Acceptées"
            value={acceptedCount}
            icon={<FaCheckCircle aria-hidden="true" />}
            gradient="from-green-500 to-emerald-700"
          />

          <StatCard
            title="Entretiens"
            value={interviewCount}
            icon={<FaClock aria-hidden="true" />}
            gradient="from-cyan-500 to-blue-700"
          />

          <StatCard
            title="En attente"
            value={pendingCount}
            icon={<FaPaperPlane aria-hidden="true" />}
            gradient="from-amber-400 to-orange-600"
          />

          <StatCard
            title="Refusées"
            value={rejectedCount}
            icon={<FaTimesCircle aria-hidden="true" />}
            gradient="from-red-500 to-rose-700"
          />

          <StatCard
            title="RGPD"
            value={anonymizedCount}
            icon={<FaUserSecret aria-hidden="true" />}
            gradient="from-slate-700 to-slate-950"
          />

          <StatCard
            title="Scores forts"
            value={highScoreCount}
            icon={<FaChartLine aria-hidden="true" />}
            gradient="from-indigo-500 to-blue-800"
          />
        </section>

        <section
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-5 border border-slate-200 shadow-xl"
          aria-labelledby="filters-title"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2
                id="filters-title"
                className="text-xl font-black text-slate-900"
              >
                Recherche et filtres avancés
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredApplications.length} résultat(s) affiché(s) sur{" "}
                {totalApplications} candidature(s).
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              aria-label="Réinitialiser tous les filtres de recherche"
              className={`bg-slate-900 text-white px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 transition ${focusClass}`}
            >
              <FaUndo aria-hidden="true" />
              Réinitialiser
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaSearch className="text-slate-400" aria-hidden="true" />

              <label htmlFor="candidate-search" className="sr-only">
                Rechercher un candidat, une offre, une entreprise ou un CV
              </label>

              <input
                id="candidate-search"
                type="text"
                placeholder="Rechercher un candidat, une offre ou une entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`bg-transparent outline-none w-full ${focusClass}`}
                aria-label="Rechercher dans les candidatures"
              />
            </div>

            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaFilter className="text-slate-400" aria-hidden="true" />

              <label htmlFor="status-filter" className="sr-only">
                Filtrer par statut de candidature
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`bg-transparent outline-none w-full ${focusClass}`}
                aria-label="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="interview">Entretien</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaShieldAlt className="text-slate-400" aria-hidden="true" />

              <label htmlFor="rgpd-filter" className="sr-only">
                Filtrer par état RGPD
              </label>

              <select
                id="rgpd-filter"
                value={rgpdFilter}
                onChange={(e) => setRgpdFilter(e.target.value)}
                className={`bg-transparent outline-none w-full ${focusClass}`}
                aria-label="Filtrer par état RGPD"
              >
                <option value="all">Tous les états RGPD</option>
                <option value="anonymized">Anonymisés</option>
                <option value="not_anonymized">Non anonymisés</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaRobot className="text-slate-400" aria-hidden="true" />

              <label htmlFor="score-filter" className="sr-only">
                Filtrer par score IA
              </label>

              <select
                id="score-filter"
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className={`bg-transparent outline-none w-full ${focusClass}`}
                aria-label="Filtrer par score IA"
              >
                <option value="all">Tous les scores IA</option>
                <option value="high">Score fort : 80% et plus</option>
                <option value="medium">Score moyen : 60% à 79%</option>
                <option value="low">Score faible : moins de 60%</option>
              </select>
            </div>
          </div>
        </section>

        <section
          className="grid md:grid-cols-3 gap-5"
          aria-label="Résumé des résultats filtrés"
        >
          <SummaryCard
            icon={<FaSearch aria-hidden="true" />}
            title="Résultats affichés"
            value={filteredApplications.length}
            description="Candidatures visibles après application des filtres."
          />

          <SummaryCard
            icon={<FaRobot aria-hidden="true" />}
            title="Score moyen visible"
            value={`${visibleAverageScore}%`}
            description="Moyenne IA uniquement sur les résultats affichés."
          />

          <SummaryCard
            icon={<FaShieldAlt aria-hidden="true" />}
            title="Candidats protégés"
            value={anonymizedCount}
            description="Candidats anonymisés ou protégés par la gestion RGPD."
          />
        </section>

        {loading && (
          <section
            className="bg-white rounded-[32px] p-10 shadow-xl border text-center"
            role="status"
            aria-live="polite"
          >
            <FaRobot className="text-6xl text-emerald-600 mx-auto mb-4 animate-pulse" />

            <h2 className="text-2xl font-black">
              Chargement des candidatures...
            </h2>
          </section>
        )}

        {!loading && applications.length === 0 && (
          <section className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-black">
              Aucune candidature pour le moment
            </h2>

            <p className="text-gray-500 mt-2">
              Lorsqu’un candidat postule, sa candidature apparaîtra ici.
            </p>
          </section>
        )}

        {!loading &&
          applications.length > 0 &&
          filteredApplications.length === 0 && (
            <section className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
              <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />

              <h2 className="text-2xl font-black">
                Aucun résultat trouvé
              </h2>

              <p className="text-gray-500 mt-2">
                Essayez un autre mot-clé ou un autre filtre.
              </p>
            </section>
          )}

        <section
          id="candidates-list"
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 scroll-mt-8"
          aria-label="Liste des candidatures"
        >
          {filteredApplications.map((application, index) => {
            const score = Number(application.ai_score || 0);
            const safeScore = clampScore(score);
            const applicationIsAnonymized = isAnonymized(application);

            const displayName = applicationIsAnonymized
              ? application.fullname || "Candidat anonymisé"
              : application.fullname || "Candidat";

            const displayEmail = applicationIsAnonymized
              ? application.email || "Email anonymisé"
              : application.email || "Email non renseigné";

            const anonymizeLoading =
              rgpdLoadingId === `anonymize-${application.id}`;

            const deleteLoading =
              rgpdLoadingId === `delete-${application.id}`;

            const statusLoading = statusLoadingId === application.id;

            return (
              <motion.article
                key={application.id}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                className="relative overflow-hidden bg-white rounded-[36px] p-7 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300"
                aria-labelledby={`candidate-title-${application.id}`}
              >
                <div
                  className="absolute top-0 right-0 w-56 h-56 bg-emerald-400/10 blur-3xl rounded-full"
                  aria-hidden="true"
                />

                {applicationIsAnonymized && (
                  <div className="absolute top-5 right-5 z-20 bg-slate-950 text-emerald-300 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-lg">
                    <FaLock aria-hidden="true" />
                    RGPD anonymisé
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start gap-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-[24px] ${
                          applicationIsAnonymized
                            ? "bg-gradient-to-br from-slate-700 to-slate-950"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600"
                        } text-white flex items-center justify-center font-black text-2xl shadow-lg`}
                        aria-hidden="true"
                      >
                        {applicationIsAnonymized ? (
                          <FaUserSecret />
                        ) : (
                          displayName?.charAt(0) || "C"
                        )}
                      </div>

                      <div>
                        <h2
                          id={`candidate-title-${application.id}`}
                          className="text-2xl font-black text-[#052e2b] flex items-center gap-2"
                        >
                          <FaUserTie
                            className="text-emerald-600"
                            aria-hidden="true"
                          />
                          {displayName}
                        </h2>

                        <p className="text-gray-500 flex items-center gap-2 mt-2">
                          <FaEnvelope aria-hidden="true" />
                          <span>{displayEmail}</span>
                        </p>

                        <div
                          className="flex gap-2 mt-3 flex-wrap"
                          aria-label="Badges de la candidature"
                        >
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                            IA {score}%
                          </span>

                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black">
                            CV analysé
                          </span>

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                            {application.cv_name || "CV candidat"}
                          </span>

                          {applicationIsAnonymized && (
                            <span className="bg-slate-900 text-emerald-300 px-3 py-1 rounded-full text-xs font-black">
                              Données protégées
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-black ${getStatusBadge(
                        application.status
                      )}`}
                      aria-label={`Statut de candidature : ${getStatusLabel(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(application.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid lg:grid-cols-[1fr_120px] gap-5 items-center">
                    <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100">
                      <h3 className="font-black text-[#052e2b] flex items-center gap-2">
                        <FaBriefcase
                          className="text-blue-600"
                          aria-hidden="true"
                        />
                        {application.title || "Poste non renseigné"}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Entreprise :{" "}
                        {application.company || "Non renseignée"}
                      </p>

                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <FaMapMarkerAlt aria-hidden="true" />
                        {application.location || "Non renseignée"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div
                        className={`w-28 h-28 rounded-full bg-gradient-to-br ${getScoreGradient(
                          score
                        )} p-[5px] shadow-lg`}
                        role="progressbar"
                        aria-label={`Score IA du candidat ${displayName}`}
                        aria-valuenow={safeScore}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-slate-900">
                            {score}
                          </span>

                          <span className="text-xs font-black text-slate-500">
                            IA %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-700 flex items-center gap-2">
                        <FaRobot
                          className="text-emerald-600"
                          aria-hidden="true"
                        />
                        Correspondance IA
                      </span>

                      <span className="font-black text-emerald-700">
                        {getDecisionLabel(score)}
                      </span>
                    </div>

                    <div
                      className="h-3 bg-slate-200 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-label={`Barre de correspondance IA : ${safeScore}%`}
                      aria-valuenow={safeScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`h-full bg-gradient-to-r ${getScoreGradient(
                          score
                        )} rounded-full`}
                        style={{
                          width: `${safeScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-[28px] p-5">
                    <h4 className="font-black text-emerald-900 mb-2">
                      Analyse de l’IA SmartRecruit
                    </h4>

                    <p className="text-sm text-emerald-800 leading-7">
                      {application.ai_summary ||
                        "Aucune analyse IA disponible pour cette candidature."}
                    </p>
                  </div>

                  <div className="mt-5 bg-slate-950 border border-slate-800 rounded-[28px] p-5 text-white">
                    <h4 className="font-black flex items-center gap-2 mb-2">
                      <FaShieldAlt
                        className="text-emerald-300"
                        aria-hidden="true"
                      />
                      Protection RGPD
                    </h4>

                    <p className="text-sm text-slate-300 leading-7">
                      {applicationIsAnonymized
                        ? "Les données personnelles de ce candidat ont été anonymisées. Les informations sensibles sont masquées, mais les statistiques RH restent exploitables."
                        : "Ce candidat peut être anonymisé ou supprimé logiquement afin de protéger ses données personnelles en fin de processus ou à sa demande."}
                    </p>

                    {application.anonymized_at && (
                      <p className="text-xs text-emerald-300 mt-2 font-bold">
                        Anonymisé le{" "}
                        {new Date(application.anonymized_at).toLocaleString(
                          "fr-FR"
                        )}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-black">
                    <div className="rounded-2xl bg-emerald-50 text-emerald-700 py-3">
                      CV reçu
                    </div>

                    <div className="rounded-2xl bg-emerald-50 text-emerald-700 py-3">
                      IA analysée
                    </div>

                    <div
                      className={`rounded-2xl py-3 ${
                        application.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : application.status === "interview"
                          ? "bg-blue-100 text-blue-700"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {getStatusLabel(application.status)}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Date candidature
                      </p>

                      <p className="font-black text-gray-700">
                        {application.created_at
                          ? new Date(
                              application.created_at
                            ).toLocaleDateString("fr-FR")
                          : "Non renseignée"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6"
                    aria-label={`Actions de statut pour ${displayName}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "interview")
                      }
                      disabled={statusLoading}
                      aria-label={`Passer la candidature de ${displayName} au statut entretien`}
                      className={`bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${focusClass}`}
                    >
                      {statusLoading ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaClock aria-hidden="true" />
                      )}
                      Entretien
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "accepted")
                      }
                      disabled={statusLoading}
                      aria-label={`Accepter la candidature de ${displayName}`}
                      className={`bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${focusClass}`}
                    >
                      {statusLoading ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaCheckCircle aria-hidden="true" />
                      )}
                      Accepter
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "rejected")
                      }
                      disabled={statusLoading}
                      aria-label={`Refuser la candidature de ${displayName}`}
                      className={`bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${focusClass}`}
                    >
                      {statusLoading ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaTimesCircle aria-hidden="true" />
                      )}
                      Refuser
                    </button>
                  </div>

                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"
                    aria-label={`Actions RGPD pour ${displayName}`}
                  >
                    <button
                      type="button"
                      onClick={() => anonymizeCandidate(application)}
                      disabled={
                        applicationIsAnonymized ||
                        anonymizeLoading ||
                        deleteLoading
                      }
                      aria-label={
                        applicationIsAnonymized
                          ? `${displayName} est déjà anonymisé`
                          : `Anonymiser les données personnelles de ${displayName}`
                      }
                      className={`bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${focusClass}`}
                    >
                      {anonymizeLoading ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaUserSecret aria-hidden="true" />
                      )}
                      {applicationIsAnonymized
                        ? "Déjà anonymisé"
                        : "Anonymiser"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCandidateRgpd(application)}
                      disabled={anonymizeLoading || deleteLoading}
                      aria-label={`Supprimer logiquement et anonymiser la candidature de ${displayName}`}
                      className={`bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:hover:bg-rose-700 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 ${focusClass}`}
                    >
                      {deleteLoading ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaTrash aria-hidden="true" />
                      )}
                      Supprimer RGPD
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>
      </main>
    </DashboardLayout>
  );
}

type MiniMetricProps = {
  label: string;
  value: number;
};

function MiniMetric({ label, value }: MiniMetricProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-3">
      <h3 className="font-black text-xl">{value}</h3>

      <p className="text-xs text-slate-300">{label}</p>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string;
};

function StatCard({
  title,
  value,
  icon,
  gradient,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}
      aria-label={`${title} : ${value}`}
    >
      <div
        className="absolute top-[-40px] right-[-30px] w-32 h-32 bg-white/20 rounded-full blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="text-3xl mb-4 opacity-90">{icon}</div>

        <p className="text-white/80 text-sm font-bold">{title}</p>

        <h2 className="text-4xl font-black mt-1">{value}</h2>
      </div>
    </motion.div>
  );
}

type SummaryCardProps = {
  icon: ReactNode;
  title: string;
  value: number | string;
  description: string;
};

function SummaryCard({
  icon,
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-950 text-emerald-300 flex items-center justify-center text-2xl">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500 font-bold">{title}</p>

          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-4 leading-6">
        {description}
      </p>
    </div>
  );
}

export default Candidates;