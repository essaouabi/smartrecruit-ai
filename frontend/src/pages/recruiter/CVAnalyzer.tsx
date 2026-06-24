// ===============================
// IMPORTS
// ===============================

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { motion } from "framer-motion";

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
} from "react-icons/fa";

// ===============================
// CV ANALYZER
// ===============================

const CVAnalyzer = () => {
  // ===============================
  // STATES
  // ===============================

  const [jobContext, setJobContext] = useState(
    localStorage.getItem("selectedJobContext") || ""
  );

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ===============================
  // HANDLE FILE UPLOAD
  // ===============================

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Veuillez importer uniquement un fichier PDF.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setResult(null);
  };

  // ===============================
  // ANALYZE CV
  // ===============================

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

      setResult(response.data);
      console.log("ANALYSE IA =", response.data);
      console.log("NOM DETECTE =", response.data.name);

      // ===============================
      // CLEAN NAME & SAVE CANDIDATE
      // ===============================

      const cleanName = response.data.name;

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
          : fileName
              .replace(".pdf", "")
              .replace(/[_-]/g, " ")
              .trim();

      await api.post("/candidates", {
        name: finalName,
        title: response.data.title,
        email: response.data.email,
        phone: response.data.phone,
        linkedin: response.data.linkedin,
        github: response.data.github,
        score: response.data.score,
        skills: response.data.skills || [],
        missingSkills: response.data.missingSkills || [],
        summary: response.data.summary,
        jobContext,
        strengths: response.data.strengths || [],
        weaknesses: response.data.weaknesses || [],
        advice: response.data.advice || [],
        profileLevel: response.data.title || "",
        yearsExperience: response.data.statistics?.yearsExperience || 0,
        interviewQuestions: response.data.interviewQuestions || [],
        hrRecommendation: response.data.hrRecommendation || ""
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

  // ===============================
  // SCORE COLOR
  // ===============================

  const score = result?.score || 0;

  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-orange-500"
      : "text-red-500";

  // ===============================
  // UI
  // ===============================

  return (
    <DashboardLayout>
      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] p-12 mb-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
      >
        <div className="absolute right-[-120px] top-[-120px] w-[320px] h-[320px] bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-full mb-6">
              <FaBrain className="text-green-300" />
              <span className="text-green-100 font-semibold">
                SmartRecruit AI Engine
              </span>
            </div>

            <h1 className="text-6xl font-black leading-tight mb-6">
              Analyseur CV IA
            </h1>

            <p className="text-green-100 text-lg leading-8 max-w-3xl">
              Analyse intelligente des CV avec matching RH, extraction automatique
              des compétences, scoring IA et recommandations recrutement.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8">
            <h3 className="text-2xl font-bold mb-6">Capacités IA</h3>

            <div className="space-y-4">
              {[
                "Analyse automatique PDF",
                "Matching candidat/offre",
                "Détection compétences",
                "Score IA intelligent",
                "Résumé RH généré",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 bg-white/10 rounded-2xl p-4"
                >
                  <FaCheckCircle className="text-green-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN */}

      <div className="grid grid-cols-2 gap-8">
        {/* LEFT PANEL */}

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-3xl shadow-xl">
              <FaCloudUploadAlt />
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#0b3d2e]">Import CV</h2>
              <p className="text-gray-500 mt-1">PDF uniquement</p>
            </div>
          </div>

          {/* UPLOAD */}

          <label className="block border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-[32px] p-12 text-center cursor-pointer transition-all duration-300 mb-8">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FaFilePdf className="mx-auto text-7xl text-red-500 mb-6" />
            <h3 className="font-black text-[#0b3d2e] text-2xl mb-3">
              Sélectionner un CV PDF
            </h3>
            <p className="text-gray-500">
              Cliquez ici pour importer un CV candidat
            </p>
          </label>

          {/* FILE */}

          {fileName && (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-5 mb-8 flex items-center gap-4">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <div>
                <p className="text-green-700 font-bold">CV importé</p>
                <p className="text-[#0b3d2e]">{fileName}</p>
              </div>
            </div>
          )}

          {/* JOB CONTEXT */}

          <div className="mb-6">
            <label className="block mb-4 font-bold text-[#0b3d2e] text-lg">
              Besoins de l’entreprise
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 h-48 outline-none focus:ring-4 focus:ring-green-200 transition"
              placeholder="Exemple : React, Node.js, PostgreSQL, Docker, API REST..."
              value={jobContext}
              onChange={(e) => setJobContext(e.target.value)}
            />
          </div>

          {/* BUTTON */}

          <button
            onClick={handleAnalyze}
            disabled={loading || !selectedFile}
            className="w-full bg-gradient-to-r from-[#062c22] to-[#0b3d2e] hover:scale-[1.01] transition-all duration-300 text-white p-6 rounded-3xl font-black text-xl disabled:opacity-50 shadow-xl"
          >
            {loading ? "Analyse IA en cours..." : "Lancer Analyse IA"}
          </button>
        </motion.div>

        {/* RIGHT PANEL */}

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
        >
          {!result ? (
            <div className="min-h-[700px] flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 rounded-[36px] bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-5xl mb-8 shadow-xl">
                <FaRobot />
              </div>
              <h2 className="text-4xl font-black text-[#0b3d2e] mb-4">
                Résultat IA
              </h2>
              <p className="text-gray-500 max-w-lg leading-8 text-lg">
                Importez un CV PDF afin d’obtenir une analyse RH intelligente, un
                score IA et un matching recrutement.
              </p>
            </div>
          ) : (
            <div>
              {/* HEADER */}

              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-5xl font-black text-[#0b3d2e]">
                    {result.name || "Nom non détecté"}
                  </h2>
                  <p className="text-gray-500 mt-3 text-xl">
                    {result.title || "Profil détecté automatiquement"}
                  </p>
                </div>

                {/* SCORE */}

                <div className="relative">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-inner border-[8px] border-green-500">
                    <div className="text-center">
                      <h3 className={`text-5xl font-black ${scoreColor}`}>
                        {score}%
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Matching IA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT */}

              <div className="grid grid-cols-2 gap-5 mb-10">
                {[
                  {
                    icon: <FaUserTie />,
                    label: "Email",
                    value: result.email || "Non renseigné",
                    color: "text-green-700",
                  },
                  {
                    icon: <FaPhone />,
                    label: "Téléphone",
                    value: result.phone || "Non renseigné",
                    color: "text-blue-700",
                  },
                  {
                    icon: <FaLinkedin />,
                    label: "LinkedIn",
                    value: result.linkedin || "Non renseigné",
                    color: "text-blue-600",
                  },
                  {
                    icon: <FaGithub />,
                    label: "GitHub",
                    value: result.github || "Non renseigné",
                    color: "text-gray-700",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 hover:bg-green-50 transition rounded-3xl p-5"
                  >
                    <div className={`${item.color} text-2xl mb-3`}>
                      {item.icon}
                    </div>
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <h3 className="font-bold text-[#0b3d2e] break-all mt-1">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}

              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-3xl p-6 mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <FaMagic className="text-green-700 text-2xl" />
                  <h3 className="font-black text-green-700 text-2xl">
                    Résumé IA
                  </h3>
                </div>
                <p className="text-gray-700 leading-8 text-lg">
                  {result.summary}
                </p>
              </div>

              {/* SKILLS */}

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <FaChartLine className="text-green-700 text-2xl" />
                  <h3 className="font-black text-2xl text-[#0b3d2e]">
                    Compétences détectées
                  </h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {result.skills?.length > 0 ? (
                    result.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      Aucune compétence détectée
                    </span>
                  )}
                </div>
              </div>

              {/* MISSING */}

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <FaStar className="text-red-500 text-2xl" />
                  <h3 className="font-black text-2xl text-[#0b3d2e]">
                    Compétences manquantes
                  </h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {result.missingSkills?.length === 0 ? (
                    <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
                      Aucune compétence manquante
                    </span>
                  ) : (
                    result.missingSkills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-red-100 text-red-700 px-5 py-3 rounded-full font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CVAnalyzer;