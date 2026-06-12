
// ===============================
// IMPORTATIONS
// ===============================
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  FaUsers,
  FaSearch,
  FaRobot,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTrash,
  FaChartLine,
  FaStar,
  FaBrain,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaClipboardCheck,
  FaFilePdf,
} from "react-icons/fa";
// ===============================
// TYPE CANDIDAT
// ===============================
type Candidate = {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  score: number;
  skills: string;
  missing_skills: string;
  summary: string;
  job_context: string;
  decision?: string;
  decision_color?: string;
  created_at: string;
};
// ===============================
// COMPOSANT PRINCIPAL
// ===============================
const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  // ===============================
  // RÉCUPÉRATION DES CANDIDATS
  // ===============================
  const fetchCandidates = async () => {
    try {
      const response = await api.get("/candidates");
      setCandidates(response.data);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erreur récupération candidats");
      }
    } finally {
      setLoading(false);
    }
  };
  // ===============================
  // CHARGEMENT INITIAL
  // ===============================
  useEffect(() => {
    fetchCandidates();
  }, []);
  // ===============================
  // STYLE DÉCISION RH
  // ===============================
  const getDecision = (candidate: Candidate) => {
    if (candidate.decision && candidate.decision_color) {
      if (candidate.decision_color === "green") {
        return {
          label: candidate.decision,
          className: "bg-green-100 text-green-700",
          border: "border-green-500",
          text: "text-green-700",
        };
      }
      if (candidate.decision_color === "blue") {
        return {
          label: candidate.decision,
          className: "bg-blue-100 text-blue-700",
          border: "border-blue-500",
          text: "text-blue-700",
        };
      }
      if (candidate.decision_color === "yellow") {
        return {
          label: candidate.decision,
          className: "bg-yellow-100 text-yellow-700",
          border: "border-yellow-500",
          text: "text-yellow-700",
        };
      }
      if (candidate.decision_color === "red") {
        return {
          label: candidate.decision,
          className: "bg-red-100 text-red-700",
          border: "border-red-500",
          text: "text-red-700",
        };
      }
    }
    const score = candidate.score || 0;
    if (score >= 85) {
      return {
        label: "Excellent profil — recrutement recommandé",
        className: "bg-green-100 text-green-700",
        border: "border-green-500",
        text: "text-green-700",
      };
    }
    if (score >= 70) {
      return {
        label: "Bon profil — entretien conseillé",
        className: "bg-blue-100 text-blue-700",
        border: "border-blue-500",
        text: "text-blue-700",
      };
    }
    if (score >= 50) {
      return {
        label: "Profil moyen — CV à améliorer",
        className: "bg-yellow-100 text-yellow-700",
        border: "border-yellow-500",
        text: "text-yellow-700",
      };
    }
    return {
      label: "Profil faible — non recommandé",
      className: "bg-red-100 text-red-700",
      border: "border-red-500",
      text: "text-red-700",
    };
  };
  // ===============================
  // EXPORT PDF CANDIDAT
  // ===============================
  const exportCandidatePDF = (candidate: Candidate) => {
    const decision = getDecision(candidate);
    const doc = new jsPDF();
    const skills = candidate.skills
      ? candidate.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
      : [];
    const missingSkills = candidate.missing_skills
      ? candidate.missing_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
      : [];
    doc.setFillColor(11, 61, 46);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SmartRecruit AI", 20, 18);
    doc.setFontSize(11);
    doc.text("Rapport candidat intelligent", 20, 28);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Informations candidat", 20, 50);
    doc.setFontSize(11);
    doc.text(`Nom : ${candidate.name || "Non renseigné"}`, 20, 65);
    doc.text(`Profil : ${candidate.title || "Non renseigné"}`, 20, 75);
    doc.text(`Email : ${candidate.email || "Non renseigné"}`, 20, 85);
    doc.text(`Téléphone : ${candidate.phone || "Non renseigné"}`, 20, 95);
    doc.text(`LinkedIn : ${candidate.linkedin || "Non renseigné"}`, 20, 105);
    doc.text(`GitHub : ${candidate.github || "Non renseigné"}`, 20, 115);
    doc.setFontSize(16);
    doc.text("Analyse IA", 20, 135);
    doc.setFontSize(11);
    doc.text(`Score IA : ${candidate.score}%`, 20, 150);
    doc.text(`Décision RH : ${decision.label}`, 20, 160);
    doc.setFontSize(16);
    doc.text("Résumé IA", 20, 180);
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(
      candidate.summary || "Aucun résumé disponible.",
      170
    );
    doc.text(summaryLines, 20, 190);
    let y = 200 + summaryLines.length * 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFontSize(16);
    doc.text("Compétences détectées", 20, y);
    y += 10;
    doc.setFontSize(11);
    const skillsLines = doc.splitTextToSize(
      skills.length > 0 ? skills.join(", ") : "Aucune compétence détectée",
      170
    );
    doc.text(skillsLines, 20, y);
    y += skillsLines.length * 5 + 15;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFontSize(16);
    doc.text("Compétences manquantes", 20, y);
    y += 10;
    doc.setFontSize(11);
    const missingLines = doc.splitTextToSize(
      missingSkills.length > 0
        ? missingSkills.join(", ")
        : "Aucune compétence manquante",
      170
    );
    doc.text(missingLines, 20, y);
    y += missingLines.length * 5 + 15;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFontSize(16);
    doc.text("Besoins entreprise", 20, y);
    y += 10;
    doc.setFontSize(11);
    const contextLines = doc.splitTextToSize(
      candidate.job_context || "Aucun contexte renseigné.",
      170
    );
    doc.text(contextLines, 20, y);
    doc.save(`rapport-candidat-${candidate.id}.pdf`);
  };
  // ===============================
  // SUPPRESSION CANDIDAT
  // ===============================
  const handleDeleteCandidate = async (id: number) => {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer ce candidat ?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/candidates/${id}`);
      fetchCandidates();
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erreur suppression candidat");
      }
    }
  };
  // ===============================
  // FILTRAGE DES CANDIDATS
  // ===============================
  const filteredCandidates = candidates.filter((candidate) => {
    const searchText = search.toLowerCase();
    const matchSearch =
      (candidate.name || "").toLowerCase().includes(searchText) ||
      (candidate.title || "").toLowerCase().includes(searchText) ||
      (candidate.email || "").toLowerCase().includes(searchText) ||
      (candidate.phone || "").toLowerCase().includes(searchText) ||
      (candidate.skills || "").toLowerCase().includes(searchText) ||
      (candidate.job_context || "").toLowerCase().includes(searchText) ||
      (candidate.decision || "").toLowerCase().includes(searchText);
    const matchScore =
      scoreFilter === "all" ||
      (scoreFilter === "excellent" && candidate.score >= 85) ||
      (scoreFilter === "good" &&
        candidate.score >= 70 &&
        candidate.score < 85) ||
      (scoreFilter === "medium" &&
        candidate.score >= 50 &&
        candidate.score < 70) ||
      (scoreFilter === "low" && candidate.score < 50);
    return matchSearch && matchScore;
  });
  // ===============================
  // STATISTIQUES
  // ===============================
  const excellentCount = candidates.filter(
    (candidate) => candidate.score >= 85
  ).length;
  const selectedCount = candidates.filter(
    (candidate) =>
      candidate.decision?.toLowerCase().includes("recommand") ||
      candidate.decision?.toLowerCase().includes("entretien")
  ).length;
  const averageScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce(
            (sum, candidate) => sum + Number(candidate.score || 0),
            0
          ) / candidates.length
        )
      : 0;
  const totalSkills = Array.from(
    new Set(
      candidates.flatMap((candidate) =>
        candidate.skills
          ? candidate.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill.length > 0)
          : []
      )
    )
  ).length;
  const statsCards = [
    {
      label: "Candidats",
      value: candidates.length,
      note: "Profils analysés",
      icon: <FaUsers />,
      gradient: "from-[#062c22] to-[#0b3d2e]",
    },
    {
      label: "Excellents",
      value: excellentCount,
      note: "Score ≥ 85%",
      icon: <FaStar />,
      gradient: "from-emerald-600 to-green-400",
    },
    {
      label: "À retenir",
      value: selectedCount,
      note: "Recommandés / entretien",
      icon: <FaClipboardCheck />,
      gradient: "from-blue-700 to-cyan-400",
    },
    {
      label: "Compétences",
      value: totalSkills,
      note: "Détectées par IA",
      icon: <FaBrain />,
      gradient: "from-purple-700 to-fuchsia-400",
    },
  ];
  // ===============================
  // AFFICHAGE
  // ===============================
  return (
    <DashboardLayout>
      {/* BANNIÈRE PRINCIPALE */}
      <motion.div
        initial={{
          opacity: 0,
          y: 35,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] p-10 mb-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
      >
        <div className="absolute right-[-100px] top-[-100px] w-[330px] h-[330px] bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-full mb-6">
              <FaRobot className="text-green-300" />
              <span className="text-green-100 font-semibold">
                SmartRecruit Candidate Intelligence
              </span>
            </div>
            <h1 className="text-6xl font-black mb-5">
              Candidats IA
            </h1>
            <p className="text-green-100 text-lg leading-8 max-w-3xl">
              Visualisez les candidats analysés automatiquement par l’IA :
              score de matching, compétences détectées, manques et décision RH.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-7 min-w-[260px]">
            <p className="text-green-100 mb-2">
              Matching moyen
            </p>
            <h2 className="text-6xl font-black">
              {averageScore}%
            </h2>
            <p className="text-green-200 mt-2">
              Calculé depuis PostgreSQL
            </p>
          </div>
        </div>
      </motion.div>
      {/* CARTES STATISTIQUES */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className={`relative overflow-hidden rounded-[32px] p-7 text-white shadow-xl bg-gradient-to-br ${card.gradient}`}
          >
            <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-8">
                {card.icon}
              </div>
              <p className="text-white/80 mb-2">
                {card.label}
              </p>
              <h2 className="text-5xl font-black">
                {card.value}
              </h2>
              <p className="text-white/80 mt-3 text-sm">
                {card.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* FILTRES */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-10 grid grid-cols-2 gap-6">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, compétence, poste, décision..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <FaFilter className="text-gray-400" />
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          >
            <option value="all">Tous les scores</option>
            <option value="excellent">Excellent ≥ 85%</option>
            <option value="good">Bon 70% - 84%</option>
            <option value="medium">Moyen 50% - 69%</option>
            <option value="low">Faible &lt; 50%</option>
          </select>
        </div>
      </div>
      {/* CHARGEMENT */}
      {loading && (
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          <FaRobot className="text-5xl text-[#0b3d2e] mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 font-semibold">
            Chargement des candidats...
          </p>
        </div>
      )}
      {/* VIDE */}
      {!loading && filteredCandidates.length === 0 && (
        <div className="bg-white rounded-[36px] p-12 shadow-sm text-center border border-gray-100">
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-[#0b3d2e] mb-3">
            Aucun candidat trouvé
          </h2>
          <p className="text-gray-500">
            Analysez un CV ou modifiez vos filtres.
          </p>
        </div>
      )}
      {/* LISTE DES CANDIDATS */}
      <div className="grid grid-cols-2 gap-8">
        {filteredCandidates.map((candidate, index) => {
          const skills = candidate.skills
            ? candidate.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0)
            : [];
          const missingSkills = candidate.missing_skills
            ? candidate.missing_skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0)
            : [];
          const decision = getDecision(candidate);
          return (
            <motion.div
              key={candidate.id}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -8,
                scale: 1.01,
              }}
              className="relative overflow-hidden bg-white rounded-[36px] p-8 shadow-sm border border-gray-100"
            >
              <div className="absolute right-[-70px] top-[-70px] w-40 h-40 bg-green-100 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                {/* EN-TÊTE CANDIDAT */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="w-16 h-16 rounded-3xl bg-[#0b3d2e] text-white flex items-center justify-center text-3xl mb-5">
                      <FaUserTie />
                    </div>
                    <h2 className="text-3xl font-black text-[#0b3d2e] mb-2">
                      {candidate.name || "Nom non renseigné"}
                    </h2>
                    <p className="text-gray-500 text-lg">
                      {candidate.title || "Profil candidat"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Analyse #{candidate.id}
                    </p>
                  </div>
                  <div
                    className={`w-28 h-28 rounded-full border-[7px] ${decision.border} flex items-center justify-center`}
                  >
                    <div className="text-center">
                      <h3
                        className={`text-3xl font-black ${decision.text}`}
                      >
                        {candidate.score}%
                      </h3>
                      <p className="text-xs text-gray-400">
                        Match
                      </p>
                    </div>
                  </div>
                </div>
                {/* DÉCISION RH */}
                <div className="mb-7">
                  <span
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black ${decision.className}`}
                  >
                    <FaClipboardCheck />
                    {decision.label}
                  </span>
                </div>
                {/* CONTACT */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <FaEnvelope className="text-green-700 mb-2" />
                    <p className="text-gray-500 text-sm">
                      Email
                    </p>
                    <h3 className="font-bold text-[#0b3d2e] break-all">
                      {candidate.email || "Non renseigné"}
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <FaPhone className="text-blue-700 mb-2" />
                    <p className="text-gray-500 text-sm">
                      Téléphone
                    </p>
                    <h3 className="font-bold text-[#0b3d2e]">
                      {candidate.phone || "Non renseigné"}
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <FaLinkedin className="text-blue-600 mb-2" />
                    <p className="text-gray-500 text-sm">
                      LinkedIn
                    </p>
                    <h3 className="font-bold text-[#0b3d2e] break-all">
                      {candidate.linkedin || "Non renseigné"}
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <FaGithub className="text-gray-700 mb-2" />
                    <p className="text-gray-500 text-sm">
                      GitHub
                    </p>
                    <h3 className="font-bold text-[#0b3d2e] break-all">
                      {candidate.github || "Non renseigné"}
                    </h3>
                  </div>
                </div>
                {/* RÉSUMÉ IA */}
                <div className="bg-green-50 border border-green-100 rounded-3xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FaRobot className="text-green-700 text-2xl" />
                    <h3 className="font-black text-green-700 text-xl">
                      Résumé IA
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-8 whitespace-pre-line">
                    {candidate.summary || "Aucun résumé disponible."}
                  </p>
                </div>
                {/* BESOIN ENTREPRISE */}
                <div className="bg-blue-50 rounded-3xl p-6 mb-8">
                  <h3 className="font-black text-blue-700 mb-3">
                    Besoins entreprise
                  </h3>
                  <p className="text-blue-800 leading-7">
                    {candidate.job_context || "Aucun contexte renseigné"}
                  </p>
                </div>
                {/* COMPÉTENCES DÉTECTÉES */}
                <h3 className="font-black text-[#0b3d2e] mb-4 flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  Compétences détectées
                </h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {skills.length === 0 ? (
                    <p className="text-gray-500">
                      Aucune compétence détectée.
                    </p>
                  ) : (
                    skills.map((skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
                {/* COMPÉTENCES MANQUANTES */}
                <h3 className="font-black text-[#0b3d2e] mb-4 flex items-center gap-3">
                  <FaTimesCircle className="text-red-500" />
                  Compétences manquantes
                </h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {missingSkills.length === 0 ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                      Aucune compétence manquante
                    </span>
                  ) : (
                    missingSkills.map((skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => exportCandidatePDF(candidate)}
                    className="w-full bg-[#0b3d2e] text-white py-4 rounded-2xl font-black hover:bg-[#145443] flex items-center justify-center gap-3"
                  >
                    <FaFilePdf />
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="w-full border border-red-200 text-red-600 py-4 rounded-2xl font-black hover:bg-red-50 flex items-center justify-center gap-3"
                  >
                    <FaTrash />
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* INSIGHT IA */}
      {!loading && candidates.length > 0 && (
        <div className="mt-10 bg-gradient-to-r from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[36px] p-8 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
              <FaChartLine />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-2">
                Insight IA
              </h2>
              <p className="text-green-100 leading-8">
                Les candidats analysés sont sauvegardés dans PostgreSQL avec
                leur score, leurs compétences détectées, leurs compétences
                manquantes et leur décision RH. Cette page permet de comparer
                rapidement les profils pour accélérer la décision recrutement.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
export default Candidates;