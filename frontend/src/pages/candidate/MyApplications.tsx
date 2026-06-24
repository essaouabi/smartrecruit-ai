import { useEffect, useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";

import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

type Application = {
  id: number;
  status: "pending" | "interview" | "accepted" | "rejected";
  ai_score: number;
  ai_summary: string;
  created_at: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      const response = await api.get("/applications/my-applications");
      setApplications(response.data);
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

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const getStatusInfo = (status: string) => {
    if (status === "accepted") {
      return {
        label: "Accepté",
        icon: <FaCheckCircle />,
        color: "text-emerald-600 bg-emerald-100",
      };
    }
    if (status === "rejected") {
      return {
        label: "Refusé",
        icon: <FaTimesCircle />,
        color: "text-red-600 bg-red-100",
      };
    }
    if (status === "interview") {
      return {
        label: "Entretien",
        icon: <FaCheckCircle />,
        color: "text-blue-600 bg-blue-100",
      };
    }
    return {
      label: "En attente",
      icon: <FaClock />,
      color: "text-yellow-600 bg-yellow-100",
    };
  };

  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* 1. Nouveau Header */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-10 text-white shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-bold">
              SmartRecruit AI Tracking
            </span>

            <h1 className="text-5xl font-black mt-5">
              Mes candidatures
            </h1>

            <p className="text-slate-300 mt-4 text-lg">
              Suivez vos candidatures en temps réel et consultez
              les décisions des recruteurs.
            </p>
          </div>
        </div>

        {/* 2. Statistiques */}
        {!loading && (
          <div className="grid md:grid-cols-4 gap-5">
            <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <p>Total</p>
              <h2 className="text-4xl font-black">{applications.length}</h2>
            </div>
            <div className="rounded-3xl p-6 bg-gradient-to-r from-emerald-500 to-green-700 text-white">
              <p>Acceptées</p>
              <h2 className="text-4xl font-black">
                {applications.filter((a) => a.status === "accepted").length}
              </h2>
            </div>
            <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-500 to-blue-700 text-white">
              <p>Entretiens</p>
              <h2 className="text-4xl font-black">
                {applications.filter((a) => a.status === "interview").length}
              </h2>
            </div>
            <div className="rounded-3xl p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <p>Refusées</p>
              <h2 className="text-4xl font-black">
                {applications.filter((a) => a.status === "rejected").length}
              </h2>
            </div>
          </div>
        )}

        {loading && <div className="bg-white rounded-3xl p-6 shadow-sm border">Chargement...</div>}

        <div className="grid gap-4">
          {applications.map((application) => {
            const statusInfo = getStatusInfo(application.status);
            return (
              <div
                key={application.id}
                className="group relative overflow-hidden rounded-[28px] bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-7"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                      <FaBriefcase />
                    </div>
                    <div>
                      <h2 className="text-xl font-black">{application.title}</h2>
                      <p className="text-gray-500">{application.company}</p>
                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <FaMapMarkerAlt /> {application.location}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 w-fit ${statusInfo.color}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                </div>

                {/* 4. Score IA */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Score IA</span>
                    <span>{application.ai_score || 82}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      style={{ width: `${application.ai_score || 82}%` }}
                    />
                  </div>
                </div>

                {/* 5. Résumé IA */}
                <div className="mt-5 bg-slate-50 rounded-2xl p-4">
                  <div className="mb-4">
                    <h3 className="font-black text-slate-800 mb-2">Analyse IA</h3>
                    <p className="text-slate-600 text-sm leading-7">
                      {application.ai_summary || "Votre profil correspond globalement aux attentes de cette offre."}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">{application.description}</p>
                </div>

                {/* 6. Timeline */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="h-[2px] flex-1 bg-green-500"></div>
                  <div className={`w-3 h-3 rounded-full ${application.status === "interview" || application.status === "accepted" ? "bg-blue-500" : "bg-slate-300"}`}></div>
                  <div className={`h-[2px] flex-1 ${application.status === "accepted" ? "bg-green-500" : "bg-slate-300"}`}></div>
                  <div className={`w-3 h-3 rounded-full ${application.status === "accepted" ? "bg-green-500" : "bg-slate-300"}`}></div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                  <FaCalendarAlt />
                  Candidature envoyée le {new Date(application.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CandidateLayout>
  );
}

export default MyApplications;