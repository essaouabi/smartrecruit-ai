// ======================================================
// CV ANALYZER - SMARTRECRUIT AI
// Premium / Modern / Jury Ready
// ======================================================

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  FaFilePdf,
  FaRobot,
  FaCheckCircle,
  FaUserTie,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaBrain,
  FaChartLine,
  FaMagic,
  FaCloudUploadAlt,
  FaStar,
  FaEnvelope,
  FaBriefcase,
  FaBolt,
  FaExclamationTriangle,
  FaSyncAlt,
  FaShieldAlt,
  FaClipboardCheck,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type AnalysisResult = {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  score?: number;
  summary?: string;
  skills?: string[];
  missingSkills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  advice?: string[];
  interviewQuestions?: string[];
  hrRecommendation?: string;
  statistics?: {
    yearsExperience?: number;
    detectedSkills?: number;
    matchingSkills?: number;
  };
};

// ======================================================
// COMPONENT
// ======================================================

const CVAnalyzer = () => {
  const [jobContext, setJobContext] = useState(
    localStorage.getItem("selectedJobContext") || ""
  );

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ======================================================
  // FILE UPLOAD
  // ======================================================

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Veuillez importer uniquement un fichier PDF.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setResult(null);
  };

  // ======================================================
  // ANALYZE CV
  // ======================================================

  const handleAnalyze = async () => {
    try {
      if (!selectedFile) {
        alert("Importez un CV PDF.");
        return;
      }

      if (jobContext.trim().length < 10) {
        alert("Veuillez renseigner les besoins de l’entreprise.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("jobContext", jobContext);

      const response = await api.post("/cv/analyze-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const analysis: AnalysisResult = response.data;

      setResult(analysis);

      const cleanName = analysis.name;

      const invalidNames = [
        "Centre d’interet",
        "Centre d'intérêt",
        "Centre d interet",
        "Centres d’intérêt",
        "Centres d'interet",
        "Loisirs",
        "Hobbies",
        "Contact",
        "Profil",
        "Compétences",
      ];

      const finalName =
        cleanName &&
        !invalidNames.some(
          (item) =>
            cleanName.toLowerCase().trim() === item.toLowerCase().trim()
        )
          ? cleanName
          : fileName.replace(".pdf", "").replace(/[_-]/g, " ").trim();

      await api.post("/candidates", {
        name: finalName,
        title: analysis.title,
        email: analysis.email,
        phone: analysis.phone,
        linkedin: analysis.linkedin,
        github: analysis.github,
        score: analysis.score,
        skills: analysis.skills || [],
        missingSkills: analysis.missingSkills || [],
        summary: analysis.summary,
        jobContext,
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        advice: analysis.advice || [],
        profileLevel: analysis.title || "",
        yearsExperience: analysis.statistics?.yearsExperience || 0,
        interviewQuestions: analysis.interviewQuestions || [],
        hrRecommendation: analysis.hrRecommendation || "",
      });
    } catch (error: any) {
      console.log(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erreur analyse CV");
      }

      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // COMPUTED DATA
  // ======================================================

  const score = result?.score || 0;

  const skills: string[] = Array.isArray(result?.skills) ? result.skills : [];
  const missingSkills: string[] = Array.isArray(result?.missingSkills)
    ? result.missingSkills
    : [];

  const strengths: string[] = Array.isArray(result?.strengths)
    ? result.strengths
    : [];

  const weaknesses: string[] = Array.isArray(result?.weaknesses)
    ? result.weaknesses
    : [];

  const advice: string[] = Array.isArray(result?.advice) ? result.advice : [];

  const interviewQuestions: string[] = Array.isArray(result?.interviewQuestions)
    ? result.interviewQuestions
    : [];

  const scoreColor =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
      ? "text-amber-500"
      : "text-red-500";

  const scoreGradient =
    score >= 80
      ? "from-emerald-400 to-green-600"
      : score >= 60
      ? "from-amber-400 to-orange-600"
      : "from-red-500 to-rose-700";

  const decisionLabel =
    score >= 80
      ? "Profil prioritaire"
      : score >= 60
      ? "Profil intéressant"
      : score >= 40
      ? "Profil à analyser"
      : "Faible correspondance";

  const skillsChartData = useMemo(
    () => [
      {
        name: "Compétences détectées",
        value: skills.length,
        color: "#10b981",
      },
      {
        name: "Compétences manquantes",
        value: missingSkills.length,
        color: "#ef4444",
      },
    ],
    [skills.length, missingSkills.length]
  );

  const scoreBarData = useMemo(
    () => [
      {
        name: "Score IA",
        value: score,
      },
      {
        name: "Compétences",
        value: Math.min(100, skills.length * 12),
      },
      {
        name: "Expérience",
        value: Math.min(
          100,
          Math.max(25, (result?.statistics?.yearsExperience || 0) * 15)
        ),
      },
      {
        name: "Matching",
        value: Math.max(0, score - missingSkills.length * 3),
      },
    ],
    [score, skills.length, missingSkills.length, result?.statistics]
  );

  const contextQuality = Math.min(100, Math.round(jobContext.length / 4));

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
                SmartRecruit AI • CV Analyzer
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Analyseur CV
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  matching candidat / offre
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-5 leading-7">
                Analyse intelligente des CV PDF avec extraction des informations,
                score IA, compétences détectées, écarts de matching et
                recommandation RH exploitable.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <HeroBadge icon={<FaFilePdf />} label="Analyse PDF" />
                <HeroBadge icon={<FaBrain />} label="Matching IA" />
                <HeroBadge icon={<FaClipboardCheck />} label="Sauvegarde candidat" />
              </div>
            </div>

            <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <HeroMetric title="CV sélectionné" value={selectedFile ? "Oui" : "Non"} />
              <HeroMetric title="Score IA" value={result ? `${score}%` : "--"} />
              <HeroMetric title="Compétences" value={skills.length} />
              <HeroMetric title="Contexte offre" value={`${contextQuality}%`} />
            </div>
          </div>
        </motion.section>

        {/* TOP KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Fichier PDF"
            value={selectedFile ? 1 : 0}
            icon={<FaFilePdf />}
            gradient="from-red-500 to-rose-600"
            note={fileName || "Aucun CV importé"}
          />

          <StatCard
            title="Score IA"
            value={result ? score : 0}
            icon={<FaRobot />}
            gradient="from-cyan-500 to-blue-600"
            note={result ? decisionLabel : "Analyse non lancée"}
          />

          <StatCard
            title="Compétences"
            value={skills.length}
            icon={<FaMagic />}
            gradient="from-emerald-500 to-green-600"
            note="Détectées automatiquement"
          />

          <StatCard
            title="Manquantes"
            value={missingSkills.length}
            icon={<FaExclamationTriangle />}
            gradient="from-amber-400 to-orange-600"
            note="Écarts par rapport à l’offre"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="xl:col-span-5 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-3xl shadow-lg">
                <FaCloudUploadAlt />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Importer un CV
                </h2>
                <p className="text-slate-500 mt-1">
                  Format accepté : PDF uniquement
                </p>
              </div>
            </div>

            <label className="block border-2 border-dashed border-cyan-300 bg-cyan-50 hover:bg-cyan-100 rounded-[28px] p-10 text-center cursor-pointer transition-all mb-6">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <FaFilePdf className="mx-auto text-7xl text-red-500 mb-5" />

              <h3 className="font-black text-slate-900 text-2xl mb-2">
                Sélectionner un CV PDF
              </h3>

              <p className="text-slate-500">
                Cliquez ici pour importer un CV candidat
              </p>
            </label>

            {fileName && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[24px] p-5 mb-6 flex items-center gap-4">
                <FaCheckCircle className="text-emerald-600 text-2xl" />

                <div className="min-w-0">
                  <p className="text-emerald-700 font-black">CV importé</p>
                  <p className="text-slate-800 truncate">{fileName}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-3 font-black text-slate-900 text-lg">
                Besoins de l’entreprise
              </label>

              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-5 h-48 outline-none focus:ring-4 focus:ring-cyan-100 transition"
                placeholder="Exemple : React, Node.js, PostgreSQL, Docker, API REST, AWS..."
                value={jobContext}
                onChange={(event) => setJobContext(event.target.value)}
              />

              <div className="mt-3">
                <div className="flex justify-between text-xs font-black text-slate-500 mb-2">
                  <span>Qualité du contexte</span>
                  <span>{contextQuality}%</span>
                </div>

                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${contextQuality}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] transition-all text-white p-5 rounded-2xl font-black text-lg disabled:opacity-50 shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <FaSyncAlt className="animate-spin" />
                  Analyse IA en cours...
                </>
              ) : (
                <>
                  <FaBolt />
                  Lancer Analyse IA
                </>
              )}
            </button>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="xl:col-span-7 bg-white rounded-[32px] p-6 shadow-xl border border-slate-200"
          >
            {!result ? (
              <div className="min-h-[620px] flex flex-col items-center justify-center text-center">
                <div className="w-28 h-28 rounded-[34px] bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-5xl mb-8 shadow-xl">
                  <FaRobot />
                </div>

                <h2 className="text-4xl font-black text-slate-900 mb-4">
                  Résultat IA
                </h2>

                <p className="text-slate-500 max-w-lg leading-8 text-lg">
                  Importez un CV PDF pour obtenir une analyse RH intelligente,
                  un score de matching, les compétences détectées et les
                  recommandations du moteur SmartRecruit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full">
                  <Capability icon={<FaFilePdf />} label="Lecture PDF" />
                  <Capability icon={<FaBrain />} label="Analyse IA" />
                  <Capability icon={<FaShieldAlt />} label="Données RH" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* RESULT HEADER */}
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div>
                    <p className="text-cyan-600 uppercase tracking-[3px] text-xs font-black mb-2">
                      Profil analysé
                    </p>

                    <h2 className="text-4xl font-black text-slate-900">
                      {result.name || "Nom non détecté"}
                    </h2>

                    <p className="text-slate-500 mt-2 text-lg">
                      {result.title || "Profil détecté automatiquement"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge color="cyan">{decisionLabel}</Badge>
                      <Badge color="emerald">{skills.length} compétences</Badge>
                      <Badge color="amber">
                        {result.statistics?.yearsExperience || 0} ans exp.
                      </Badge>
                    </div>
                  </div>

                  <div
                    className={`w-36 h-36 rounded-full bg-gradient-to-br ${scoreGradient} p-[6px] shadow-xl shrink-0`}
                  >
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <h3 className={`text-5xl font-black ${scoreColor}`}>
                        {score}%
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Matching IA
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ContactBox
                    icon={<FaEnvelope />}
                    label="Email"
                    value={result.email || "Non renseigné"}
                    color="text-emerald-600"
                  />

                  <ContactBox
                    icon={<FaPhone />}
                    label="Téléphone"
                    value={result.phone || "Non renseigné"}
                    color="text-blue-600"
                  />

                  <ContactBox
                    icon={<FaLinkedin />}
                    label="LinkedIn"
                    value={result.linkedin || "Non renseigné"}
                    color="text-blue-700"
                  />

                  <ContactBox
                    icon={<FaGithub />}
                    label="GitHub"
                    value={result.github || "Non renseigné"}
                    color="text-slate-700"
                  />
                </div>

                {/* SUMMARY */}
                <div className="bg-cyan-50 border border-cyan-100 rounded-[26px] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaMagic className="text-cyan-700 text-2xl" />
                    <h3 className="font-black text-cyan-900 text-2xl">
                      Résumé IA
                    </h3>
                  </div>

                  <p className="text-cyan-900 leading-8">
                    {result.summary ||
                      "Aucun résumé IA disponible pour cette analyse."}
                  </p>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <PanelCard
                    title="Compétences"
                    subtitle="Détectées vs manquantes"
                  >
                    <div className="h-[230px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={skillsChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={52}
                            outerRadius={82}
                            paddingAngle={5}
                          >
                            {skillsChartData.map((item) => (
                              <Cell key={item.name} fill={item.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </PanelCard>

                  <PanelCard title="Performance IA" subtitle="Score détaillé">
                    <div className="h-[230px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreBarData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
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

                {/* SKILLS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <PanelCard
                    title="Compétences détectées"
                    subtitle="Compétences extraites du CV"
                  >
                    <div className="flex flex-wrap gap-3">
                      {skills.length > 0 ? (
                        skills.map((skill) => (
                          <SkillBadge key={skill} type="success">
                            {skill}
                          </SkillBadge>
                        ))
                      ) : (
                        <EmptyText text="Aucune compétence détectée." />
                      )}
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="Compétences manquantes"
                    subtitle="Écarts par rapport au besoin"
                  >
                    <div className="flex flex-wrap gap-3">
                      {missingSkills.length === 0 ? (
                        <SkillBadge type="success">
                          Aucune compétence manquante
                        </SkillBadge>
                      ) : (
                        missingSkills.map((skill) => (
                          <SkillBadge key={skill} type="danger">
                            {skill}
                          </SkillBadge>
                        ))
                      )}
                    </div>
                  </PanelCard>
                </div>

                {/* STRENGTHS / WEAKNESSES */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <PanelCard title="Points forts" subtitle="Avantages du profil">
                    <BulletList
                      items={strengths}
                      emptyText="Aucun point fort généré."
                      icon={<FaCheckCircle />}
                      color="text-emerald-600"
                    />
                  </PanelCard>

                  <PanelCard
                    title="Points à améliorer"
                    subtitle="Faiblesses ou écarts identifiés"
                  >
                    <BulletList
                      items={weaknesses}
                      emptyText="Aucun point faible généré."
                      icon={<FaExclamationTriangle />}
                      color="text-amber-600"
                    />
                  </PanelCard>
                </div>

                {/* HR RECOMMENDATION */}
                <div className="bg-slate-950 rounded-[28px] p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUserTie className="text-cyan-300 text-2xl" />

                    <h3 className="text-2xl font-black">
                      Recommandation RH
                    </h3>
                  </div>

                  <p className="text-slate-300 leading-8">
                    {result.hrRecommendation ||
                      "Aucune recommandation RH générée pour ce profil."}
                  </p>
                </div>

                {/* ADVICE / QUESTIONS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <PanelCard
                    title="Conseils IA"
                    subtitle="Actions recommandées pour le recruteur"
                  >
                    <BulletList
                      items={advice}
                      emptyText="Aucun conseil généré."
                      icon={<FaStar />}
                      color="text-cyan-600"
                    />
                  </PanelCard>

                  <PanelCard
                    title="Questions d’entretien"
                    subtitle="Questions proposées par l’IA"
                  >
                    <BulletList
                      items={interviewQuestions}
                      emptyText="Aucune question générée."
                      icon={<FaBriefcase />}
                      color="text-violet-600"
                    />
                  </PanelCard>
                </div>
              </div>
            )}
          </motion.div>
        </div>
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

function Capability({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="rounded-[22px] bg-slate-50 border border-slate-200 p-4">
      <div className="text-cyan-600 text-2xl mb-3">{icon}</div>

      <p className="font-black text-slate-800">{label}</p>
    </div>
  );
}

function ContactBox({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-50 hover:bg-cyan-50 transition rounded-[22px] p-5 border border-slate-200">
      <div className={`${color} text-2xl mb-3`}>{icon}</div>

      <p className="text-slate-500 text-sm">{label}</p>

      <h3 className="font-black text-slate-900 break-all mt-1">{value}</h3>
    </div>
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
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: ReactNode;
  color: "cyan" | "emerald" | "amber";
}) {
  const styles = {
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black border ${styles[color]}`}
    >
      {children}
    </span>
  );
}

function SkillBadge({
  children,
  type,
}: {
  children: ReactNode;
  type: "success" | "danger";
}) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-black border ${
        type === "success"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-red-50 text-red-700 border-red-100"
      }`}
    >
      {children}
    </span>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] bg-slate-50 border border-slate-200 p-5 text-sm text-slate-500 font-bold">
      {text}
    </div>
  );
}

function BulletList({
  items,
  emptyText,
  icon,
  color,
}: {
  items: string[];
  emptyText: string;
  icon: ReactNode;
  color: string;
}) {
  if (items.length === 0) {
    return <EmptyText text={emptyText} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-start gap-3 rounded-[18px] bg-slate-50 border border-slate-200 p-4"
        >
          <div className={`${color} mt-1`}>{icon}</div>

          <p className="text-sm text-slate-700 leading-6">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default CVAnalyzer;