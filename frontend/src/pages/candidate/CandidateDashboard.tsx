// ======================================================
// CANDIDATE DASHBOARD - SMARTRECRUIT AI
// Premium Candidate Space / Violet Indigo Career Design
// PDF Report Premium Version
// ======================================================

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import CandidateLayout from "../../layouts/CandidateLayout";
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
  FaBriefcase,
  FaRobot,
  FaMagic,
  FaRocket,
  FaDownload,
  FaClipboardCheck,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

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

// ======================================================
// COMPONENT
// ======================================================

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

  // ======================================================
  // API
  // ======================================================

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

  // ======================================================
  // ANALYZE CV
  // ======================================================

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
          "Veuillez détailler le poste visé ou les compétences recherchées."
        );
        return;
      }

      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jobContext", jobContext);

      setLoading(true);

      const response = await api.post<AnalysisResult>(
        "/cv/analyze-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

      fetchMyCVs();
      fetchStats();
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

  // ======================================================
  // PDF REPORT PREMIUM
  // ======================================================

  const handleDownloadReport = () => {
    if (!analysis) return;

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Veuillez autoriser les popups pour générer le rapport.");
      return;
    }

    const safe = (value?: string | number) => {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const score = Math.min(100, Math.max(0, Number(analysis.score || 0)));

    const scoreLabel =
      score >= 85
        ? "Excellent profil"
        : score >= 70
        ? "Profil intéressant"
        : score >= 50
        ? "Profil à approfondir"
        : "Profil à renforcer";

    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const renderTags = (
      items?: string[],
      type: "success" | "danger" = "success"
    ) => {
      if (!items || items.length === 0) {
        return `<p class="empty">Aucune donnée disponible.</p>`;
      }

      return items
        .map(
          (item) =>
            `<span class="tag ${
              type === "danger" ? "tag-danger" : "tag-success"
            }">${safe(item)}</span>`
        )
        .join("");
    };

    const renderAdvice = () => {
      if (!analysis.advice || analysis.advice.length === 0) {
        return "";
      }

      return `
        <div class="section">
          <h2 class="section-title">Conseils d’amélioration</h2>

          <div class="advice-list">
            ${analysis.advice
              .map(
                (item, index) => `
                  <div class="advice-item">
                    <div class="advice-number">${index + 1}</div>
                    <p>${safe(item)}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `;
    };

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>Rapport SmartRecruit AI</title>

          <style>
            @page {
              size: A4;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: Arial, Helvetica, sans-serif;
              color: #0f172a;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .report {
              width: 100%;
            }

            .cover {
              background: linear-gradient(135deg, #312e81, #7c3aed, #ec4899);
              color: white;
              border-radius: 28px;
              padding: 34px;
              position: relative;
              overflow: hidden;
            }

            .cover::before {
              content: "";
              position: absolute;
              width: 320px;
              height: 320px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.16);
              top: -120px;
              right: -120px;
            }

            .cover::after {
              content: "";
              position: absolute;
              width: 280px;
              height: 280px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.10);
              bottom: -120px;
              left: -100px;
            }

            .cover-content {
              position: relative;
              z-index: 2;
            }

            .topbar {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 20px;
            }

            .brand h1 {
              margin: 0;
              font-size: 34px;
              font-weight: 900;
              letter-spacing: -0.7px;
            }

            .brand p {
              margin: 8px 0 0 0;
              color: #fce7f3;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 3px;
              text-transform: uppercase;
            }

            .date-box {
              min-width: 150px;
              text-align: right;
              background: rgba(255, 255, 255, 0.14);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 18px;
              padding: 14px;
              font-size: 12px;
              font-weight: 800;
            }

            .hero-grid {
              display: grid;
              grid-template-columns: 1.35fr 0.75fr;
              gap: 26px;
              align-items: center;
              margin-top: 36px;
            }

            .candidate-name {
              font-size: 32px;
              font-weight: 900;
              margin: 0 0 10px 0;
              line-height: 1.2;
            }

            .candidate-title {
              color: #ede9fe;
              font-size: 16px;
              line-height: 1.7;
              margin: 0;
            }

            .decision-pill {
              display: inline-block;
              margin-top: 22px;
              background: rgba(255, 255, 255, 0.16);
              border: 1px solid rgba(255, 255, 255, 0.22);
              color: white;
              padding: 12px 18px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 900;
            }

            .score-card {
              background: white;
              color: #0f172a;
              border-radius: 26px;
              padding: 26px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(15, 23, 42, 0.24);
            }

            .score {
              color: #7c3aed;
              font-size: 68px;
              line-height: 1;
              font-weight: 900;
            }

            .score span {
              font-size: 28px;
            }

            .score-label {
              margin-top: 12px;
              color: #312e81;
              font-weight: 900;
              font-size: 14px;
            }

            .score-bar {
              margin-top: 18px;
              height: 10px;
              background: #e2e8f0;
              border-radius: 999px;
              overflow: hidden;
            }

            .score-fill {
              height: 100%;
              width: ${score}%;
              background: linear-gradient(90deg, #7c3aed, #ec4899);
              border-radius: 999px;
            }

            .section {
              margin-top: 22px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              padding: 22px;
              page-break-inside: avoid;
            }

            .section-title {
              margin: 0 0 16px 0;
              display: flex;
              align-items: center;
              gap: 10px;
              color: #312e81;
              font-size: 21px;
              font-weight: 900;
            }

            .section-title::before {
              content: "";
              width: 10px;
              height: 30px;
              border-radius: 999px;
              background: linear-gradient(180deg, #7c3aed, #ec4899);
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
            }

            .info-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 16px;
            }

            .info-label {
              color: #64748b;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }

            .info-value {
              color: #0f172a;
              font-size: 14px;
              font-weight: 900;
            }

            .paragraph {
              margin: 0;
              color: #334155;
              font-size: 14px;
              line-height: 1.8;
              white-space: pre-line;
            }

            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }

            .tag {
              display: inline-block;
              padding: 10px 14px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 900;
            }

            .tag-success {
              background: #ede9fe;
              color: #5b21b6;
              border: 1px solid #ddd6fe;
            }

            .tag-danger {
              background: #fee2e2;
              color: #b91c1c;
              border: 1px solid #fecaca;
            }

            .recommendation {
              background: linear-gradient(135deg, #f5f3ff, #fdf2f8);
              border: 1px solid #ddd6fe;
            }

            .advice-list {
              display: grid;
              gap: 12px;
            }

            .advice-item {
              display: flex;
              gap: 12px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 14px;
            }

            .advice-number {
              width: 30px;
              height: 30px;
              border-radius: 12px;
              background: #7c3aed;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              flex-shrink: 0;
            }

            .advice-item p {
              margin: 0;
              color: #334155;
              font-size: 13px;
              line-height: 1.7;
            }

            .empty {
              color: #64748b;
              font-weight: 700;
              margin: 0;
            }

            .footer {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              gap: 20px;
              color: #64748b;
              font-size: 11px;
              font-weight: 800;
            }

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>

        <body>
          <div class="report">
            <div class="cover">
              <div class="cover-content">
                <div class="topbar">
                  <div class="brand">
                    <h1>SmartRecruit AI</h1>
                    <p>Rapport professionnel d’analyse candidat</p>
                  </div>

                  <div class="date-box">
                    Généré le<br />
                    ${safe(currentDate)}
                  </div>
                </div>

                <div class="hero-grid">
                  <div>
                    <h2 class="candidate-name">
                      ${safe(analysis.name || "Candidat")}
                    </h2>

                    <p class="candidate-title">
                      ${safe(analysis.title || "Profil non renseigné")}
                    </p>

                    <div class="decision-pill">
                      ${safe(analysis.decision || "Décision RH non renseignée")}
                    </div>
                  </div>

                  <div class="score-card">
                    <div class="score">${score}<span>%</span></div>
                    <div class="score-label">${safe(scoreLabel)}</div>

                    <div class="score-bar">
                      <div class="score-fill"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Informations candidat</h2>

              <div class="info-grid">
                <div class="info-card">
                  <div class="info-label">Nom</div>
                  <div class="info-value">${safe(
                    analysis.name || "Non renseigné"
                  )}</div>
                </div>

                <div class="info-card">
                  <div class="info-label">Profil</div>
                  <div class="info-value">${safe(
                    analysis.title || "Non renseigné"
                  )}</div>
                </div>

                <div class="info-card">
                  <div class="info-label">Score IA</div>
                  <div class="info-value">${score}%</div>
                </div>

                <div class="info-card">
                  <div class="info-label">Décision RH</div>
                  <div class="info-value">${safe(
                    analysis.decision || "Non renseignée"
                  )}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Résumé IA</h2>
              <p class="paragraph">
                ${safe(analysis.summary || "Aucun résumé disponible.")}
              </p>
            </div>

            <div class="section">
              <h2 class="section-title">Compétences détectées</h2>
              <div class="tags">
                ${renderTags(analysis.skills, "success")}
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Compétences manquantes</h2>
              <div class="tags">
                ${
                  analysis.missingSkills?.length
                    ? renderTags(analysis.missingSkills, "danger")
                    : `<p class="empty">Aucune compétence manquante détectée.</p>`
                }
              </div>
            </div>

            <div class="section recommendation">
              <h2 class="section-title">Recommandation RH</h2>

              <p class="paragraph">
                ${safe(
                  analysis.hrRecommendation ||
                    "Aucune recommandation RH disponible."
                )}
              </p>
            </div>

            ${renderAdvice()}

            <div class="footer">
              <span>SmartRecruit AI • Rapport généré automatiquement</span>
              <span>Projet Mohamed Amine Essaouabi</span>
            </div>
          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  };

  // ======================================================
  // COMPUTED DATA
  // ======================================================

  const careerScore =
    stats.total > 0
      ? Math.min(95, 45 + stats.total * 7 + savedCVs.length * 5)
      : 35;

  const acceptanceRate =
    stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const progressSteps = [
    {
      label: "CV préparé",
      active: savedCVs.length > 0,
    },
    {
      label: "Candidatures envoyées",
      active: stats.total > 0,
    },
    {
      label: "Entretiens obtenus",
      active: stats.interview > 0,
    },
    {
      label: "Opportunités acceptées",
      active: stats.accepted > 0,
    },
  ];

  const analysisScore = analysis?.score || 0;

  const scoreGradient =
    analysisScore >= 75
      ? "from-emerald-400 to-green-600"
      : analysisScore >= 50
      ? "from-amber-400 to-orange-600"
      : "from-red-500 to-rose-600";

  // ======================================================
  // UI
  // ======================================================

  return (
    <CandidateLayout>
      <div className="space-y-7">
        {/* HERO CANDIDAT */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#312e81] via-[#6d28d9] to-[#db2777] p-8 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-pink-300/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-300/25 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaRocket className="text-pink-200" />

                <span className="text-xs uppercase tracking-[3px] font-black text-pink-100">
                  SmartRecruit Candidate Career Hub
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Pilotez votre carrière
                <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  avec une IA de recrutement
                </span>
              </h1>

              <p className="text-indigo-100 max-w-3xl mt-5 leading-7">
                Analysez votre CV, suivez vos candidatures, mesurez votre
                progression et améliorez vos chances avec des recommandations
                personnalisées.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="#cv-section"
                  className="bg-white text-violet-700 px-5 py-3 rounded-2xl font-black hover:bg-pink-50 transition flex items-center gap-2"
                >
                  <FaUpload />
                  Analyser mon CV
                </a>

                <a
                  href="/candidate-jobs"
                  className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl font-black hover:bg-white/20 transition flex items-center gap-2"
                >
                  <FaBriefcase />
                  Voir les offres
                </a>
              </div>
            </div>

            <div className="xl:col-span-5">
              <div className="rounded-[30px] bg-white/10 border border-white/10 p-6 backdrop-blur-xl">
                <p className="text-indigo-100 text-sm font-bold">
                  Score activité candidat
                </p>

                <div className="flex items-end gap-2 mt-4">
                  <span className="text-7xl font-black text-white">
                    {careerScore}
                  </span>

                  <span className="text-3xl font-black text-white mb-2">
                    %
                  </span>
                </div>

                <div className="h-3 bg-white/15 rounded-full mt-5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${careerScore}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <HeroMiniStat label="CV" value={savedCVs.length} />
                  <HeroMiniStat label="Candidatures" value={stats.total} />
                  <HeroMiniStat label="Acceptées" value={stats.accepted} />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Candidatures"
            value={stats.total}
            icon={<FaChartLine />}
            color="bg-indigo-50 text-indigo-700"
          />

          <MiniStat
            title="Acceptées"
            value={stats.accepted}
            icon={<FaCheckCircle />}
            color="bg-emerald-50 text-emerald-700"
          />

          <MiniStat
            title="Entretiens"
            value={stats.interview}
            icon={<FaCalendarCheck />}
            color="bg-violet-50 text-violet-700"
          />

          <MiniStat
            title="En attente"
            value={stats.pending}
            icon={<FaHourglassHalf />}
            color="bg-pink-50 text-pink-700"
          />
        </div>

        {/* PROGRESSION CARRIÈRE */}
        <PanelCard
          title="Progression de votre parcours candidat"
          subtitle="Suivez les étapes importantes de votre recherche"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {progressSteps.map((step, index) => (
              <motion.div
                key={step.label}
                whileHover={{ y: -4 }}
                className={`rounded-[24px] border p-5 ${
                  step.active
                    ? "bg-violet-50 border-violet-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${
                    step.active
                      ? "bg-violet-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.active ? <FaCheckCircle /> : <FaClockIcon />}
                </div>

                <p
                  className={`font-black ${
                    step.active ? "text-violet-900" : "text-slate-600"
                  }`}
                >
                  {index + 1}. {step.label}
                </p>
              </motion.div>
            ))}
          </div>
        </PanelCard>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* ANALYSE CV */}
          <motion.div
            id="cv-section"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-7 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-violet-600 to-pink-500 text-white flex items-center justify-center text-3xl shadow-lg">
                  <FaUpload />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Déposer mon CV pour analyse IA
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Importez votre CV PDF et indiquez le poste ciblé.
                  </p>
                </div>
              </div>

              <span className="bg-violet-50 text-violet-700 border border-violet-100 px-4 py-2 rounded-full text-xs font-black">
                PDF uniquement
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div>
                <label className="block border-2 border-dashed border-violet-300 bg-violet-50 hover:bg-violet-100 rounded-[28px] p-8 text-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={(event) =>
                      setCvFile(event.target.files?.[0] || null)
                    }
                    className="hidden"
                  />

                  <FaFilePdf className="text-6xl text-red-500 mx-auto mb-4" />

                  <h3 className="text-xl font-black text-slate-900">
                    Choisir un CV PDF
                  </h3>

                  <p className="text-slate-500 mt-2 text-sm">
                    Cliquez ici pour importer votre CV
                  </p>
                </label>

                {cvFile && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-[22px] p-4 flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-600 text-xl" />

                    <div className="min-w-0">
                      <p className="font-black text-emerald-700">
                        CV sélectionné
                      </p>

                      <p className="text-sm text-slate-700 truncate">
                        {cvFile.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-3">
                  Poste visé / compétences recherchées
                </label>

                <textarea
                  value={jobContext}
                  onChange={(event) => setJobContext(event.target.value)}
                  placeholder="Ex : Développeur React, Node.js, PostgreSQL, Docker..."
                  className="w-full h-[190px] border border-slate-200 rounded-[24px] p-5 bg-slate-50 focus:ring-4 focus:ring-violet-100 outline-none resize-none"
                />

                <button
                  type="button"
                  onClick={handleAnalyzeCV}
                  disabled={loading}
                  className="mt-4 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:scale-[1.01] transition text-white px-7 py-4 rounded-2xl font-black shadow-lg disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <FaRobot className="animate-pulse" />
                      Analyse IA en cours...
                    </>
                  ) : (
                    <>
                      <FaMagic />
                      Analyser mon CV
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 p-4 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-200">
                {errorMessage}
              </div>
            )}
          </motion.div>

          {/* SIDE CAREER */}
          <div className="xl:col-span-5 space-y-5">
            <PanelCard
              title="Résumé candidat"
              subtitle="Vue rapide de votre progression"
            >
              <div className="space-y-4">
                <StatusLine
                  icon={<FaFilePdf />}
                  label="CV sauvegardés"
                  value={`${savedCVs.length}`}
                />

                <StatusLine
                  icon={<FaBriefcase />}
                  label="Candidatures envoyées"
                  value={`${stats.total}`}
                />

                <StatusLine
                  icon={<FaCalendarCheck />}
                  label="Entretiens"
                  value={`${stats.interview}`}
                />

                <StatusLine
                  icon={<FaStar />}
                  label="Taux d’acceptation"
                  value={`${acceptanceRate}%`}
                />
              </div>
            </PanelCard>

            <PanelCard title="Conseil IA candidat" subtitle="Optimisation carrière">
              <div className="rounded-[24px] bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FaLightbulb className="text-violet-700 text-2xl" />

                  <h3 className="font-black text-violet-900">
                    Améliorez votre matching
                  </h3>
                </div>

                <p className="text-sm text-violet-900 leading-7">
                  Ajoutez un contexte précis avant l’analyse : poste visé,
                  technologies demandées et niveau attendu. Plus le contexte est
                  détaillé, plus le score IA sera pertinent.
                </p>
              </div>
            </PanelCard>
          </div>
        </div>

        {/* CV SAUVEGARDÉS */}
        <PanelCard
          title="Mes CV sauvegardés"
          subtitle="CV disponibles pour vos prochaines candidatures"
          action={
            <span className="bg-violet-50 text-violet-700 border border-violet-100 px-4 py-2 rounded-full text-xs font-black">
              {savedCVs.length} CV
            </span>
          }
        >
          {savedCVs.length === 0 ? (
            <EmptyState
              icon={<FaFilePdf />}
              title="Aucun CV sauvegardé"
              text="Analysez votre premier CV pour le sauvegarder automatiquement."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCVs.map((cv) => (
                <motion.div
                  key={cv.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-[24px] bg-slate-50 border border-slate-200 p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl shrink-0">
                      <FaFilePdf />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 truncate">
                        {cv.file_name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Ajouté le{" "}
                        {new Date(cv.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full text-xs font-black shrink-0">
                    Prêt
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </PanelCard>

        {/* RESULT ANALYSIS */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-4 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#312e81] via-[#6d28d9] to-[#db2777] p-7 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <p className="text-pink-100 uppercase tracking-[3px] text-xs font-black">
                    Résultat CV
                  </p>

                  <h2 className="text-3xl font-black mt-3">
                    Score IA du CV
                  </h2>

                  <div
                    className={`w-40 h-40 rounded-full bg-gradient-to-br ${scoreGradient} p-[6px] shadow-xl mt-7`}
                  >
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-900">
                        {analysis.score}
                      </span>

                      <span className="text-sm font-black text-slate-500">
                        IA %
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 font-black text-white">
                    {analysis.decision}
                  </p>

                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="mt-6 bg-white text-violet-700 px-5 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 hover:bg-pink-50 transition"
                  >
                    <FaDownload />
                    Rapport PDF
                  </button>
                </div>
              </div>

              <div className="xl:col-span-8 rounded-[32px] bg-white p-7 shadow-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <FaClipboardCheck className="text-violet-700 text-2xl" />

                  <h2 className="text-3xl font-black text-slate-900">
                    Résumé intelligent
                  </h2>
                </div>

                <p className="text-slate-600 leading-8 whitespace-pre-line">
                  {analysis.summary}
                </p>

                {analysis.hrRecommendation && (
                  <div className="mt-6 rounded-[24px] bg-violet-50 border border-violet-100 p-5">
                    <h3 className="font-black text-violet-900 flex items-center gap-2 mb-3">
                      <FaUserTie />
                      Recommandation RH
                    </h3>

                    <p className="text-violet-900 leading-7">
                      {analysis.hrRecommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <AnalysisCard
                title="Compétences détectées"
                icon={<FaCheckCircle />}
                color="emerald"
              >
                <Tags
                  items={analysis.skills}
                  empty="Aucune compétence détectée."
                  type="success"
                />
              </AnalysisCard>

              <AnalysisCard
                title="Compétences manquantes"
                icon={<FaTimesCircle />}
                color="red"
              >
                {analysis.missingSkills?.length === 0 ? (
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-black">
                    Aucune compétence manquante
                  </span>
                ) : (
                  <Tags
                    items={analysis.missingSkills}
                    empty="Aucune compétence manquante."
                    type="danger"
                  />
                )}
              </AnalysisCard>

              <AnalysisCard
                title="Recommandations IA"
                icon={<FaLightbulb />}
                color="amber"
              >
                {analysis.advice?.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.advice.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-amber-50 text-slate-700 p-4 text-sm font-medium leading-6"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    Aucune recommandation disponible.
                  </p>
                )}
              </AnalysisCard>
            </div>
          </motion.div>
        )}
      </div>
    </CandidateLayout>
  );
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

function HeroMiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-indigo-100 mt-1">{label}</p>
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
        <div className="text-violet-600">{icon}</div>

        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <span className="text-sm font-black text-violet-700">{value}</span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] bg-slate-50 border border-dashed border-slate-300 p-10 text-center">
      <div className="text-5xl text-slate-300 mb-4 flex justify-center">
        {icon}
      </div>

      <h3 className="text-2xl font-black text-slate-900">{title}</h3>

      <p className="text-slate-500 mt-2">{text}</p>
    </div>
  );
}

function AnalysisCard({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: "emerald" | "red" | "amber";
  children: ReactNode;
}) {
  const styles = {
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-100",
    red: "text-red-700 bg-red-50 border-red-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
  };

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-lg border border-slate-200">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${styles[color]}`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-black text-slate-900">{title}</h3>
      </div>

      {children}
    </div>
  );
}

function Tags({
  items,
  empty,
  type,
}: {
  items: string[];
  empty: string;
  type: "success" | "danger";
}) {
  if (!items || items.length === 0) {
    return <p className="text-slate-500">{empty}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`px-4 py-2 rounded-full text-sm font-black ${
            type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function FaClockIcon() {
  return <FaShieldAlt />;
}

export default CandidateDashboard;