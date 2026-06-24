import { useEffect, useState, type ReactNode } from "react";
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
} from "react-icons/fa";

type Application = {
  id: number;
  status: "pending" | "interview" | "accepted" | "rejected";
  ai_score: number;
  ai_summary: string;
  created_at: string;
  fullname: string;
  email: string;
  title: string;
  company: string;
  location: string;
  cv_name?: string;
};

function Candidates() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/applications");

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
    }
  };

  const updateStatus = async (
    applicationId: number,
    status: "pending" | "interview" | "accepted" | "rejected"
  ) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status,
      });

      fetchApplications();
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Erreur modification statut"
      );
    }
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

  const filteredApplications = applications.filter((application) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      application.fullname?.toLowerCase().includes(searchValue) ||
      application.email?.toLowerCase().includes(searchValue) ||
      application.title?.toLowerCase().includes(searchValue) ||
      application.company?.toLowerCase().includes(searchValue) ||
      application.location?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const averageScore =
    totalApplications > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + Number(app.ai_score || 0),
            0
          ) / totalApplications
        )
      : 0;

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
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-emerald-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-80px] w-96 h-96 bg-teal-600/20 blur-3xl rounded-full" />

          <div className="relative z-10 grid xl:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex bg-emerald-400/10 border border-emerald-400/20 text-emerald-200 px-4 py-2 rounded-full text-sm font-black">
                SmartRecruit AI Recruiter Hub
              </span>

              <h1 className="text-5xl font-black mt-6 leading-tight">
                Centre de recrutement intelligent.
              </h1>

              <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                Analysez les candidatures, priorisez les meilleurs profils et
                prenez des décisions RH avec l’intelligence artificielle.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={fetchApplications}
                  className="bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-300 transition"
                >
                  <FaSyncAlt />
                  Actualiser
                </button>

                <button
                  type="button"
                  className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-white/15 transition"
                >
                  <FaEye />
                  Voir candidats
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-6">
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

              <div className="h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-emerald-300 rounded-full"
                  style={{
                    width: `${averageScore}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/10 rounded-2xl p-3">
                  <h3 className="font-black text-xl">
                    {totalApplications}
                  </h3>

                  <p className="text-xs text-slate-300">
                    Candidatures
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-3">
                  <h3 className="font-black text-xl">
                    {acceptedCount}
                  </h3>

                  <p className="text-xs text-slate-300">
                    Acceptées
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-3">
                  <h3 className="font-black text-xl">
                    {interviewCount}
                  </h3>

                  <p className="text-xs text-slate-300">
                    Entretiens
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <StatCard
            title="Candidatures"
            value={totalApplications}
            icon={<FaUsers />}
            gradient="from-emerald-500 to-teal-700"
          />

          <StatCard
            title="Acceptées"
            value={acceptedCount}
            icon={<FaCheckCircle />}
            gradient="from-green-500 to-emerald-700"
          />

          <StatCard
            title="Entretiens"
            value={interviewCount}
            icon={<FaClock />}
            gradient="from-cyan-500 to-blue-700"
          />

          <StatCard
            title="En attente"
            value={pendingCount}
            icon={<FaPaperPlane />}
            gradient="from-amber-400 to-orange-600"
          />

          <StatCard
            title="Refusées"
            value={rejectedCount}
            icon={<FaTimesCircle />}
            gradient="from-red-500 to-rose-700"
          />
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-5 border border-slate-200 shadow-xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Rechercher un candidat, une offre ou une entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
              <FaFilter className="text-slate-400" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none w-full"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="interview">Entretien</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaRobot className="text-6xl text-emerald-600 mx-auto mb-4 animate-pulse" />

            <h2 className="text-2xl font-black">
              Chargement des candidatures...
            </h2>
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-black">
              Aucune candidature pour le moment
            </h2>

            <p className="text-gray-500 mt-2">
              Lorsqu’un candidat postule, sa candidature apparaîtra ici.
            </p>
          </div>
        )}

        {!loading &&
          applications.length > 0 &&
          filteredApplications.length === 0 && (
            <div className="bg-white rounded-[32px] p-10 shadow-xl border text-center">
              <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />

              <h2 className="text-2xl font-black">
                Aucun résultat trouvé
              </h2>

              <p className="text-gray-500 mt-2">
                Essayez un autre mot-clé ou un autre statut.
              </p>
            </div>
          )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredApplications.map((application, index) => {
            const score = Number(application.ai_score || 0);

            return (
              <motion.div
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
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-400/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                        {application.fullname?.charAt(0) || "C"}
                      </div>

                      <div>
                        <h2 className="text-2xl font-black text-[#052e2b] flex items-center gap-2">
                          <FaUserTie className="text-emerald-600" />
                          {application.fullname || "Candidat"}
                        </h2>

                        <p className="text-gray-500 flex items-center gap-2 mt-2">
                          <FaEnvelope />
                          {application.email || "Email non renseigné"}
                        </p>

                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                            IA {score}%
                          </span>

                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black">
                            CV analysé
                          </span>

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                            {application.cv_name || "CV candidat"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-black ${getStatusBadge(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(application.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid lg:grid-cols-[1fr_120px] gap-5 items-center">
                    <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100">
                      <h3 className="font-black text-[#052e2b] flex items-center gap-2">
                        <FaBriefcase className="text-blue-600" />
                        {application.title}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Entreprise :{" "}
                        {application.company || "Non renseignée"}
                      </p>

                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {application.location || "Non renseignée"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div
                        className={`w-28 h-28 rounded-full bg-gradient-to-br ${getScoreGradient(
                          score
                        )} p-[5px] shadow-lg`}
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
                        <FaRobot className="text-emerald-600" />
                        Correspondance IA
                      </span>

                      <span className="font-black text-emerald-700">
                        {getDecisionLabel(score)}
                      </span>
                    </div>

                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getScoreGradient(
                          score
                        )} rounded-full`}
                        style={{
                          width: `${score}%`,
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "interview")
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2"
                    >
                      <FaClock />
                      Entretien
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "accepted")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Accepter
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(application.id, "rejected")
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-black transition flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle />
                      Refuser
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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

export default Candidates;