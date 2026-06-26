// ======================================================
// AUDIT LOGS PAGE - SMARTRECRUIT AI
// Clean Premium Version / Jury Ready
// ======================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaHistory,
  FaShieldAlt,
  FaDatabase,
  FaUserTie,
  FaSearch,
  FaSyncAlt,
  FaClock,
  FaServer,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFilter,
  FaFingerprint,
  FaLayerGroup,
  FaBolt,
  FaEye,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type AuditLog = {
  id: number;
  user_id: number | null;
  user_role: string | null;
  action: string;
  entity: string | null;
  entity_id: number | null;
  description: string | null;
  ip_address: string | null;
  created_at: string;
};

type AuditFilter = "all" | "created" | "updated" | "error" | "system";

// ======================================================
// COMPONENT
// ======================================================

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AuditFilter>("all");

  // ======================================================
  // API
  // ======================================================

  const fetchAuditLogs = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/audit");

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setLogs(data);
    } catch (error: any) {
      console.error("Erreur récupération audit logs :", error);

      alert(
        error.response?.data?.message ||
          "Erreur lors de la récupération des audit logs."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // ======================================================
  // HELPERS
  // ======================================================

  const getActionCategory = (action: string): AuditFilter => {
    if (action.includes("ERROR")) return "error";
    if (action.includes("UPDATED")) return "updated";
    if (action.includes("CREATED")) return "created";

    return "system";
  };

  const getActionLabel = (action: string) => {
    if (action === "APPLICATION_CREATED") return "Candidature créée";
    if (action === "APPLICATION_STATUS_UPDATED") return "Statut modifié";
    if (action === "APPLICATION_CREATE_ERROR") return "Erreur candidature";
    if (action === "APPLICATION_STATUS_UPDATE_ERROR") return "Erreur statut";
    if (action === "BACKEND_ERROR") return "Erreur backend";

    return action;
  };

  const getActionStyle = (action: string) => {
    if (action.includes("ERROR")) {
      return {
        badge: "bg-red-100 text-red-700 border-red-200",
        iconBox: "bg-red-100 text-red-700",
        line: "bg-red-500",
        icon: <FaExclamationTriangle />,
      };
    }

    if (action.includes("UPDATED")) {
      return {
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        iconBox: "bg-blue-100 text-blue-700",
        line: "bg-blue-500",
        icon: <FaSyncAlt />,
      };
    }

    if (action.includes("CREATED")) {
      return {
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        iconBox: "bg-emerald-100 text-emerald-700",
        line: "bg-emerald-500",
        icon: <FaCheckCircle />,
      };
    }

    return {
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      iconBox: "bg-slate-100 text-slate-700",
      line: "bg-slate-500",
      icon: <FaHistory />,
    };
  };

  const formatDate = (date?: string) => {
    if (!date) return "Non renseignée";

    return new Date(date).toLocaleString("fr-FR");
  };

  // ======================================================
  // DATA
  // ======================================================

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const value = search.toLowerCase();

      const matchesSearch =
        log.action?.toLowerCase().includes(value) ||
        log.entity?.toLowerCase().includes(value) ||
        log.description?.toLowerCase().includes(value) ||
        log.user_role?.toLowerCase().includes(value) ||
        log.ip_address?.toLowerCase().includes(value);

      const category = getActionCategory(log.action || "");

      const matchesFilter = filter === "all" || category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, search, filter]);

  const totalLogs = logs.length;

  const createdLogs = logs.filter((log) =>
    log.action.includes("CREATED")
  ).length;

  const updateLogs = logs.filter((log) =>
    log.action.includes("UPDATED")
  ).length;

  const errorLogs = logs.filter((log) =>
    log.action.includes("ERROR")
  ).length;

  const systemLogs = Math.max(
    0,
    totalLogs - createdLogs - updateLogs - errorLogs
  );

  const lastLog = logs[0];

  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#020617] via-[#041337] to-[#06384a] p-7 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaShieldAlt className="text-cyan-300" />

                <span className="text-xs uppercase tracking-[3px] font-black text-cyan-200">
                  SmartRecruit Audit Security
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Audit Logs
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  traçabilité & sécurité
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-4 leading-7">
                Suivi des actions sensibles dans SmartRecruit AI : créations de
                candidatures, modifications de statuts, erreurs backend,
                identité utilisateur, adresse IP et horodatage.
              </p>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Total logs" value={totalLogs} />
              <HeroMetric title="Créations" value={createdLogs} />
              <HeroMetric title="Modifications" value={updateLogs} />
              <HeroMetric title="Erreurs" value={errorLogs} />
            </div>
          </div>
        </motion.section>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Total logs"
            value={totalLogs}
            icon={<FaHistory />}
            color="bg-cyan-50 text-cyan-700"
          />

          <MiniStat
            title="Créations"
            value={createdLogs}
            icon={<FaCheckCircle />}
            color="bg-emerald-50 text-emerald-700"
          />

          <MiniStat
            title="Modifications"
            value={updateLogs}
            icon={<FaSyncAlt />}
            color="bg-blue-50 text-blue-700"
          />

          <MiniStat
            title="Erreurs"
            value={errorLogs}
            icon={<FaExclamationTriangle />}
            color="bg-red-50 text-red-700"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="xl:col-span-4 space-y-5">
            <PanelCard title="Recherche & filtres" subtitle="Filtrer les actions">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <FaSearch className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="Action, rôle, IP, entité..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FilterButton
                    label="Tous"
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                  />

                  <FilterButton
                    label="Créations"
                    active={filter === "created"}
                    onClick={() => setFilter("created")}
                  />

                  <FilterButton
                    label="Modifs"
                    active={filter === "updated"}
                    onClick={() => setFilter("updated")}
                  />

                  <FilterButton
                    label="Erreurs"
                    active={filter === "error"}
                    onClick={() => setFilter("error")}
                  />

                  <FilterButton
                    label="Système"
                    active={filter === "system"}
                    onClick={() => setFilter("system")}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchAuditLogs}
                  className="w-full px-4 py-3 rounded-2xl bg-[#050b16] text-white font-black text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>
              </div>
            </PanelCard>

            <PanelCard title="État audit" subtitle="Sécurité applicative">
              <div className="space-y-3">
                <StatusLine
                  icon={<FaDatabase />}
                  label="Stockage"
                  value="PostgreSQL"
                />

                <StatusLine
                  icon={<FaFingerprint />}
                  label="Traçabilité"
                  value="Active"
                />

                <StatusLine
                  icon={<FaServer />}
                  label="Backend"
                  value="Express"
                />

                <StatusLine
                  icon={<FaShieldAlt />}
                  label="Sécurité"
                  value={errorLogs === 0 ? "Stable" : "À vérifier"}
                />
              </div>
            </PanelCard>

            <PanelCard title="Dernier événement" subtitle="Action la plus récente">
              {!lastLog ? (
                <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-5 text-sm text-slate-500 font-bold">
                  Aucun événement pour le moment.
                </div>
              ) : (
                <div className="rounded-[22px] bg-cyan-50 border border-cyan-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBolt className="text-cyan-700" />

                    <h3 className="font-black text-cyan-900">
                      {getActionLabel(lastLog.action)}
                    </h3>
                  </div>

                  <p className="text-sm text-cyan-900 leading-7">
                    {lastLog.description ||
                      "Action enregistrée dans le système."}
                  </p>

                  <p className="text-xs text-cyan-700 font-black mt-4">
                    {formatDate(lastLog.created_at)}
                  </p>
                </div>
              )}
            </PanelCard>
          </div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-8">
            <PanelCard
              title="Flux d’audit"
              subtitle={`${filteredLogs.length} log(s) affiché(s)`}
              action={
                <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-4 py-2 rounded-full text-xs font-black">
                  Audit Trail
                </span>
              }
            >
              {loading && (
                <div className="bg-slate-50 rounded-[28px] p-12 text-center border border-slate-200">
                  <FaHistory className="text-6xl text-cyan-600 mx-auto mb-4 animate-pulse" />

                  <h2 className="text-2xl font-black text-slate-900">
                    Chargement des audit logs...
                  </h2>
                </div>
              )}

              {!loading && logs.length === 0 && (
                <div className="bg-slate-50 rounded-[28px] p-12 text-center border border-slate-200">
                  <FaDatabase className="text-6xl text-slate-300 mx-auto mb-4" />

                  <h2 className="text-2xl font-black text-slate-900">
                    Aucun audit log pour le moment
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Les actions importantes apparaîtront ici automatiquement.
                  </p>
                </div>
              )}

              {!loading && filteredLogs.length === 0 && logs.length > 0 && (
                <div className="bg-slate-50 rounded-[28px] p-12 text-center border border-slate-200">
                  <FaSearch className="text-6xl text-slate-300 mx-auto mb-4" />

                  <h2 className="text-2xl font-black text-slate-900">
                    Aucun résultat trouvé
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Essayez une autre recherche ou un autre filtre.
                  </p>
                </div>
              )}

              {!loading && filteredLogs.length > 0 && (
                <div className="space-y-4">
                  {filteredLogs.map((log, index) => {
                    const style = getActionStyle(log.action);

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                        whileHover={{ y: -3 }}
                        className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-1.5 ${style.line}`}
                        />

                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 pl-3">
                          <div className="flex items-start gap-4 min-w-0">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${style.iconBox}`}
                            >
                              {style.icon}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap gap-2 items-center mb-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-black border ${style.badge}`}
                                >
                                  {getActionLabel(log.action)}
                                </span>

                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black border border-slate-200">
                                  {log.entity || "system"}
                                </span>

                                {log.entity_id !== null &&
                                  log.entity_id !== undefined && (
                                    <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-black border border-violet-200">
                                      ID #{log.entity_id}
                                    </span>
                                  )}
                              </div>

                              <h2 className="text-lg font-black text-slate-900 leading-7">
                                {log.description ||
                                  "Action enregistrée dans le système."}
                              </h2>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                <InfoBox
                                  icon={<FaUserTie />}
                                  label="Utilisateur"
                                  value={
                                    log.user_id
                                      ? `ID ${log.user_id} - ${
                                          log.user_role || "role inconnu"
                                        }`
                                      : "Système"
                                  }
                                />

                                <InfoBox
                                  icon={<FaServer />}
                                  label="Adresse IP"
                                  value={log.ip_address || "Non renseignée"}
                                />

                                <InfoBox
                                  icon={<FaClock />}
                                  label="Date"
                                  value={formatDate(log.created_at)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-black text-sm flex items-center gap-2">
                              <FaEye />
                              Log #{log.id}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </PanelCard>
          </div>
        </div>

        {/* RNCP SUMMARY */}
        <PanelCard
          title="Synthèse RNCP — Audit & sécurité"
          subtitle="Cette page démontre la traçabilité des actions sensibles"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatusBox icon={<FaShieldAlt />} label="Sécurité" value="Audit" />
            <StatusBox icon={<FaDatabase />} label="Stockage" value="PostgreSQL" />
            <StatusBox icon={<FaUserTie />} label="Utilisateur" value="Identifié" />
            <StatusBox icon={<FaClock />} label="Horodatage" value="Présent" />
            <StatusBox icon={<FaLayerGroup />} label="Entité" value="Traçable" />
          </div>
        </PanelCard>
      </div>
    </DashboardLayout>
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
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
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
  action,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        {action}
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
          ? "bg-cyan-500 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
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

      <p className="text-sm font-black text-slate-800 mt-2 break-all">
        {value}
      </p>
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
      <div className="text-cyan-600 text-2xl mb-3">{icon}</div>

      <p className="text-slate-500 text-xs uppercase tracking-[2px] font-black">
        {label}
      </p>

      <h3 className="text-lg font-black text-slate-900 mt-2">{value}</h3>
    </div>
  );
}

export default AuditLogs;