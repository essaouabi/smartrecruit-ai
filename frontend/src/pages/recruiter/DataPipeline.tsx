// ======================================================
// DATA PIPELINE PAGE - SMARTRECRUIT AI
// Premium / Modern / Jury Ready
// ======================================================

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import {
  FaCloudUploadAlt,
  FaDatabase,
  FaCheckCircle,
  FaTimesCircle,
  FaFileCsv,
  FaPlay,
  FaHistory,
  FaServer,
  FaSyncAlt,
  FaBolt,
  FaShieldAlt,
  FaLayerGroup,
  FaChartLine,
  FaExclamationTriangle,
  FaTable,
  FaCogs,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type ImportHistory = {
  id: number;
  filename: string;
  total_rows: number;
  inserted_rows: number;
  rejected_rows: number;
  created_at: string;
};

type PipelineResult = {
  total?: number;
  inserted?: number;
  rejected?: number;
  total_rows?: number;
  inserted_rows?: number;
  rejected_rows?: number;
  message?: string;
};

// ======================================================
// CONSTANTES
// ======================================================

const resultColors = ["#10b981", "#ef4444"];

const pipelineSteps = [
  {
    title: "CSV",
    description: "Fichier source",
    icon: <FaFileCsv />,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Lecture",
    description: "Parsing des lignes",
    icon: <FaTable />,
    color: "from-indigo-500 to-violet-600",
  },
  {
    title: "Nettoyage",
    description: "Normalisation",
    icon: <FaFilter />,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Validation",
    description: "Contrôle qualité",
    icon: <FaShieldAlt />,
    color: "from-amber-400 to-orange-600",
  },
  {
    title: "PostgreSQL",
    description: "Stockage final",
    icon: <FaDatabase />,
    color: "from-sky-500 to-cyan-600",
  },
  {
    title: "Dashboard",
    description: "Exploitation RH",
    icon: <FaChartLine />,
    color: "from-rose-500 to-red-600",
  },
];

// ======================================================
// COMPONENT
// ======================================================

const DataPipeline = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [history, setHistory] = useState<ImportHistory[]>([]);

  // ======================================================
  // API
  // ======================================================

  const fetchHistory = async () => {
    try {
      const response = await api.get("/data/imports");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.imports || [];

      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ======================================================
  // FILE HANDLING
  // ======================================================

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Veuillez sélectionner un fichier CSV.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez choisir un fichier CSV.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/data/import-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
      fetchHistory();
    } catch (error) {
      console.log(error);
      alert("Erreur pendant l’import CSV.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("fr-FR");
  };

  const resultTotal = Number(result?.total || result?.total_rows || 0);
  const resultInserted = Number(result?.inserted || result?.inserted_rows || 0);
  const resultRejected = Number(result?.rejected || result?.rejected_rows || 0);

  const totalImports = history.length;

  const totalRows = history.reduce(
    (sum, item) => sum + Number(item.total_rows || 0),
    0
  );

  const totalInserted = history.reduce(
    (sum, item) => sum + Number(item.inserted_rows || 0),
    0
  );

  const totalRejected = history.reduce(
    (sum, item) => sum + Number(item.rejected_rows || 0),
    0
  );

  const successRate =
    totalRows > 0 ? Math.round((totalInserted / totalRows) * 100) : 0;

  const currentSuccessRate =
    resultTotal > 0 ? Math.round((resultInserted / resultTotal) * 100) : 0;

  const resultPieData = [
    {
      name: "Validées",
      value: resultInserted,
    },
    {
      name: "Rejetées",
      value: resultRejected,
    },
  ];

  const resultBarData = [
    {
      name: "Lues",
      value: resultTotal,
    },
    {
      name: "Validées",
      value: resultInserted,
    },
    {
      name: "Rejetées",
      value: resultRejected,
    },
  ];

  const historyTrendData = useMemo(() => {
    const lastItems = history.slice(-6);

    return lastItems.map((item, index) => ({
      name: `Import ${index + 1}`,
      total: Number(item.total_rows || 0),
      inserted: Number(item.inserted_rows || 0),
      rejected: Number(item.rejected_rows || 0),
    }));
  }, [history]);

  // ======================================================
  // UI
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
                SmartRecruit AI • Data Engineering E1
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Data Pipeline
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  CSV vers PostgreSQL
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-5 leading-7">
                Importez des offres d’emploi depuis un fichier CSV, contrôlez la
                qualité des données, stockez les lignes valides dans PostgreSQL
                et gardez une traçabilité complète des imports.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <HeroBadge icon={<FaFileCsv />} label="Import CSV" />
                <HeroBadge icon={<FaDatabase />} label="PostgreSQL" />
                <HeroBadge icon={<FaHistory />} label="Traçabilité RNCP" />
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <HeroMetric title="Imports" value={totalImports} />
              <HeroMetric title="Lignes lues" value={totalRows} />
              <HeroMetric title="Validées" value={totalInserted} />
              <HeroMetric title="Qualité" value={`${successRate}%`} />
            </div>
          </div>
        </motion.section>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Imports exécutés"
            value={totalImports}
            icon={<FaHistory />}
            gradient="from-cyan-500 to-blue-600"
            note="Historique PostgreSQL"
          />

          <StatCard
            title="Lignes CSV"
            value={totalRows}
            icon={<FaTable />}
            gradient="from-indigo-500 to-violet-600"
            note="Lignes traitées"
          />

          <StatCard
            title="Lignes insérées"
            value={totalInserted}
            icon={<FaCheckCircle />}
            gradient="from-emerald-500 to-green-600"
            note="Validées en base"
          />

          <StatCard
            title="Lignes rejetées"
            value={totalRejected}
            icon={<FaTimesCircle />}
            gradient="from-red-500 to-rose-600"
            note="Contrôle qualité"
          />
        </div>

        {/* PIPELINE STEPS */}
        <PanelCard
          title="Chaîne Data Engineering"
          subtitle="Flux complet : CSV → nettoyage → validation → PostgreSQL → dashboard"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative"
              >
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm h-full">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl mb-4`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="font-black text-slate-900">{step.title}</h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {step.description}
                  </p>
                </div>

                {index < pipelineSteps.length - 1 && (
                  <FaArrowRight className="hidden xl:block absolute top-1/2 right-[-17px] -translate-y-1/2 text-slate-300 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </PanelCard>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* UPLOAD PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-5 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-3xl shadow-lg">
                <FaCloudUploadAlt />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Importer un fichier CSV
                </h2>

                <p className="text-slate-500 mt-1">
                  Colonnes attendues : title, company, location, description
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleChooseFile}
              className="w-full border-2 border-dashed border-cyan-300 bg-cyan-50 hover:bg-cyan-100 rounded-[28px] p-10 flex flex-col items-center justify-center transition mb-6"
            >
              <FaFileCsv className="text-7xl text-cyan-600 mb-5" />

              <span className="font-black text-slate-900 text-2xl">
                Choisir un fichier CSV
              </span>

              <span className="text-slate-500 mt-3">
                Cliquez ici pour sélectionner un fichier jobs.csv
              </span>
            </button>

            {file && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[24px] p-5 mb-6 flex items-center gap-4">
                <FaCheckCircle className="text-emerald-600 text-2xl" />

                <div className="min-w-0">
                  <p className="text-emerald-700 font-black">
                    Fichier sélectionné
                  </p>

                  <p className="text-slate-800 truncate">{file.name}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] transition text-white rounded-2xl p-5 font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <>
                  <FaSyncAlt className="animate-spin" />
                  Importation en cours...
                </>
              ) : (
                <>
                  <FaPlay />
                  Importer vers PostgreSQL
                </>
              )}
            </button>

            <div className="mt-6 rounded-[24px] bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-cyan-600" />

                <h3 className="font-black text-slate-900">
                  Contrôle qualité
                </h3>
              </div>

              <p className="text-sm text-slate-500 leading-7">
                Le pipeline lit le CSV, vérifie les champs obligatoires,
                insère les lignes valides et historise les lignes rejetées pour
                démontrer la traçabilité RNCP.
              </p>
            </div>
          </motion.div>

          {/* RESULT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-7 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Résultat du pipeline
                </h2>

                <p className="text-slate-500 mt-1">
                  Résultat du dernier import CSV exécuté.
                </p>
              </div>

              <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-4 py-2 rounded-full text-xs font-black">
                E1 Data Engineering
              </span>
            </div>

            {!result ? (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center bg-slate-50 rounded-[28px] border border-slate-200">
                <FaDatabase className="text-7xl text-slate-300 mb-5" />

                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Aucun import exécuté
                </h3>

                <p className="text-slate-500">
                  Importez un fichier CSV pour visualiser le résultat du pipeline.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard
                    title="Lignes lues"
                    value={resultTotal}
                    icon={<FaDatabase />}
                    color="bg-blue-50 text-blue-700"
                  />

                  <ResultCard
                    title="Validées"
                    value={resultInserted}
                    icon={<FaCheckCircle />}
                    color="bg-emerald-50 text-emerald-700"
                  />

                  <ResultCard
                    title="Rejetées"
                    value={resultRejected}
                    icon={<FaTimesCircle />}
                    color="bg-red-50 text-red-700"
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <PanelCard
                    title="Qualité du dernier import"
                    subtitle={`${currentSuccessRate}% de lignes validées`}
                  >
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={resultPieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={5}
                          >
                            {resultPieData.map((_item, index) => (
                              <Cell
                                key={index}
                                fill={resultColors[index % resultColors.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="Synthèse du traitement"
                    subtitle="Lues, validées et rejetées"
                  >
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={resultBarData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#0ea5e9"
                            radius={[12, 12, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </PanelCard>
                </div>

                <div className="rounded-[26px] bg-slate-950 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBolt className="text-cyan-300 text-2xl" />

                    <h3 className="text-2xl font-black">
                      Pipeline terminé avec succès
                    </h3>
                  </div>

                  <p className="text-slate-300 leading-7">
                    Les données valides sont maintenant stockées dans PostgreSQL
                    et visibles dans la page Jobs. L’import est historisé pour
                    assurer la traçabilité des traitements.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* HISTORY ANALYTICS */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <PanelCard
            title="Évolution des imports"
            subtitle="Historique des lignes lues, insérées et rejetées"
            className="xl:col-span-7"
          >
            {historyTrendData.length === 0 ? (
              <EmptyText text="Aucune donnée d’historique à afficher." />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyTrendData}>
                    <defs>
                      <linearGradient id="insertedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="inserted"
                      stroke="#10b981"
                      fill="url(#insertedGradient)"
                      strokeWidth={3}
                    />

                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stroke="#ef4444"
                      fill="#ef444422"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Synthèse RNCP E1"
            subtitle="Compétences démontrées dans le projet"
            className="xl:col-span-5"
          >
            <div className="space-y-3">
              <StatusLine
                icon={<FaFileCsv />}
                label="Collecte des données"
                value="CSV"
              />

              <StatusLine
                icon={<FaCogs />}
                label="Nettoyage / validation"
                value="Automatisé"
              />

              <StatusLine
                icon={<FaDatabase />}
                label="Stockage"
                value="PostgreSQL"
              />

              <StatusLine
                icon={<FaHistory />}
                label="Traçabilité"
                value="Historique"
              />

              <StatusLine
                icon={<FaServer />}
                label="Exploitation"
                value="Dashboard"
              />
            </div>
          </PanelCard>
        </div>

        {/* HISTORY TABLE */}
        <PanelCard
          title="Historique des imports PostgreSQL"
          subtitle="Historisation et traçabilité des pipelines exécutés"
        >
          {history.length === 0 ? (
            <div className="bg-slate-50 rounded-[28px] p-10 text-center border border-slate-200">
              <FaServer className="text-5xl text-slate-300 mx-auto mb-5" />

              <p className="text-slate-500 font-bold">
                Aucun historique disponible.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[24px] border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-400">
                      Fichier
                    </th>
                    <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-400">
                      Total
                    </th>
                    <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-400">
                      Insérées
                    </th>
                    <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-400">
                      Rejetées
                    </th>
                    <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-400">
                      Date
                    </th>
                    <th className="p-5 text-right text-xs uppercase tracking-[2px] text-slate-400">
                      Statut
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="p-5 font-black text-slate-900">
                        {item.filename}
                      </td>

                      <td className="p-5 font-bold text-slate-700">
                        {item.total_rows}
                      </td>

                      <td className="p-5 text-emerald-700 font-black">
                        {item.inserted_rows}
                      </td>

                      <td className="p-5 text-red-700 font-black">
                        {item.rejected_rows}
                      </td>

                      <td className="p-5 text-slate-500">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="p-5 text-right">
                        <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-black">
                          Traçable
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>
      </div>
    </DashboardLayout>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

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

function StatCard({
  title,
  value,
  icon,
  gradient,
  note,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string;
  note: string;
}) {
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

        <p className="text-white/70 text-xs mt-3 truncate">{note}</p>
      </div>
    </motion.div>
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

function ResultCard({
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
    <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-500 font-bold">{title}</p>

      <h3 className="text-4xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

function StatusLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="text-cyan-600">{icon}</div>

        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <span className="text-sm font-black text-emerald-600">{value}</span>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-5 text-sm text-slate-500 font-bold">
      {text}
    </div>
  );
}

export default DataPipeline;