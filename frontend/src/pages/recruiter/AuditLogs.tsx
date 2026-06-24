import { useEffect, useState, type ReactNode } from "react";
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
} from "react-icons/fa";

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

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);

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
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const value = search.toLowerCase();

    return (
      log.action?.toLowerCase().includes(value) ||
      log.entity?.toLowerCase().includes(value) ||
      log.description?.toLowerCase().includes(value) ||
      log.user_role?.toLowerCase().includes(value) ||
      log.ip_address?.toLowerCase().includes(value)
    );
  });

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
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (action.includes("UPDATED")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (action.includes("CREATED")) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getActionIcon = (action: string) => {
    if (action.includes("ERROR")) {
      return <FaExclamationTriangle />;
    }

    if (action.includes("UPDATED")) {
      return <FaSyncAlt />;
    }

    if (action.includes("CREATED")) {
      return <FaCheckCircle />;
    }

    return <FaHistory />;
  };

  const totalLogs = logs.length;

  const updateLogs = logs.filter((log) =>
    log.action.includes("UPDATED")
  ).length;

  const createdLogs = logs.filter((log) =>
    log.action.includes("CREATED")
  ).length;

  const errorLogs = logs.filter((log) =>
    log.action.includes("ERROR")
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-[-90px] right-[-90px] w-96 h-96 bg-emerald-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-90px] w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-200 px-4 py-2 rounded-full text-sm font-black">
                <FaShieldAlt />
                Traçabilité & sécurité
              </span>

              <h1 className="text-5xl font-black mt-6 leading-tight">
                Audit Logs
              </h1>

              <p className="text-slate-300 mt-4 text-lg max-w-3xl">
                Suivi des actions importantes réalisées dans SmartRecruit AI :
                candidatures, changements de statut, erreurs backend et activité
                utilisateur.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAuditLogs}
              className="bg-emerald-400 text-slate-950 px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-300 transition"
            >
              <FaSyncAlt />
              Actualiser
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard
            title="Total logs"
            value={totalLogs}
            icon={<FaHistory />}
            gradient="from-emerald-500 to-teal-700"
          />

          <StatCard
            title="Créations"
            value={createdLogs}
            icon={<FaCheckCircle />}
            gradient="from-green-500 to-emerald-700"
          />

          <StatCard
            title="Modifications"
            value={updateLogs}
            icon={<FaSyncAlt />}
            gradient="from-blue-500 to-cyan-700"
          />

          <StatCard
            title="Erreurs"
            value={errorLogs}
            icon={<FaExclamationTriangle />}
            gradient="from-red-500 to-rose-700"
          />
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-5 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Rechercher par action, description, rôle, IP ou entité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaHistory className="text-6xl text-emerald-600 mx-auto mb-4 animate-pulse" />

            <h2 className="text-2xl font-black">
              Chargement des audit logs...
            </h2>
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaDatabase className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-black">
              Aucun audit log pour le moment
            </h2>

            <p className="text-gray-500 mt-2">
              Les actions importantes apparaîtront ici automatiquement.
            </p>
          </div>
        )}

        {!loading && filteredLogs.length === 0 && logs.length > 0 && (
          <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-black">
              Aucun résultat trouvé
            </h2>

            <p className="text-gray-500 mt-2">
              Essayez une autre recherche.
            </p>
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                }}
                className="bg-white rounded-[28px] p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition"
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#052e2b] text-white flex items-center justify-center text-2xl shadow-lg">
                      {getActionIcon(log.action)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-black border ${getActionStyle(
                            log.action
                          )}`}
                        >
                          {getActionLabel(log.action)}
                        </span>

                        <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-xs font-black border border-slate-200">
                          {log.entity || "system"}
                        </span>

                        {log.entity_id !== null &&
                          log.entity_id !== undefined && (
                            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-black border border-purple-200">
                              ID #{log.entity_id}
                            </span>
                          )}
                      </div>

                      <h2 className="text-xl font-black text-[#052e2b] mt-4">
                        {log.description ||
                          "Action enregistrée dans le système."}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-sm">
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
                          value={
                            log.created_at
                              ? new Date(log.created_at).toLocaleString(
                                  "fr-FR"
                                )
                              : "Non renseignée"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
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
    >
      <div className="absolute top-[-40px] right-[-30px] w-32 h-32 bg-white/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="text-3xl mb-4 opacity-90">
          {icon}
        </div>

        <p className="text-white/80 text-sm font-bold">
          {title}
        </p>

        <h2 className="text-4xl font-black mt-1">
          {value}
        </h2>
      </div>
    </motion.div>
  );
}

type InfoBoxProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function InfoBox({
  icon,
  label,
  value,
}: InfoBoxProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 text-slate-500 font-bold">
        {icon}
        <span>{label}</span>
      </div>

      <p className="font-black text-[#052e2b] mt-2 break-all">
        {value}
      </p>
    </div>
  );
}

export default AuditLogs;