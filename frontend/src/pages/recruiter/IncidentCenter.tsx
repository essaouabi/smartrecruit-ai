// ======================================================
// INCIDENT CENTER - SMARTRECRUIT AI
// Premium Incident Management Center
// ======================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaBug,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFire,
  FaRobot,
  FaServer,
  FaDatabase,
  FaCode,
  FaShieldAlt,
  FaSyncAlt,
  FaTrash,
  FaEye,
  FaTools,
  FaPlus,
  FaSearch,
  FaTimes,
  FaBolt,
  FaChartLine,
  FaClipboardCheck,
  FaTerminal,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type IncidentStatus = "open" | "investigating" | "resolved";
type IncidentSeverity = "low" | "medium" | "high" | "critical";
type IncidentSource =
  | "backend"
  | "frontend"
  | "database"
  | "ai"
  | "api"
  | "monitoring"
  | "security"
  | "unknown";

type Incident = {
  id: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  entity?: string | null;
  entity_id?: number | null;
  detected_by?: string | null;
  root_cause?: string | null;
  solution?: string | null;
  technical_logs?: string | null;
  user_id?: number | null;
  user_role?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
};

type IncidentStats = {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  ai: number;
  backend: number;
  database: number;
  frontend: number;
  api: number;
};

type StatusFilter = "all" | IncidentStatus;
type SeverityFilter = "all" | IncidentSeverity;

// ======================================================
// COMPONENT
// ======================================================

function IncidentCenter() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<IncidentStats>({
    total: 0,
    open: 0,
    investigating: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    ai: 0,
    backend: 0,
    database: 0,
    frontend: 0,
    api: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );

  const [resolveForm, setResolveForm] = useState({
    root_cause: "",
    solution: "",
    technical_logs: "",
  });

  const [creatingDemo, setCreatingDemo] = useState(false);

  // ======================================================
  // API
  // ======================================================

  const fetchIncidents = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/incidents");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setIncidents(data);
    } catch (error: any) {
      console.error("Erreur récupération incidents :", error);
      alert(
        error.response?.data?.message ||
          "Erreur lors de la récupération des incidents."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/incidents/stats");

      setStats(response.data?.data || stats);
    } catch (error) {
      console.error("Erreur statistiques incidents :", error);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchIncidents(), fetchStats()]);
  };

  const createDemoIncident = async () => {
    try {
      setCreatingDemo(true);

      await api.post("/incidents/seed");

      await refreshAll();

      alert("Incident de démonstration créé avec succès.");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Erreur lors de la création de l’incident démo."
      );
    } finally {
      setCreatingDemo(false);
    }
  };

  const updateStatus = async (incidentId: number, status: IncidentStatus) => {
    try {
      await api.patch(`/incidents/${incidentId}/status`, {
        status,
      });

      await refreshAll();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du statut."
      );
    }
  };

  const resolveIncident = async () => {
    if (!selectedIncident) return;

    try {
      await api.patch(`/incidents/${selectedIncident.id}/resolve`, {
        root_cause:
          resolveForm.root_cause ||
          selectedIncident.root_cause ||
          "Cause analysée depuis l’Incident Center.",
        solution:
          resolveForm.solution ||
          selectedIncident.solution ||
          "Correction appliquée et incident marqué comme résolu.",
        technical_logs:
          resolveForm.technical_logs ||
          selectedIncident.technical_logs ||
          "Logs analysés depuis le monitoring SmartRecruit AI.",
      });

      setSelectedIncident(null);
      setResolveForm({
        root_cause: "",
        solution: "",
        technical_logs: "",
      });

      await refreshAll();

      alert("Incident marqué comme corrigé.");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Erreur lors de la résolution de l’incident."
      );
    }
  };

  const deleteIncident = async (incidentId: number) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet incident ?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/incidents/${incidentId}`);

      await refreshAll();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Erreur lors de la suppression de l’incident."
      );
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // ======================================================
  // HELPERS
  // ======================================================

  const getSeverityInfo = (severity: IncidentSeverity) => {
    if (severity === "critical") {
      return {
        label: "Critique",
        color: "bg-red-100 text-red-700 border-red-200",
        gradient: "from-red-600 to-rose-700",
        icon: <FaFire />,
      };
    }

    if (severity === "high") {
      return {
        label: "Haute",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        gradient: "from-orange-500 to-red-600",
        icon: <FaExclamationTriangle />,
      };
    }

    if (severity === "medium") {
      return {
        label: "Moyenne",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        gradient: "from-amber-400 to-orange-500",
        icon: <FaBolt />,
      };
    }

    return {
      label: "Basse",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      gradient: "from-blue-500 to-cyan-600",
      icon: <FaShieldAlt />,
    };
  };

  const getStatusInfo = (status: IncidentStatus) => {
    if (status === "resolved") {
      return {
        label: "Corrigé",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <FaCheckCircle />,
      };
    }

    if (status === "investigating") {
      return {
        label: "En analyse",
        color: "bg-violet-100 text-violet-700 border-violet-200",
        icon: <FaTools />,
      };
    }

    return {
      label: "Ouvert",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <FaClock />,
    };
  };

  const getSourceInfo = (source: IncidentSource) => {
    if (source === "ai") {
      return {
        label: "Service IA",
        icon: <FaRobot />,
        color: "text-violet-700 bg-violet-50",
      };
    }

    if (source === "database") {
      return {
        label: "Database",
        icon: <FaDatabase />,
        color: "text-emerald-700 bg-emerald-50",
      };
    }

    if (source === "frontend") {
      return {
        label: "Frontend",
        icon: <FaCode />,
        color: "text-blue-700 bg-blue-50",
      };
    }

    if (source === "api") {
      return {
        label: "API",
        icon: <FaTerminal />,
        color: "text-cyan-700 bg-cyan-50",
      };
    }

    if (source === "security") {
      return {
        label: "Sécurité",
        icon: <FaShieldAlt />,
        color: "text-red-700 bg-red-50",
      };
    }

    return {
      label: "Backend",
      icon: <FaServer />,
      color: "text-slate-700 bg-slate-100",
    };
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Non renseigné";

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // FILTERS
  // ======================================================

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const value = `
        ${incident.title || ""}
        ${incident.description || ""}
        ${incident.status || ""}
        ${incident.severity || ""}
        ${incident.source || ""}
        ${incident.entity || ""}
        ${incident.root_cause || ""}
        ${incident.solution || ""}
        ${incident.technical_logs || ""}
      `.toLowerCase();

      const matchesSearch = value.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || incident.status === statusFilter;

      const matchesSeverity =
        severityFilter === "all" || incident.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [incidents, search, statusFilter, severityFilter]);

  const resolvedRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const openRate =
    stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0;

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
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#020617] via-[#111827] to-[#7f1d1d] p-8 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-red-500/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-orange-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaBug className="text-red-200" />

                <span className="text-xs uppercase tracking-[3px] font-black text-red-100">
                  SmartRecruit AI · Incident Center
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Centre d’incidents
                <span className="block bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                  supervision & correction.
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-5 leading-7">
                Suivez les incidents techniques, analysez les causes, consultez
                les logs et marquez les corrections directement depuis
                SmartRecruit AI.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="button"
                  onClick={refreshAll}
                  disabled={refreshing}
                  className="bg-white text-slate-950 px-5 py-3 rounded-2xl font-black hover:bg-red-50 transition flex items-center gap-2 disabled:opacity-60"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>

                <button
                  type="button"
                  onClick={createDemoIncident}
                  disabled={creatingDemo}
                  className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl font-black hover:bg-white/20 transition flex items-center gap-2 disabled:opacity-60"
                >
                  <FaPlus />
                  Incident démo
                </button>
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Incidents" value={stats.total} />
              <HeroMetric title="Ouverts" value={stats.open} />
              <HeroMetric title="Corrigés" value={stats.resolved} />
              <HeroMetric title="Résolution" value={`${resolvedRate}%`} />
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Total incidents"
            value={stats.total}
            icon={<FaBug />}
            color="bg-slate-100 text-slate-700"
          />

          <MiniStat
            title="Ouverts"
            value={stats.open}
            icon={<FaClock />}
            color="bg-red-50 text-red-700"
          />

          <MiniStat
            title="En analyse"
            value={stats.investigating}
            icon={<FaTools />}
            color="bg-violet-50 text-violet-700"
          />

          <MiniStat
            title="Corrigés"
            value={stats.resolved}
            icon={<FaCheckCircle />}
            color="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* QUALITY PANEL */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <PanelCard title="Indice de stabilité" subtitle="Santé globale incidents">
            <div className="flex items-center gap-5">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-[5px]">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">
                    {100 - openRate}%
                  </span>
                  <span className="text-[10px] font-black text-slate-400">
                    Stable
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Supervision active
                </h3>

                <p className="text-slate-500 text-sm leading-7 mt-2">
                  Les incidents sont suivis, catégorisés et historisés dans
                  PostgreSQL.
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Sources principales" subtitle="Origine des incidents">
            <div className="space-y-3">
              <SourceLine label="Backend" value={stats.backend} />
              <SourceLine label="IA" value={stats.ai} />
              <SourceLine label="Database" value={stats.database} />
              <SourceLine label="API" value={stats.api} />
            </div>
          </PanelCard>

          <PanelCard title="Gravité" subtitle="Répartition par criticité">
            <div className="space-y-3">
              <SourceLine label="Critique" value={stats.critical} />
              <SourceLine label="Haute" value={stats.high} />
              <SourceLine label="Moyenne" value={stats.medium} />
              <SourceLine label="Basse" value={stats.low} />
            </div>
          </PanelCard>
        </div>

        {/* FILTERS */}
        <div className="rounded-[30px] bg-white border border-slate-200 shadow-lg p-5">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex-1 focus-within:ring-4 focus-within:ring-red-100 transition">
              <FaSearch className="text-red-600 text-xl" />

              <input
                type="text"
                placeholder="Rechercher par titre, source, gravité, cause, solution ou logs..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full outline-none bg-transparent text-slate-900"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Tous"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />

              <FilterButton
                label="Ouverts"
                active={statusFilter === "open"}
                onClick={() => setStatusFilter("open")}
              />

              <FilterButton
                label="Analyse"
                active={statusFilter === "investigating"}
                onClick={() => setStatusFilter("investigating")}
              />

              <FilterButton
                label="Corrigés"
                active={statusFilter === "resolved"}
                onClick={() => setStatusFilter("resolved")}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <SeverityButton
              label="Toutes gravités"
              active={severityFilter === "all"}
              onClick={() => setSeverityFilter("all")}
            />

            <SeverityButton
              label="Critique"
              active={severityFilter === "critical"}
              onClick={() => setSeverityFilter("critical")}
            />

            <SeverityButton
              label="Haute"
              active={severityFilter === "high"}
              onClick={() => setSeverityFilter("high")}
            />

            <SeverityButton
              label="Moyenne"
              active={severityFilter === "medium"}
              onClick={() => setSeverityFilter("medium")}
            />

            <SeverityButton
              label="Basse"
              active={severityFilter === "low"}
              onClick={() => setSeverityFilter("low")}
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <PanelCard title="Chargement" subtitle="Récupération des incidents">
            <div className="flex items-center gap-3 text-slate-500 font-bold">
              <FaSyncAlt className="animate-spin text-red-600" />
              Chargement des incidents...
            </div>
          </PanelCard>
        )}

        {/* EMPTY */}
        {!loading && filteredIncidents.length === 0 && (
          <PanelCard
            title="Aucun incident trouvé"
            subtitle="Aucun résultat ne correspond aux filtres"
          >
            <div className="text-center py-10">
              <FaClipboardCheck className="text-6xl text-slate-300 mx-auto mb-5" />

              <h2 className="text-2xl font-black text-slate-900">
                Aucun incident à afficher
              </h2>

              <p className="text-slate-500 mt-2">
                Créez un incident de démonstration ou modifiez les filtres.
              </p>

              <button
                type="button"
                onClick={createDemoIncident}
                disabled={creatingDemo}
                className="mt-6 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-4 rounded-2xl font-black inline-flex items-center gap-2 disabled:opacity-60"
              >
                <FaPlus />
                Créer un incident démo
              </button>
            </div>
          </PanelCard>
        )}

        {/* INCIDENT LIST */}
        {!loading && filteredIncidents.length > 0 && (
          <div className="grid grid-cols-1 gap-5">
            {filteredIncidents.map((incident, index) => {
              const severityInfo = getSeverityInfo(incident.severity);
              const statusInfo = getStatusInfo(incident.status);
              const sourceInfo = getSourceInfo(incident.source);

              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  whileHover={{ y: -5, scale: 1.003 }}
                  className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-lg border border-slate-200 hover:border-red-200 transition"
                >
                  <div className="absolute top-[-90px] right-[-90px] w-64 h-64 bg-red-500/10 blur-3xl rounded-full" />

                  <div className="relative z-10">
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${severityInfo.gradient} text-white flex items-center justify-center text-2xl shadow-lg shrink-0`}
                        >
                          {severityInfo.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black border ${severityInfo.color}`}
                            >
                              {severityInfo.label}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black border ${statusInfo.color}`}
                            >
                              <span className="inline-flex items-center gap-1">
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${sourceInfo.color}`}
                            >
                              <span className="inline-flex items-center gap-1">
                                {sourceInfo.icon}
                                {sourceInfo.label}
                              </span>
                            </span>
                          </div>

                          <h2 className="text-2xl font-black text-slate-900 leading-8">
                            {incident.title}
                          </h2>

                          <p className="text-slate-500 leading-7 mt-2 max-w-5xl">
                            {incident.description}
                          </p>

                          <div className="flex flex-wrap gap-3 mt-4">
                            <InfoBadge
                              label="Détecté par"
                              value={
                                incident.detected_by ||
                                "SmartRecruit Monitoring"
                              }
                            />

                            <InfoBadge
                              label="Créé le"
                              value={formatDate(incident.created_at)}
                            />

                            <InfoBadge
                              label="Mis à jour"
                              value={formatDate(incident.updated_at)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap xl:flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setResolveForm({
                              root_cause: incident.root_cause || "",
                              solution: incident.solution || "",
                              technical_logs: incident.technical_logs || "",
                            });
                          }}
                          className="bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl font-black hover:bg-slate-200 transition flex items-center gap-2"
                        >
                          <FaEye />
                          Détails
                        </button>

                        {incident.status === "open" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(incident.id, "investigating")
                            }
                            className="bg-violet-100 text-violet-700 px-4 py-3 rounded-2xl font-black hover:bg-violet-200 transition flex items-center gap-2"
                          >
                            <FaTools />
                            Analyser
                          </button>
                        )}

                        {incident.status !== "resolved" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIncident(incident);
                              setResolveForm({
                                root_cause: incident.root_cause || "",
                                solution: incident.solution || "",
                                technical_logs:
                                  incident.technical_logs || "",
                              });
                            }}
                            className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl font-black hover:bg-emerald-200 transition flex items-center gap-2"
                          >
                            <FaCheckCircle />
                            Corriger
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteIncident(incident.id)}
                          className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl font-black hover:bg-red-200 transition flex items-center gap-2"
                        >
                          <FaTrash />
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {(incident.root_cause || incident.solution) && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
                        <DetailBox
                          title="Cause identifiée"
                          text={
                            incident.root_cause ||
                            "Cause non renseignée pour le moment."
                          }
                        />

                        <DetailBox
                          title="Solution appliquée"
                          text={
                            incident.solution ||
                            "Solution non renseignée pour le moment."
                          }
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MODAL */}
        {selectedIncident && (
          <IncidentModal
            incident={selectedIncident}
            resolveForm={resolveForm}
            setResolveForm={setResolveForm}
            onClose={() => setSelectedIncident(null)}
            onResolve={resolveIncident}
            formatDate={formatDate}
            getSeverityInfo={getSeverityInfo}
            getStatusInfo={getStatusInfo}
            getSourceInfo={getSourceInfo}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// ======================================================
// MODAL
// ======================================================

function IncidentModal({
  incident,
  resolveForm,
  setResolveForm,
  onClose,
  onResolve,
  formatDate,
  getSeverityInfo,
  getStatusInfo,
  getSourceInfo,
}: {
  incident: Incident;
  resolveForm: {
    root_cause: string;
    solution: string;
    technical_logs: string;
  };
  setResolveForm: React.Dispatch<
    React.SetStateAction<{
      root_cause: string;
      solution: string;
      technical_logs: string;
    }>
  >;
  onClose: () => void;
  onResolve: () => void;
  formatDate: (date?: string | null) => string;
  getSeverityInfo: (severity: IncidentSeverity) => {
    label: string;
    color: string;
    gradient: string;
    icon: ReactNode;
  };
  getStatusInfo: (status: IncidentStatus) => {
    label: string;
    color: string;
    icon: ReactNode;
  };
  getSourceInfo: (source: IncidentSource) => {
    label: string;
    icon: ReactNode;
    color: string;
  };
}) {
  const severityInfo = getSeverityInfo(incident.severity);
  const statusInfo = getStatusInfo(incident.status);
  const sourceInfo = getSourceInfo(incident.source);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-[1050px] max-w-full rounded-[36px] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${severityInfo.gradient} p-7 text-white`}
        >
          <div className="absolute top-[-90px] right-[-90px] w-72 h-72 bg-white/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-5">
            <div>
              <p className="text-white/80 uppercase tracking-[3px] text-xs font-black">
                Incident #{incident.id}
              </p>

              <h2 className="text-4xl font-black mt-3">
                {incident.title}
              </h2>

              <div className="flex flex-wrap gap-3 mt-5">
                <ModalBadge icon={severityInfo.icon} text={severityInfo.label} />
                <ModalBadge icon={statusInfo.icon} text={statusInfo.label} />
                <ModalBadge icon={sourceInfo.icon} text={sourceInfo.label} />
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

        <div className="p-7 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-5">
            <PanelCard title="Description" subtitle="Incident détecté">
              <p className="text-slate-600 leading-8 whitespace-pre-line">
                {incident.description}
              </p>
            </PanelCard>

            <PanelCard title="Logs techniques" subtitle="Trace technique">
              <div className="rounded-[22px] bg-slate-950 text-slate-200 p-5 font-mono text-sm leading-7 max-h-[260px] overflow-y-auto">
                {incident.technical_logs ||
                  "Aucun log technique renseigné pour le moment."}
              </div>
            </PanelCard>

            <PanelCard title="Chronologie" subtitle="Suivi de l’incident">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoBox label="Créé le" value={formatDate(incident.created_at)} />
                <InfoBox
                  label="Mis à jour"
                  value={formatDate(incident.updated_at)}
                />
                <InfoBox
                  label="Corrigé le"
                  value={formatDate(incident.resolved_at)}
                />
              </div>
            </PanelCard>
          </div>

          <div className="xl:col-span-5 space-y-5">
            <PanelCard title="Correction" subtitle="Documenter la résolution">
              <div className="space-y-4">
                <InputArea
                  label="Cause racine"
                  value={resolveForm.root_cause}
                  onChange={(value) =>
                    setResolveForm((prev) => ({
                      ...prev,
                      root_cause: value,
                    }))
                  }
                  placeholder="Ex : réponse IA invalide, route backend non protégée..."
                />

                <InputArea
                  label="Solution appliquée"
                  value={resolveForm.solution}
                  onChange={(value) =>
                    setResolveForm((prev) => ({
                      ...prev,
                      solution: value,
                    }))
                  }
                  placeholder="Ex : validation JSON, fallback, correction SQL..."
                />

                <InputArea
                  label="Logs / preuve technique"
                  value={resolveForm.technical_logs}
                  onChange={(value) =>
                    setResolveForm((prev) => ({
                      ...prev,
                      technical_logs: value,
                    }))
                  }
                  placeholder="Ex : endpoint, stack trace, résultat test..."
                />

                <button
                  type="button"
                  onClick={onResolve}
                  disabled={incident.status === "resolved"}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl font-black hover:scale-[1.01] transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
                >
                  <FaCheckCircle />
                  {incident.status === "resolved"
                    ? "Déjà corrigé"
                    : "Marquer comme corrigé"}
                </button>
              </div>
            </PanelCard>

            <PanelCard title="Métadonnées" subtitle="Informations système">
              <div className="space-y-3">
                <StatusLine label="Source" value={incident.source} />
                <StatusLine label="Entité" value={incident.entity || "N/A"} />
                <StatusLine
                  label="Détecté par"
                  value={incident.detected_by || "Monitoring"}
                />
                <StatusLine
                  label="Rôle utilisateur"
                  value={incident.user_role || "N/A"}
                />
              </div>
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
      <p className="text-[10px] uppercase tracking-[3px] text-red-100 font-black">
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
          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function SeverityButton({
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
          ? "bg-slate-950 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-black">
        {label}
      </p>

      <p className="text-sm font-black text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function DetailBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
      <h3 className="font-black text-slate-900 mb-2">{title}</h3>

      <p className="text-slate-600 text-sm leading-7">{text}</p>
    </div>
  );
}

function SourceLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-200 p-4">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-4">
      <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black">
        {label}
      </p>

      <p className="text-sm font-black text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function InputArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block font-black text-slate-800 mb-2">{label}</label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-24 rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:ring-4 focus:ring-red-100 resize-none text-sm"
      />
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-200 p-4">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

export default IncidentCenter;