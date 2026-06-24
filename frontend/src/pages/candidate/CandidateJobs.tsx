import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
} from "react-icons/fa";

import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";

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

  // ===============================
  // HELPERS
  // ===============================

  const getJobSkills = (job: Job) => {
    if (Array.isArray(job.skills)) {
      return job.skills.filter(Boolean);
    }

    if (
      typeof job.skills === "string" &&
      job.skills.trim() !== ""
    ) {
      return job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 1);
    }

    if (!job.description) return [];

    return Array.from(
      new Set(
        job.description
          .replace(/[.,;:()]/g, " ")
          .split(" ")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 2)
      )
    ).slice(0, 10);
  };

  const getContractType = (job: Job) => {
    if (
      job.contract_type &&
      job.contract_type.trim() !== ""
    ) {
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

  // ===============================
  // GET JOBS
  // ===============================

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

  // ===============================
  // REFRESH JOBS
  // ===============================

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

  // ===============================
  // GET CVS
  // ===============================

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

  // ===============================
  // APPLY TO JOB
  // ===============================

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
        error.response?.data?.message ||
          "Erreur lors de la candidature."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    fetchJobs();
    fetchCvs();
  }, []);

  // ===============================
  // FILTER JOBS
  // ===============================

  const filteredJobs = jobs.filter((job) => {
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

  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* HEADER PREMIUM */}

        <motion.div
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
        >
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-cyan-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-80px] w-80 h-80 bg-blue-600/30 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex bg-white/10 border border-white/10 text-cyan-200 px-4 py-2 rounded-full text-sm font-bold">
                SmartRecruit AI Jobs
              </span>

              <h1 className="text-5xl font-black mt-6">
                Trouvez votre prochain emploi
              </h1>

              <p className="text-slate-300 mt-4 text-lg">
                Découvrez les offres les plus adaptées à votre profil.
              </p>
            </div>

            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="bg-white text-slate-900 hover:bg-cyan-50 disabled:opacity-60 px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition"
            >
              <FaSyncAlt
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing
                ? "Actualisation..."
                : "Actualiser les offres"}
            </button>
          </div>
        </motion.div>

        {/* BARRE DE RECHERCHE */}

        <div className="bg-white rounded-[28px] p-5 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <FaSearch className="text-blue-600 text-xl" />

            <input
              type="text"
              placeholder="Rechercher un poste, une entreprise, une ville, une compétence ou un contrat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-lg"
            />
          </div>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-3xl p-5 font-black flex items-center gap-3">
            <FaExclamationTriangle />
            {errorMessage}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border font-medium text-slate-500">
            Chargement des offres en cours...
          </div>
        )}

        {/* EMPTY */}

        {!loading && filteredJobs.length === 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Aucune offre disponible
            </h2>

            <p className="text-slate-500 mb-5">
              Aucune offre ne correspond à votre recherche.
            </p>

            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-2xl font-black inline-flex items-center gap-2"
            >
              <FaSyncAlt
                className={refreshing ? "animate-spin" : ""}
              />
              Actualiser les offres
            </button>
          </div>
        )}

        {/* JOBS LIST */}

        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-5">
            {filteredJobs.map((job) => {
              const skills = getJobSkills(job).slice(0, 8);
              const contractType = getContractType(job);
              const source = getSource(job);

              return (
                <motion.div
                  key={job.id}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="relative overflow-hidden rounded-[32px] bg-white p-7 shadow-xl border border-slate-200 hover:border-cyan-300"
                >
                  <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/10 blur-3xl rounded-full" />

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                        {job.company?.charAt(0).toUpperCase() || "S"}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-2xl font-black text-slate-900">
                            {job.title}
                          </h2>

                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                            92% Match IA
                          </span>
                        </div>

                        <p className="text-slate-500 mt-2 max-w-3xl line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                            <FaBuilding />
                            {job.company}
                          </span>

                          <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                            <FaMapMarkerAlt />
                            {job.location}
                          </span>

                          <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                            <FaFileContract />
                            {contractType}
                          </span>

                          <span className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                            {job.location?.toLowerCase().includes("remote")
                              ? "Remote possible"
                              : source}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {skills.map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"
                            >
                              <FaTags />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[180px]">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2 transition"
                      >
                        <FaEye />
                        Voir détails
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <FaPaperPlane />
                        Postuler
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALE DE CANDIDATURE */}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[700px] max-w-full rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black text-slate-900">
              {selectedJob.title}
            </h2>

            <div className="flex gap-3 mt-4 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <FaBuilding />
                {selectedJob.company}
              </span>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <FaMapMarkerAlt />
                {selectedJob.location}
              </span>

              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <FaFileContract />
                {getContractType(selectedJob)}
              </span>

              <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <FaCalendarAlt />
                {formatDate(
                  selectedJob.scraped_at ||
                    selectedJob.created_at
                )}
              </span>
            </div>

            <div className="mt-5 bg-slate-50 rounded-2xl p-4 border">
              <h3 className="font-black text-slate-800 mb-3">
                Description de l’offre
              </h3>

              <p className="text-slate-600 leading-7">
                {selectedJob.description}
              </p>

              <h3 className="font-black text-slate-800 mt-5 mb-3">
                Compétences détectées
              </h3>

              <div className="flex flex-wrap gap-2">
                {getJobSkills(selectedJob).length > 0 ? (
                  getJobSkills(selectedJob).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-bold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="bg-slate-200 text-slate-600 px-3 py-2 rounded-full text-sm font-bold">
                    Aucune compétence détectée
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <label className="block font-black text-slate-800 mb-3">
                Choisir le CV à envoyer
              </label>

              <select
                value={selectedCvId}
                onChange={(e) =>
                  setSelectedCvId(e.target.value)
                }
                className="w-full border border-slate-300 rounded-2xl p-4 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  -- Sélectionner un CV sauvegardé --
                </option>

                {cvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.file_name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={
                  applyingJobId === selectedJob.id ||
                  !selectedCvId
                }
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-6 py-4 rounded-2xl font-black transition flex justify-center items-center gap-2"
              >
                {applyingJobId === selectedJob.id ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Postuler avec ce CV
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setSelectedCvId("");
                }}
                className="text-slate-500 hover:text-slate-800 font-bold px-5 py-3 transition"
              >
                Annuler et fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
}

export default CandidateJobs;