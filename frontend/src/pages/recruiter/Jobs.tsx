// ===============================
// IMPORTS
// ===============================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { motion } from "framer-motion";

import ImportScrapedJobsButton from "../../components/ImportScrapedJobsButton";

import {
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaRobot,
  FaDatabase,
  FaMapMarkerAlt,
  FaBuilding,
  FaSearch,
  FaChartLine,
  FaTimes,
  FaMagic,
  FaCheckCircle,
  FaFileContract,
  FaCalendarAlt,
  FaExclamationTriangle,
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
  created_at?: string | null;
  source?: string | null;
  skills?: string | string[] | null;
  contract_type?: string | null;
  scraped_at?: string | null;
};

// ===============================
// COMPONENT
// ===============================

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    contract_type: "Non précisé",
  });

  const navigate = useNavigate();

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
          "Erreur récupération des offres."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CREATE JOB
  // ===============================

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/jobs", {
        ...formData,
        source: "Manual",
      });

      setShowModal(false);

      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        contract_type: "Non précisé",
      });

      fetchJobs();
    } catch (error: any) {
      console.error("Erreur création offre :", error);
      console.error("Réponse backend :", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur création offre"
      );
    }
  };

  // ===============================
  // DELETE JOB
  // ===============================

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette offre ?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error: any) {
      console.error("Erreur suppression offre :", error);
      console.error("Réponse backend :", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur suppression offre"
      );
    }
  };

  // ===============================
  // ANALYZE CANDIDATES
  // ===============================

  const handleAnalyze = (job: Job) => {
    localStorage.setItem(
      "selectedJobContext",
      job.description || ""
    );

    navigate("/cv-analyzer");
  };

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
          .filter((skill) => skill.length > 1)
      )
    ).slice(0, 10);
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

  const getSource = (job: Job) => {
    if (job.source && job.source.trim() !== "") {
      return job.source;
    }

    return "PostgreSQL";
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

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    fetchJobs();
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

  // ===============================
  // KPI DATA
  // ===============================

  const remoteJobs = jobs.filter((job) =>
    job.location?.toLowerCase().includes("remote")
  ).length;

  const uniqueCompanies = new Set(
    jobs.map((job) => job.company).filter(Boolean)
  ).size;

  const allSkills = Array.from(
    new Set(jobs.flatMap((job) => getJobSkills(job)))
  );

  const scrapedJobs = jobs.filter(
    (job) =>
      job.source &&
      job.source !== "Manual" &&
      job.source !== "PostgreSQL"
  ).length;

  const statsCards = [
    {
      label: "Offres actives",
      value: jobs.length,
      icon: <FaBriefcase />,
      note: "Stockées PostgreSQL",
      gradient: "from-[#062c22] to-[#0b3d2e]",
    },
    {
      label: "Remote",
      value: remoteJobs,
      icon: <FaMapMarkerAlt />,
      note: "Offres flexibles",
      gradient: "from-blue-700 to-cyan-400",
    },
    {
      label: "Entreprises",
      value: uniqueCompanies,
      icon: <FaBuilding />,
      note: "Recruteurs actifs",
      gradient: "from-purple-700 to-fuchsia-400",
    },
    {
      label: "Compétences",
      value: allSkills.length,
      icon: <FaMagic />,
      note: "Mots-clés détectés",
      gradient: "from-emerald-600 to-green-400",
    },
  ];

  return (
    <DashboardLayout>
      {/* HERO */}

      <motion.div
        initial={{
          opacity: 0,
          y: 35,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] p-10 mb-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
      >
        <div className="absolute right-[-100px] top-[-100px] w-[330px] h-[330px] bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-full mb-6">
              <FaBriefcase className="text-green-300" />

              <span className="text-green-100 font-semibold">
                SmartRecruit Jobs Engine
              </span>
            </div>

            <h1 className="text-6xl font-black mb-5">
              Offres d’emploi IA
            </h1>

            <p className="text-green-100 text-lg leading-8 max-w-3xl">
              Gérez vos offres, collectez automatiquement des données,
              détectez les compétences recherchées et connectez les besoins RH
              avec l’analyse IA des candidats.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-[#062c22] px-8 py-5 rounded-3xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3"
          >
            <FaPlus />
            Nouvelle offre
          </button>
        </div>
      </motion.div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className={`relative overflow-hidden rounded-[32px] p-7 text-white shadow-xl bg-gradient-to-br ${card.gradient}`}
          >
            <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-8">
                {card.icon}
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

      {/* SCRAPING IMPORT */}

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#0b3d2e] mb-2">
              Collecte automatique des offres
            </h2>

            <p className="text-gray-500">
              Importez automatiquement des offres dans PostgreSQL depuis le
              module de scraping SmartRecruit AI.
            </p>

            <p className="text-sm text-green-700 font-bold mt-2">
              {scrapedJobs} offres collectées automatiquement.
            </p>
          </div>

          <ImportScrapedJobsButton onImported={fetchJobs} />
        </div>
      </div>

      {/* ERROR MESSAGE */}

      {errorMessage && (
        <div className="bg-red-100 border border-red-200 text-red-700 rounded-2xl p-5 mb-8 font-bold flex items-center gap-3">
          <FaExclamationTriangle />
          {errorMessage}
        </div>
      )}

      {/* SEARCH + ACTION */}

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-10 flex items-center justify-between gap-6">
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par poste, entreprise, ville, compétence, contrat ou source..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0b3d2e] hover:bg-[#145443] text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-3"
        >
          <FaPlus />
          Ajouter une offre
        </button>
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="bg-white w-[680px] rounded-[36px] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-black text-[#0b3d2e]">
                  Nouvelle offre
                </h2>

                <p className="text-gray-500 mt-2">
                  Créez une offre connectée au matching IA.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <label className="font-bold text-[#0b3d2e]">
                Titre du poste
              </label>

              <input
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-5 outline-none focus:ring-4 focus:ring-green-100"
                placeholder="Ex: Développeur Full Stack"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                required
              />

              <label className="font-bold text-[#0b3d2e]">
                Besoins de l’entreprise
              </label>

              <textarea
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-5 h-36 outline-none focus:ring-4 focus:ring-green-100"
                placeholder="Ex: React Node.js PostgreSQL Docker AWS..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                required
              />

              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="font-bold text-[#0b3d2e]">
                    Entreprise
                  </label>

                  <input
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-6 outline-none focus:ring-4 focus:ring-green-100"
                    placeholder="Ex: SmartRecruit"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b3d2e]">
                    Localisation
                  </label>

                  <input
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-6 outline-none focus:ring-4 focus:ring-green-100"
                    placeholder="Ex: Paris"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b3d2e]">
                    Contrat
                  </label>

                  <select
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-6 outline-none focus:ring-4 focus:ring-green-100"
                    value={formData.contract_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_type: e.target.value,
                      })
                    }
                  >
                    <option value="Non précisé">Non précisé</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#062c22] to-[#0b3d2e] hover:scale-[1.01] transition text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3"
              >
                <FaCheckCircle />
                Créer l’offre
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          <FaRobot className="text-5xl text-[#0b3d2e] mx-auto mb-4 animate-pulse" />

          <p className="text-gray-500 font-semibold">
            Chargement des offres...
          </p>
        </div>
      )}

      {/* EMPTY */}

      {!loading && filteredJobs.length === 0 && (
        <div className="bg-white rounded-[36px] p-12 shadow-sm text-center border border-gray-100">
          <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-6" />

          <h2 className="text-3xl font-black text-[#0b3d2e] mb-3">
            Aucune offre trouvée
          </h2>

          <p className="text-gray-500 mb-6">
            Ajoutez une offre, importez des offres ou modifiez votre recherche.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0b3d2e] text-white px-7 py-4 rounded-2xl font-bold"
            >
              Ajouter une offre
            </button>

            <ImportScrapedJobsButton onImported={fetchJobs} />
          </div>
        </div>
      )}

      {/* JOBS GRID */}

      {!loading && filteredJobs.length > 0 && (
        <div className="grid grid-cols-2 gap-8">
          {filteredJobs.map((job, index) => {
            const skills = getJobSkills(job).slice(0, 10);
            const source = getSource(job);
            const contractType = getContractType(job);

            return (
              <motion.div
                key={job.id}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                className="relative overflow-hidden bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
              >
                <div className="absolute right-[-70px] top-[-70px] w-40 h-40 bg-green-100 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-7">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-[#0b3d2e] text-white flex items-center justify-center text-2xl mb-5">
                        <FaBriefcase />
                      </div>

                      <h2 className="text-3xl font-black text-[#0b3d2e] mb-2">
                        {job.title}
                      </h2>

                      <p className="text-gray-500">
                        {job.location} • {job.company}
                      </p>
                    </div>

                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700">
                      Ouverte
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-7">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaBuilding className="text-green-700 mb-2" />

                      <p className="text-gray-500 text-sm">
                        Entreprise
                      </p>

                      <h3 className="font-bold text-[#0b3d2e]">
                        {job.company}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaMapMarkerAlt className="text-blue-700 mb-2" />

                      <p className="text-gray-500 text-sm">
                        Localisation
                      </p>

                      <h3 className="font-bold text-[#0b3d2e]">
                        {job.location}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaFileContract className="text-orange-600 mb-2" />

                      <p className="text-gray-500 text-sm">
                        Contrat
                      </p>

                      <h3 className="font-bold text-[#0b3d2e]">
                        {contractType}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaDatabase className="text-[#0b3d2e] mb-2" />

                      <p className="text-gray-500 text-sm">
                        Source
                      </p>

                      <h3 className="font-bold text-[#0b3d2e]">
                        {source}
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaRobot className="text-purple-700 mb-2" />

                      <p className="text-gray-500 text-sm">
                        Matching IA
                      </p>

                      <h3 className="font-bold text-green-700">
                        75%
                      </h3>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <FaCalendarAlt className="text-blue-700 mb-2" />

                      <p className="text-gray-500 text-sm">
                        Importée le
                      </p>

                      <h3 className="font-bold text-[#0b3d2e]">
                        {formatDate(job.scraped_at || job.created_at)}
                      </h3>
                    </div>
                  </div>

                  <h3 className="font-black text-[#0b3d2e] mb-4">
                    Besoins de l’entreprise
                  </h3>

                  <p className="text-gray-600 leading-7 mb-6">
                    {job.description}
                  </p>

                  <h3 className="font-black text-[#0b3d2e] mb-4">
                    Compétences détectées
                  </h3>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {skills.length > 0 ? (
                      skills.map((skill, skillIndex) => (
                        <span
                          key={`${skill}-${skillIndex}`}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-bold">
                        Aucune compétence détectée
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnalyze(job)}
                      className="flex-1 bg-gradient-to-r from-[#062c22] to-[#0b3d2e] hover:scale-[1.01] transition text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3"
                    >
                      <FaRobot />
                      Analyser candidats
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-6 py-4 border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 flex items-center gap-3"
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* AI INSIGHT */}

      {!loading && jobs.length > 0 && (
        <div className="mt-10 bg-gradient-to-r from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[36px] p-8 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
              <FaChartLine />
            </div>

            <div>
              <h2 className="text-3xl font-black mb-2">
                Insight IA
              </h2>

              <p className="text-green-100 leading-8">
                Les offres sont stockées dans PostgreSQL et connectées au moteur
                d’analyse CV. Chaque description devient un contexte de matching
                pour l’intelligence artificielle. Le module de scraping permet
                aussi d’enrichir automatiquement la base d’offres avec une
                source, un type de contrat, une date d’importation et des
                compétences détectées.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Jobs;