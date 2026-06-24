import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CandidateLayout from "../../layouts/CandidateLayout";
import PremiumStatCard from "../../components/PremiumStatCard";
import api from "../../services/api";

import {
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaUserTie,
  FaFilePdf,
  FaChartLine,
  FaCalendarCheck,
  FaHourglassHalf,
} from "react-icons/fa";

type AnalysisResult = {
  name: string;
  title: string;
  score: number;
  decision: string;
  summary: string;
  skills: string[];
  missingSkills: string[];
  advice: string[];
  hrRecommendation: string;
};

type Stats = {
  total: number;
  accepted: number;
  interview: number;
  pending: number;
  rejected: number;
};

type SavedCV = {
  id: number;
  file_name: string;
  created_at: string;
};

function CandidateDashboard() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobContext, setJobContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    accepted: 0,
    interview: 0,
    pending: 0,
    rejected: 0,
  });

  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);

  const handleAnalyzeCV = async () => {
    setErrorMessage(null);
    setAnalysis(null);

    try {
      if (!cvFile) {
        setErrorMessage("Veuillez choisir un CV au format PDF.");
        return;
      }

      if (jobContext.trim().length < 10) {
        setErrorMessage(
          "Veuillez détailler le poste visé ou les compétences recherchées (min. 10 caractères)."
        );
        return;
      }

      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jobContext", jobContext);

      setLoading(true);

      const response = await api.post<AnalysisResult>("/cv/analyze-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(response.data);

      await api.post("/cv/save-cv", {
        file_name: cvFile.name,
        cv_text:
          response.data.summary ||
          response.data.name ||
          "CV analysé par SmartRecruit AI",
      });

      setCvFile(null);
      setJobContext("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("CV analysé et sauvegardé avec succès.");

      fetchMyCVs();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'analyse du CV."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get<Stats>("/applications/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
    }
  };

  const fetchMyCVs = async () => {
    try {
      const response = await api.get<SavedCV[]>("/cv/my-cvs");
      setSavedCVs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des CVs:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMyCVs();
  }, []);

  const handleDownloadReport = () => {
    if (!analysis) return;
  
    const reportWindow = window.open("", "_blank");
  
    if (!reportWindow) {
      alert("Veuillez autoriser les popups pour générer le rapport.");
      return;
    }
  
    reportWindow.document.write(`
      <html>
        <head>
          <title>Rapport SmartRecruit AI</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; }
            h1 { color: #0f172a; }
            h2 { color: #1e40af; margin-top: 30px; }
            .score { font-size: 48px; font-weight: bold; color: #0891b2; }
            .box { border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-top: 20px; }
            .tag { display: inline-block; padding: 8px 12px; margin: 5px; border-radius: 20px; background: #e0f2fe; }
          </style>
        </head>
        <body>
          <h1>SMARTRECRUIT AI</h1>
          <h2>Rapport professionnel d'analyse candidat</h2>
  
          <div class="box">
            <p><strong>Nom :</strong> ${analysis.name || "Non renseigné"}</p>
            <p><strong>Profil :</strong> ${analysis.title || "Non renseigné"}</p>
            <p><strong>Décision RH :</strong> ${analysis.decision}</p>
            <p class="score">${analysis.score}%</p>
            <p><strong>SCORE IA</strong></p>
          </div>
  
          <div class="box">
            <h2>Résumé IA</h2>
            <p>${analysis.summary}</p>
          </div>
  
          <div class="box">
            <h2>Compétences détectées</h2>
            ${
              analysis.skills?.length > 0
                ? analysis.skills.map((s) => `<span class="tag">${s}</span>`).join("")
                : "<p>Aucune donnée disponible</p>"
            }
          </div>
  
          <div class="box">
            <h2>Compétences manquantes</h2>
            ${
              analysis.missingSkills?.length > 0
                ? analysis.missingSkills.map((s) => `<span class="tag">${s}</span>`).join("")
                : "<p>Aucune compétence manquante</p>"
            }
          </div>
  
          <div class="box">
            <h2>Recommandation RH</h2>
            <p>${analysis.hrRecommendation || "Aucune recommandation disponible."}</p>
          </div>
  
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
  
    reportWindow.document.close();
  };

  return (
    <CandidateLayout>
      <div className="space-y-6">
        
        {/* === NOUVEAU HEADER PREMIUM === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-cyan-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-80px] w-80 h-80 bg-blue-600/30 blur-3xl rounded-full" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex bg-white/10 border border-white/10 text-cyan-200 px-4 py-2 rounded-full text-sm font-bold">
                SmartRecruit AI Candidate Hub
              </span>

              <h1 className="text-5xl font-black mt-6 leading-tight">
                Pilotez votre carrière avec une IA de recrutement.
              </h1>

              <p className="text-slate-300 mt-5 text-lg max-w-xl">
                Analyse CV, suivi des candidatures, matching avec les offres et recommandations personnalisées.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href="#cv-section"
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 rounded-2xl font-black transition"
                >
                  Analyser mon CV
                </a>

                <a
                  href="/candidate-jobs"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl font-black transition"
                >
                  Voir les offres
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/10">
              <p className="text-slate-300 text-sm">Score activité candidat</p>

              <div className="flex items-end gap-3 mt-4">
                <span className="text-7xl font-black text-cyan-300">
                  {stats.total > 0 ? Math.min(95, 55 + stats.total * 5) : 40}
                </span>
                <span className="text-3xl font-black text-cyan-300 mb-2">%</span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-cyan-300 rounded-full"
                  style={{
                    width: `${stats.total > 0 ? Math.min(95, 55 + stats.total * 5) : 40}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-black">{stats.total}</p>
                  <p className="text-xs text-slate-300">Candidatures</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-black">{stats.accepted}</p>
                  <p className="text-xs text-slate-300">Acceptées</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-black">{savedCVs.length}</p>
                  <p className="text-xs text-slate-300">CV</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ================================ */}

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-5">
          <PremiumStatCard
            title="Candidatures"
            value={stats.total}
            icon={<FaChartLine />}
            gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
          />
          <PremiumStatCard
            title="Acceptées"
            value={stats.accepted}
            icon={<FaCheckCircle />}
            gradient="bg-gradient-to-br from-emerald-500 to-green-700"
          />
          <PremiumStatCard
            title="Entretiens"
            value={stats.interview}
            icon={<FaCalendarCheck />}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-700"
          />
          <PremiumStatCard
            title="En attente"
            value={stats.pending}
            icon={<FaHourglassHalf />}
            gradient="bg-gradient-to-br from-amber-400 to-orange-600"
          />
        </div>

        {/* Upload Section */}
        <motion.div
          id="cv-section"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-xl border border-slate-200"
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-slate-900">
              <FaUpload className="text-blue-600" />
              Déposer mon CV pour analyse IA
            </h2>

            <p className="text-slate-500 mb-6">
              Importez votre CV PDF et indiquez le poste ciblé pour obtenir une analyse intelligente.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="cv-upload" className="block font-bold mb-2">
                  CV PDF
                </label>

                <input
                  id="cv-upload"
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="job-context" className="block font-bold mb-2">
                  Poste visé / compétences recherchées
                </label>

                <input
                  id="job-context"
                  type="text"
                  value={jobContext}
                  onChange={(e) => setJobContext(e.target.value)}
                  placeholder="Ex: React Node.js PostgreSQL Docker"
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-200">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleAnalyzeCV}
              disabled={loading}
              className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-7 py-4 rounded-2xl font-black shadow-lg disabled:opacity-60 transition"
            >
              {loading ? "Analyse IA en cours..." : "Analyser mon CV"}
            </button>
          </div>
        </motion.div>

        {/* Saved CVs Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-xl border border-slate-200"
        >
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-red-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900">
                  <FaFilePdf className="text-red-600" />
                  Mes CV sauvegardés
                </h2>

                <p className="text-slate-500 mt-2">
                  Gérez les CV disponibles pour vos prochaines candidatures.
                </p>
              </div>

              <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold">
                {savedCVs.length} CV
              </span>
            </div>

            {savedCVs.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-8 text-center border border-dashed">
                <p className="text-gray-500">
                  Aucun CV sauvegardé pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedCVs.map((cv) => (
                  <motion.div
                    key={cv.id}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="flex items-center justify-between bg-slate-50 rounded-3xl p-5 border hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl">
                        <FaFilePdf />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {cv.file_name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Ajouté le{" "}
                          {new Date(cv.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                      Prêt à postuler
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis Results Section */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 text-white shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-6">
                    Score IA du CV
                  </h2>

                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-black text-cyan-300">
                      {analysis.score}
                    </span>
                    <span className="text-3xl font-black text-cyan-300 mb-2">
                      %
                    </span>
                  </div>

                  <div className="w-full h-3 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        analysis.score >= 70
                          ? "bg-emerald-400"
                          : analysis.score >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{
                        width: `${analysis.score}%`,
                      }}
                    />
                  </div>

                  <p className="mt-5 text-slate-200 font-bold">
                    {analysis.decision}
                  </p>

                  <button
                    onClick={handleDownloadReport}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 transition-colors"
                  >
                    <FaFilePdf />
                    Télécharger le rapport PDF
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-[32px] bg-white p-8 shadow-xl border border-slate-200">
                <h2 className="text-3xl font-black mb-4 text-slate-900">
                  Résumé intelligent
                </h2>

                <p className="text-slate-600 leading-8 whitespace-pre-line">
                  {analysis.summary}
                </p>
              </div>
            </div>

            {analysis.hrRecommendation && (
              <div className="rounded-[32px] bg-blue-50 p-7 shadow-sm border border-blue-100">
                <h2 className="text-2xl font-black text-blue-900 mb-3 flex items-center gap-3">
                  <FaUserTie />
                  Recommandation RH
                </h2>

                <p className="text-blue-900 leading-8">
                  {analysis.hrRecommendation}
                </p>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="rounded-[32px] bg-white p-7 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-black text-emerald-700 mb-5 flex items-center gap-3">
                  <FaCheckCircle />
                  Compétences détectées
                </h2>

                <div className="flex flex-wrap gap-2">
                  {analysis.skills?.length > 0 ? (
                    analysis.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">
                      Aucune compétence détectée.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-7 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-black text-red-600 mb-5 flex items-center gap-3">
                  <FaTimesCircle />
                  Compétences manquantes
                </h2>

                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills?.length === 0 ? (
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">
                      Aucune compétence manquante
                    </span>
                  ) : (
                    analysis.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-7 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-black text-yellow-600 mb-5 flex items-center gap-3">
                  <FaLightbulb />
                  Recommandations IA
                </h2>

                <ul className="space-y-3">
                  {analysis.advice?.length > 0 ? (
                    analysis.advice.map((item, index) => (
                      <li
                        key={index}
                        className="bg-yellow-50 text-slate-700 rounded-2xl p-3 font-medium"
                      >
                        💡 {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500">
                      Aucune recommandation disponible.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </CandidateLayout>
  );
}

export default CandidateDashboard;