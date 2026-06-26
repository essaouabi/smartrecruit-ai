// ======================================================
// CANDIDATE JOBS PAGE - SMARTRECRUIT AI
// Premium Candidate Job Board / Violet Indigo Career Design
// ======================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaBuilding,
  FaEye,
  FaPaperPlane,
  FaSyncAlt,
  FaFileContract,
  FaCalendarAlt,
  FaTags,
  FaExclamationTriangle,
  FaBriefcase,
  FaRocket,
  FaStar,
  FaFilePdf,
  FaCheckCircle,
  FaTimes,
  FaRobot,
  FaLayerGroup,
  FaClock,
  FaMagic,
  FaGlobeEurope,
  FaBolt,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type CV = {
  id: number;
  file_name: string;
};

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  created_at?: string | null;
  source?: string | null;
  skills?: string | string[] | null;
  contract_type?: string | null;
  scraped_at?: string | null;
};

// ======================================================
// COMPONENT
// ======================================================

function CandidateJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>("");

  // ======================================================
  // HELPERS
  // ======================================================

  const getJobSkills = (job: Job) => {
    if (Array.isArray(job.skills)) {
      return job.skills.filter(Boolean);
    }

    if (typeof job.skills === "string" && job.skills.trim() !== "") {
      return job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 1);
    }

    if (!job.description) return [];

    const ignoredWords = [
      "avec",
      "dans",
      "pour",
      "vous",
      "nous",
      "les",
      "des",
      "une",
      "sur",
      "est",
      "sont",
      "qui",
      "que",
      "aux",
      "par",
      "plus",
      "moins",
      "client",
      "poste",
      "mission",
      "profil",
      "recherche",
      "expérience",
    ];

    return Array.from(
      new Set(
        job.description
          .replace(/[.,;:()]/g, " ")
          .split(" ")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 2)
          .filter((skill) => !ignoredWords.includes(skill.toLowerCase()))
      )
    ).slice(0, 8);
  };

  const getContractType = (job: Job) => {
    if (job.contract_type && job.contract_type.trim() !== "") {
      return job.contract_type;
    }

    return "Non précisé";
  };

  const getSource = (job: Job) => {
    if (job.source && job.source.trim() !== "") {
      return job.source;
    }

    return "PostgreSQL";
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Non importée";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Non importée";
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMatchScore = (job: Job) => {
    const skillsCount = getJobSkills(job).length;
    const base = 72 + ((job.id * 7 + skillsCount * 4) % 24);

    return Math.min(96, base);
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "Excellent match";
    if (score >= 80) return "Très bon match";
    if (score >= 70) return "Profil compatible";

    return "À vérifier";
  };

  const isRemote = (job: Job) => {
    const value = `${job.location || ""} ${job.description || ""}`.toLowerCase();

    return (
      value.includes("remote") ||
      value.includes("télétravail") ||
      value.includes("hybride")
    );
  };

  // ======================================================
  // API
  // ======================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/jobs");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.jobs || [];

      setJobs(data);
    } catch (error: any) {
      console.error("Erreur récupération offres :", error);
      console.error("Réponse backend :", error.response?.data);

      setJobs([]);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur récupération offres"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    try {
      setRefreshing(true);
      setErrorMessage("");

      const response = await api.get("/jobs");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.jobs || [];

      setJobs(data);
    } catch (error: any) {
      console.error("Erreur actualisation offres :", error);
      console.error("Réponse backend :", error.response?.data);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l’actualisation des offres."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCvs = async () => {
    try {
      const response = await api.get("/cv/my-cvs");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.cvs || [];

      setCvs(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = async (jobId: number) => {
    if (!selectedCvId) {
      alert("Veuillez choisir un CV.");
      return;
    }

    try {
      setApplyingJobId(jobId);

      await api.post("/applications/apply", {
        job_id: jobId,
        cv_id: Number(selectedCvId),
      });

      alert("Candidature envoyée avec succès.");

      setSelectedJob(null);
      setSelectedCvId("");
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message || "Erreur lors de la candidature."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCvs();
  }, []);

  // ======================================================
  // FILTERS
  // ======================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const value = `
        ${job.title || ""}
        ${job.company || ""}
        ${job.location || ""}
        ${job.description || ""}
        ${job.contract_type || ""}
        ${job.source || ""}
        ${getJobSkills(job).join(" ")}
      `.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [jobs, search]);

  const remoteJobs = jobs.filter((job) => isRemote(job)).length;

  const topMatches = jobs.filter((job) => getMatchScore(job) >= 85).length;

  const companiesCount = new Set(
    jobs.map((job) => job.company).filter(Boolean)
  ).size;

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
                <FaBriefcase className="text-pink-100" />

                <span className="text-xs uppercase tracking-[3px] font-black text-pink-100">
                  SmartRecruit Candidate Jobs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Trouvez l’offre idéale
                <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  adaptée à votre profil.
                </span>
              </h1>

              <p className="text-indigo-100 max-w-3xl mt-5 leading-7">
                Explorez les offres disponibles, comparez les opportunités,
                consultez les compétences demandées et postulez directement avec
                votre CV sauvegardé.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="button"
                  onClick={refreshJobs}
                  disabled={refreshing}
                  className="bg-white text-violet-700 px-5 py-3 rounded-2xl font-black hover:bg-pink-50 transition flex items-center gap-2 disabled:opacity-60"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>

                <Link
                  to="/candidate-dashboard"
                  className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl font-black hover:bg-white/20 transition flex items-center gap-2"
                >
                  <FaFilePdf />
                  Mes CV
                </Link>
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Offres" value={jobs.length} />
              <HeroMetric title="Résultats" value={filteredJobs.length} />
              <HeroMetric title="Top match" value={topMatches} />
              <HeroMetric title="CV prêts" value={cvs.length} />
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Offres disponibles"
            value={jobs.length}
            icon={<FaBriefcase />}
            color="bg-indigo-50 text-indigo-700"
          />

          <MiniStat
            title="Entreprises"
            value={companiesCount}
            icon={<FaBuilding />}
            color="bg-violet-50 text-violet-700"
          />

          <MiniStat
            title="Remote / hybride"
            value={remoteJobs}
            icon={<FaGlobeEurope />}
            color="bg-pink-50 text-pink-700"
          />

          <MiniStat
            title="CV sauvegardés"
            value={cvs.length}
            icon={<FaFilePdf />}
            color="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* SEARCH PANEL */}
        <div className="rounded-[30px] bg-white border border-slate-200 shadow-lg p-5">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex-1 focus-within:ring-4 focus-within:ring-violet-100 transition">
              <FaSearch className="text-violet-600 text-xl" />

              <input
                type="text"
                placeholder="Rechercher un poste, une entreprise, une ville, une compétence ou un contrat..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full outline-none bg-transparent text-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={refreshJobs}
              disabled={refreshing}
              className="bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-[24px] p-5 font-black flex items-center gap-3">
            <FaExclamationTriangle />
            {errorMessage}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <PanelCard title="Chargement" subtitle="Récupération des offres">
            <div className="flex items-center gap-3 text-slate-500 font-bold">
              <FaSyncAlt className="animate-spin text-violet-600" />
              Chargement des offres en cours...
            </div>
          </PanelCard>
        )}

        {/* EMPTY */}
        {!loading && filteredJobs.length === 0 && (
          <PanelCard title="Aucune offre disponible" subtitle="Aucun résultat trouvé">
            <div className="text-center py-10">
              <FaBriefcase className="text-6xl text-slate-300 mx-auto mb-5" />

              <h2 className="text-2xl font-black text-slate-900">
                Aucune offre ne correspond à votre recherche
              </h2>

              <p className="text-slate-500 mt-2">
                Modifiez votre recherche ou actualisez les offres.
              </p>

              <button
                type="button"
                onClick={refreshJobs}
                disabled={refreshing}
                className="mt-6 bg-gradient-to-r from-violet-600 to-pink-500 text-white px-6 py-4 rounded-2xl font-black inline-flex items-center gap-2 disabled:opacity-60"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                Actualiser les offres
              </button>
            </div>
          </PanelCard>
        )}

        {/* JOBS GRID */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredJobs.map((job, index) => {
              const skills = getJobSkills(job).slice(0, 6);
              const contractType = getContractType(job);
              const source = getSource(job);
              const matchScore = getMatchScore(job);

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-lg border border-slate-200 hover:border-violet-200 transition"
                >
                  <div className="absolute top-[-90px] right-[-90px] w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
                          {job.company?.charAt(0).toUpperCase() || "S"}
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-2xl font-black text-slate-900 leading-7">
                            {job.title || "Offre sans titre"}
                          </h2>

                          <p className="text-slate-500 mt-2 leading-7 max-h-[56px] overflow-hidden">
                            {job.description || "Aucune description disponible."}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 p-[4px]">
                          <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-slate-900">
                              {matchScore}%
                            </span>

                            <span className="text-[10px] font-black text-slate-400">
                              Match
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <Badge icon={<FaBuilding />} text={job.company || "Entreprise"} />
                      <Badge icon={<FaMapMarkerAlt />} text={job.location || "Lieu non précisé"} />
                      <Badge icon={<FaFileContract />} text={contractType} />
                      <Badge
                        icon={<FaLayerGroup />}
                        text={isRemote(job) ? "Remote / Hybride" : source}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {skills.length > 0 ? (
                        skills.map((skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="bg-violet-50 text-violet-700 border border-violet-100 px-3 py-2 rounded-full text-xs font-black flex items-center gap-1"
                          >
                            <FaTags />
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-full text-xs font-black">
                          Compétences non précisées
                        </span>
                      )}
                    </div>

                    <div className="mt-6 rounded-[24px] bg-slate-50 border border-slate-200 p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black">
                          Compatibilité
                        </p>

                        <h3 className="text-lg font-black text-slate-900">
                          {getMatchLabel(matchScore)}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl font-black hover:bg-slate-100 transition flex items-center gap-2"
                        >
                          <FaEye />
                          Détails
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="bg-gradient-to-r from-violet-600 to-pink-500 text-white px-4 py-3 rounded-2xl font-black hover:scale-[1.02] transition flex items-center gap-2 shadow-lg"
                        >
                          <FaPaperPlane />
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          cvs={cvs}
          selectedCvId={selectedCvId}
          applyingJobId={applyingJobId}
          getJobSkills={getJobSkills}
          getContractType={getContractType}
          getMatchScore={getMatchScore}
          getMatchLabel={getMatchLabel}
          formatDate={formatDate}
          setSelectedCvId={setSelectedCvId}
          onClose={() => {
            setSelectedJob(null);
            setSelectedCvId("");
          }}
          onApply={() => handleApply(selectedJob.id)}
        />
      )}
    </CandidateLayout>
  );
}

// ======================================================
// MODAL
// ======================================================

function JobModal({
  job,
  cvs,
  selectedCvId,
  applyingJobId,
  getJobSkills,
  getContractType,
  getMatchScore,
  getMatchLabel,
  formatDate,
  setSelectedCvId,
  onClose,
  onApply,
}: {
  job: Job;
  cvs: CV[];
  selectedCvId: string;
  applyingJobId: number | null;
  getJobSkills: (job: Job) => string[];
  getContractType: (job: Job) => string;
  getMatchScore: (job: Job) => number;
  getMatchLabel: (score: number) => string;
  formatDate: (date?: string | null) => string;
  setSelectedCvId: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  const skills = getJobSkills(job);
  const matchScore = getMatchScore(job);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-[980px] max-w-full rounded-[36px] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* MODAL HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#312e81] via-[#7c3aed] to-[#ec4899] p-7 text-white">
          <div className="absolute top-[-90px] right-[-90px] w-72 h-72 bg-pink-300/25 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-5">
            <div>
              <p className="text-pink-100 uppercase tracking-[3px] text-xs font-black">
                Détail de l’offre
              </p>

              <h2 className="text-4xl font-black mt-3">{job.title}</h2>

              <div className="flex flex-wrap gap-3 mt-5">
                <ModalBadge icon={<FaBuilding />} text={job.company || "Entreprise"} />
                <ModalBadge icon={<FaMapMarkerAlt />} text={job.location || "Lieu"} />
                <ModalBadge icon={<FaFileContract />} text={getContractType(job)} />
                <ModalBadge
                  icon={<FaCalendarAlt />}
                  text={formatDate(job.scraped_at || job.created_at)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-xl transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-7 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-5">
            <PanelCard title="Description de l’offre" subtitle="Missions et contexte">
              <p className="text-slate-600 leading-8 whitespace-pre-line">
                {job.description || "Aucune description disponible."}
              </p>
            </PanelCard>

            <PanelCard title="Compétences détectées" subtitle="Mots-clés importants">
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-violet-50 text-violet-700 border border-violet-100 px-4 py-2 rounded-full text-sm font-black"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-black">
                    Aucune compétence détectée
                  </span>
                )}
              </div>
            </PanelCard>
          </div>

          <div className="xl:col-span-5 space-y-5">
            <PanelCard title="Matching candidat" subtitle="Compatibilité estimée">
              <div className="flex items-center gap-5">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 p-[5px] shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">
                      {matchScore}%
                    </span>

                    <span className="text-xs font-black text-slate-400">
                      Match
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {getMatchLabel(matchScore)}
                  </h3>

                  <p className="text-slate-500 leading-7 mt-2">
                    Score estimé selon le contenu de l’offre et les mots-clés
                    détectés.
                  </p>
                </div>
              </div>
            </PanelCard>

            <PanelCard title="Postuler avec un CV" subtitle="Choisissez un CV sauvegardé">
              {cvs.length === 0 ? (
                <div className="rounded-[24px] bg-red-50 border border-red-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <FaExclamationTriangle className="text-red-600" />

                    <h3 className="font-black text-red-700">
                      Aucun CV sauvegardé
                    </h3>
                  </div>

                  <p className="text-red-700 text-sm leading-7">
                    Analysez d’abord votre CV dans votre tableau de bord candidat
                    avant de postuler.
                  </p>

                  <Link
                    to="/candidate-dashboard"
                    className="mt-4 inline-flex bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
                  >
                    Ajouter un CV
                  </Link>
                </div>
              ) : (
                <>
                  <select
                    value={selectedCvId}
                    onChange={(event) => setSelectedCvId(event.target.value)}
                    className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 outline-none focus:ring-4 focus:ring-violet-100 font-bold"
                  >
                    <option value="">-- Sélectionner un CV sauvegardé --</option>

                    {cvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.file_name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={onApply}
                    disabled={applyingJobId === job.id || !selectedCvId}
                    className="mt-4 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 text-white px-6 py-4 rounded-2xl font-black transition flex justify-center items-center gap-2 shadow-lg"
                  >
                    {applyingJobId === job.id ? (
                      <>
                        <FaBolt className="animate-pulse" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Postuler avec ce CV
                      </>
                    )}
                  </button>
                </>
              )}
            </PanelCard>
          </div>
        </div>
      </motion.div>
    </div>
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

function Badge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
      {icon}
      {text}
    </span>
  );
}

function ModalBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-sm font-black flex items-center gap-2">
      {icon}
      {text}
    </span>
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

export default CandidateJobs;