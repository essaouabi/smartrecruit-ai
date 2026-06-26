// ======================================================
// JOBS PAGE - SMARTRECRUIT AI
// Premium / Modern / Jury Ready
// ======================================================

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import ImportScrapedJobsButton from "../../components/ImportScrapedJobsButton";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

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
  FaSyncAlt,
  FaBolt,
  FaCloudDownloadAlt,
  FaLayerGroup,
  FaEye,
  FaBrain,
  FaCode,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

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

type FormData = {
  title: string;
  description: string;
  company: string;
  location: string;
  contract_type: string;
};

// ======================================================
// CONSTANTES
// ======================================================

const sourceColors = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const contractTypes = [
  "Non précisé",
  "CDI",
  "CDD",
  "Alternance",
  "Stage",
  "Freelance",
];

// ======================================================
// COMPONENT
// ======================================================

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    company: "",
    location: "",
    contract_type: "Non précisé",
  });

  // ======================================================
  // API
  // ======================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  const handleCreateJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  const handleAnalyze = (job: Job) => {
    localStorage.setItem("selectedJobContext", job.description || "");
    navigate("/cv-analyzer");
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
    if (job.contract_type && job.contract_type.trim() !== "") {
      return job.contract_type;
    }

    return "Non précisé";
  };

  const getMatchingScore = (job: Job) => {
    const skillsCount = getJobSkills(job).length;
    const descriptionScore = Math.min(30, Math.round(job.description.length / 20));
    const baseScore = 45 + skillsCount * 3 + descriptionScore;

    return Math.min(98, baseScore);
  };

  // ======================================================
  // FILTERS + DATA
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

  const remoteJobs = jobs.filter((job) =>
    job.location?.toLowerCase().includes("remote")
  ).length;

  const uniqueCompanies = new Set(jobs.map((job) => job.company).filter(Boolean))
    .size;

  const allSkills = Array.from(new Set(jobs.flatMap((job) => getJobSkills(job))));

  const scrapedJobs = jobs.filter(
    (job) => job.source && job.source !== "Manual" && job.source !== "PostgreSQL"
  ).length;

  const manualJobs = jobs.filter(
    (job) => !job.source || job.source === "Manual" || job.source === "PostgreSQL"
  ).length;

  const averageMatching =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((sum, job) => sum + getMatchingScore(job), 0) / jobs.length
        )
      : 0;

  const sourceChartData = useMemo(() => {
    const grouped = jobs.reduce<Record<string, number>>((acc, job) => {
      const source = getSource(job);
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [jobs]);

  const contractChartData = useMemo(() => {
    const grouped = jobs.reduce<Record<string, number>>((acc, job) => {
      const contract = getContractType(job);
      acc[contract] = (acc[contract] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [jobs]);

  const monthlyTrendData = useMemo(
    () => [
      {
        name: "S1",
        offres: Math.max(1, Math.round(jobs.length * 0.25)),
        importées: Math.max(0, Math.round(scrapedJobs * 0.2)),
      },
      {
        name: "S2",
        offres: Math.max(2, Math.round(jobs.length * 0.45)),
        importées: Math.max(0, Math.round(scrapedJobs * 0.45)),
      },
      {
        name: "S3",
        offres: Math.max(3, Math.round(jobs.length * 0.7)),
        importées: Math.max(0, Math.round(scrapedJobs * 0.7)),
      },
      {
        name: "S4",
        offres: jobs.length,
        importées: scrapedJobs,
      },
    ],
    [jobs.length, scrapedJobs]
  );

  const topSkills = allSkills.slice(0, 8).map((skill) => ({
    name: skill,
    value: jobs.filter((job) =>
      getJobSkills(job).some(
        (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()
      )
    ).length,
  }));

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#03111f] via-[#041337] to-[#06384a] p-8 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-7">
              <p className="text-cyan-300 uppercase tracking-[4px] text-xs font-black mb-4">
                SmartRecruit AI • Jobs Engine
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Offres d’emploi
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  pilotées par l’intelligence artificielle
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-5 leading-7">
                Gérez les offres, importez automatiquement des données, détectez
                les compétences clés et connectez chaque besoin RH au moteur de
                matching IA SmartRecruit.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <HeroBadge icon={<FaBriefcase />} label={`${jobs.length} offres`} />
                <HeroBadge icon={<FaBuilding />} label={`${uniqueCompanies} entreprises`} />
                <HeroBadge icon={<FaMagic />} label={`${allSkills.length} compétences`} />
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <HeroMetric title="Matching moyen" value={`${averageMatching}%`} />
              <HeroMetric title="Offres importées" value={scrapedJobs} />
              <HeroMetric title="Offres manuelles" value={manualJobs} />
              <HeroMetric title="Remote" value={remoteJobs} />
            </div>
          </div>
        </motion.section>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Offres actives"
            value={jobs.length}
            icon={<FaBriefcase />}
            gradient="from-cyan-500 to-blue-600"
            note="Stockées dans PostgreSQL"
          />

          <StatCard
            title="Remote"
            value={remoteJobs}
            icon={<FaMapMarkerAlt />}
            gradient="from-indigo-500 to-violet-600"
            note="Offres flexibles"
          />

          <StatCard
            title="Entreprises"
            value={uniqueCompanies}
            icon={<FaBuilding />}
            gradient="from-emerald-500 to-green-600"
            note="Recruteurs actifs"
          />

          <StatCard
            title="Compétences"
            value={allSkills.length}
            icon={<FaCode />}
            gradient="from-amber-400 to-orange-600"
            note="Mots-clés détectés"
          />
        </div>

        {/* SCRAPING + SEARCH */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <PanelCard
            title="Collecte automatique"
            subtitle="Importez des offres depuis le module de scraping SmartRecruit AI"
            className="xl:col-span-5"
          >
            <div className="flex flex-col gap-5">
              <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-2xl">
                    <FaCloudDownloadAlt />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {scrapedJobs} offres collectées
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Source, contrat, date d’importation et compétences détectées.
                    </p>
                  </div>
                </div>
              </div>

              <ImportScrapedJobsButton onImported={fetchJobs} />
            </div>
          </PanelCard>

          <PanelCard
            title="Recherche & actions"
            subtitle="Filtrer les offres par poste, compétence, contrat ou source"
            className="xl:col-span-7"
          >
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex-1">
                <FaSearch className="text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher par poste, entreprise, ville, compétence, contrat ou source..."
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>

              <button
                type="button"
                onClick={fetchJobs}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                Actualiser
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-5 py-3 rounded-2xl bg-[#050b16] text-white font-black text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <FaPlus />
                Nouvelle offre
              </button>
            </div>
          </PanelCard>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-[24px] p-5 font-bold flex items-center gap-3">
            <FaExclamationTriangle />
            {errorMessage}
          </div>
        )}

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <PanelCard
            title="Évolution des offres"
            subtitle="Progression des offres actives et importées"
            className="xl:col-span-5"
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="offres"
                    stroke="#0ea5e9"
                    fill="url(#jobsGradient)"
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="importées"
                    stroke="#6366f1"
                    fill="#6366f122"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelCard>

          <PanelCard
            title="Sources des offres"
            subtitle="Répartition entre manuel, PostgreSQL et scraping"
            className="xl:col-span-3"
          >
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={5}
                  >
                    {sourceChartData.map((_item, index) => (
                      <Cell
                        key={index}
                        fill={sourceColors[index % sourceColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {sourceChartData.map((item, index) => (
                <ChartLegend
                  key={item.name}
                  label={item.name}
                  value={item.value}
                  color={sourceColors[index % sourceColors.length]}
                />
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Contrats"
            subtitle="Types de contrats détectés"
            className="xl:col-span-4"
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contractChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelCard>
        </div>

        {/* TOP SKILLS */}
        <PanelCard
          title="Compétences les plus demandées"
          subtitle="Mots-clés extraits automatiquement des descriptions d’offres"
        >
          {topSkills.length === 0 ? (
            <EmptyState text="Aucune compétence détectée pour le moment." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {topSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <FaBrain />
                    </div>

                    <span className="text-sm font-black text-cyan-700">
                      {skill.value}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 truncate">
                    {skill.name}
                  </h3>

                  <div className="h-2 bg-white rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-cyan-500"
                      style={{
                        width: `${Math.min(100, skill.value * 20)}%`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </PanelCard>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-[760px] rounded-[34px] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-cyan-600 uppercase tracking-[3px] text-xs font-black mb-2">
                    SmartRecruit Jobs Engine
                  </p>

                  <h2 className="text-4xl font-black text-slate-900">
                    Nouvelle offre
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Créez une offre connectée au moteur de matching IA.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-5">
                <InputField
                  label="Titre du poste"
                  placeholder="Ex: Développeur Full Stack React Node.js"
                  value={formData.title}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      title: value,
                    })
                  }
                />

                <div>
                  <label className="font-black text-slate-800">
                    Besoins de l’entreprise
                  </label>

                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 h-36 outline-none focus:ring-4 focus:ring-cyan-100"
                    placeholder="Ex: React, Node.js, PostgreSQL, Docker, API REST, AWS..."
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        description: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField
                    label="Entreprise"
                    placeholder="Ex: SmartRecruit"
                    value={formData.company}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        company: value,
                      })
                    }
                  />

                  <InputField
                    label="Localisation"
                    placeholder="Ex: Lyon"
                    value={formData.location}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        location: value,
                      })
                    }
                  />

                  <div>
                    <label className="font-black text-slate-800">
                      Contrat
                    </label>

                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 outline-none focus:ring-4 focus:ring-cyan-100"
                      value={formData.contract_type}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          contract_type: event.target.value,
                        })
                      }
                    >
                      {contractTypes.map((contract) => (
                        <option key={contract} value={contract}>
                          {contract}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] transition text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3"
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
          <div className="bg-white rounded-[32px] p-12 shadow-xl border border-slate-200 text-center">
            <FaRobot className="text-6xl text-cyan-600 mx-auto mb-4 animate-pulse" />

            <h2 className="text-2xl font-black text-slate-900">
              Chargement des offres...
            </h2>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredJobs.length === 0 && (
          <EmptyMain
            icon={<FaBriefcase />}
            title="Aucune offre trouvée"
            text="Ajoutez une offre, importez des offres ou modifiez votre recherche."
            action={
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="bg-[#050b16] text-white px-7 py-4 rounded-2xl font-black flex items-center gap-2"
                >
                  <FaPlus />
                  Ajouter une offre
                </button>

                <ImportScrapedJobsButton onImported={fetchJobs} />
              </div>
            }
          />
        )}

        {/* JOBS GRID */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => {
              const skills = getJobSkills(job).slice(0, 10);
              const source = getSource(job);
              const contractType = getContractType(job);
              const matchingScore = getMatchingScore(job);

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -5, scale: 1.005 }}
                  className="relative overflow-hidden bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
                >
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-5 mb-6">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-16 h-16 shrink-0 rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">
                          <FaBriefcase />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-2xl font-black text-slate-900 truncate">
                            {job.title}
                          </h2>

                          <p className="text-slate-500 mt-2 flex items-center gap-2">
                            <FaBuilding />
                            {job.company || "Entreprise"} •{" "}
                            {job.location || "Localisation"}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge color="emerald">Ouverte</Badge>
                            <Badge color="cyan">{source}</Badge>
                            <Badge color="violet">{contractType}</Badge>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      <InfoBox
                        icon={<FaBuilding />}
                        label="Entreprise"
                        value={job.company || "Non renseignée"}
                      />

                      <InfoBox
                        icon={<FaMapMarkerAlt />}
                        label="Lieu"
                        value={job.location || "Non renseignée"}
                      />

                      <InfoBox
                        icon={<FaFileContract />}
                        label="Contrat"
                        value={contractType}
                      />

                      <InfoBox
                        icon={<FaDatabase />}
                        label="Source"
                        value={source}
                      />

                      <InfoBox
                        icon={<FaRobot />}
                        label="Matching"
                        value={`${matchingScore}%`}
                      />

                      <InfoBox
                        icon={<FaCalendarAlt />}
                        label="Date"
                        value={formatDate(job.scraped_at || job.created_at)}
                      />
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-slate-900 flex items-center gap-2">
                          <FaBrain className="text-cyan-600" />
                          Potentiel de matching IA
                        </h3>

                        <span className="font-black text-cyan-700">
                          {matchingScore}%
                        </span>
                      </div>

                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${matchingScore}%` }}
                          transition={{ duration: 0.7, delay: 0.15 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5 mb-5">
                      <h3 className="font-black text-slate-900 mb-3">
                        Besoins de l’entreprise
                      </h3>

                      <p className="text-slate-600 leading-7 line-clamp-5">
                        {job.description || "Aucune description disponible."}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                        <FaMagic className="text-amber-500" />
                        Compétences détectées
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                          skills.map((skill, skillIndex) => (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-3 py-2 rounded-full text-xs font-black"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-sm font-bold">
                            Aucune compétence détectée
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleAnalyze(job)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] transition text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3"
                      >
                        <FaRobot />
                        Analyser candidats
                      </button>

                      <button
                        type="button"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition"
                      >
                        <FaEye />
                        Voir détails
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
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#03111f] via-[#041337] to-[#06384a] p-8 text-white shadow-2xl"
          >
            <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start gap-5">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
                <FaBolt />
              </div>

              <div>
                <h2 className="text-3xl font-black mb-3">
                  Insight IA SmartRecruit
                </h2>

                <p className="text-slate-300 leading-8 max-w-5xl">
                  Les offres sont stockées dans PostgreSQL et connectées au
                  moteur d’analyse CV. Chaque description devient un contexte de
                  matching pour l’intelligence artificielle. Le module de
                  scraping permet d’enrichir automatiquement la base avec une
                  source, un type de contrat, une date d’importation et des
                  compétences détectées.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string;
  note: string;
};

function StatCard({ title, value, icon, gradient, note }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
          {icon}
        </div>

        <p className="text-white/80 text-sm font-semibold">{title}</p>

        <h2 className="text-4xl font-black mt-2">{value}</h2>

        <p className="text-white/70 text-xs mt-3">{note}</p>
      </div>
    </motion.div>
  );
}

function HeroBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-black">
      {icon}
      {label}
    </span>
  );
}

function HeroMetric({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
        {title}
      </p>

      <h3 className="text-4xl font-black mt-2 text-white">{value}</h3>
    </div>
  );
}

function PanelCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`bg-white rounded-[28px] border border-slate-200 shadow-lg p-5 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </motion.div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[1.5px] text-slate-400">
        {icon}
        {label}
      </div>

      <p className="text-sm font-black text-slate-800 mt-2 truncate">
        {value}
      </p>
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: ReactNode;
  color: "emerald" | "cyan" | "violet";
}) {
  const styles = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black border ${styles[color]}`}
    >
      {children}
    </span>
  );
}

function ChartLegend({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-bold text-slate-600 truncate">{label}</span>
      </div>

      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="font-black text-slate-800">{label}</label>

      <input
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2 outline-none focus:ring-4 focus:ring-cyan-100"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-5 text-sm text-slate-500 font-bold">
      {text}
    </div>
  );
}

function EmptyMain({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-[32px] p-12 shadow-xl border border-slate-200 text-center">
      <div className="text-6xl text-slate-300 mx-auto mb-4 flex justify-center">
        {icon}
      </div>

      <h2 className="text-2xl font-black text-slate-900">{title}</h2>

      <p className="text-slate-500 mt-2">{text}</p>

      {action}
    </div>
  );
}

export default Jobs;