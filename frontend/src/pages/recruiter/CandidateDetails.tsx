// ======================================================
// PAGE DÉTAIL CANDIDAT - SMARTRECRUIT AI
// ======================================================

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import jsPDF from "jspdf";
import LogoSmartRecruit from "../../assets/logo-smartrecruit.png";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaUserTie,
  FaBrain,
  FaArrowLeft,
  FaRobot,
  FaLinkedin,
  FaGithub,
  FaIdBadge,
} from "react-icons/fa";

// ======================================================
// TYPE CANDIDAT
// ======================================================

type Candidate = {
  id: number;
  name?: string;
  fullname?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  
  score?: number;
  decision?: string;
  decision_color?: string;
  
  skills?: string;
  missing_skills?: string;
  
  summary?: string;
  job_context?: string;
  
  strengths?: string;
  weaknesses?: string;
  advice?: string;
  
  profile_level?: string;
  years_experience?: number;
  interview_questions?: string;
  hr_recommendation?: string;
  
  created_at?: string;
};

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

const CandidateDetails = () => {
  const { id } = useParams();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingDecision, setUpdatingDecision] = useState(false);

  // ======================================================
  // RÉCUPÉRER LE CANDIDAT PAR ID
  // ======================================================

  const fetchCandidate = async () => {
    try {
      const response = await api.get(`/candidates/${id}`);
      setCandidate(response.data);
    } catch (error) {
      console.log(error);
      alert("Erreur récupération détail candidat");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CHARGEMENT INITIAL
  // ======================================================

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  // ======================================================
  // MISE À JOUR DE LA DÉCISION
  // ======================================================

  const updateDecision = async (decision: string, decisionColor: string) => {
    try {
      if (!candidate) return;

      setUpdatingDecision(true);

      const response = await api.patch(`/candidates/${candidate.id}/decision`, {
        decision,
        decision_color: decisionColor,
      });

      setCandidate(response.data.candidate || response.data);

      alert("Décision candidat mise à jour avec succès");
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message || "Erreur mise à jour décision candidat"
      );
    } finally {
      setUpdatingDecision(false);
    }
  };

  // ======================================================
  // OUTILS
  // ======================================================

  const parseSkills = (value?: string) => {
    return value
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      : [];
  };

  const getCandidateName = () => {
    return candidate?.fullname || candidate?.name || "Candidat sans nom";
  };

  const getInitials = () => {
    const name = getCandidateName();

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getDecision = () => {
    const score = candidate?.score || 0;

    if (candidate?.decision) {
      return candidate.decision;
    }

    if (score >= 85) return "Recruter";
    if (score >= 70) return "Entretien conseillé";
    if (score >= 50) return "À revoir";

    return "Refuser";
  };

  const getDecisionColorClass = () => {
    if (candidate?.decision_color === "green") {
      return "text-green-600";
    }

    if (candidate?.decision_color === "red") {
      return "text-red-600";
    }

    if (candidate?.decision_color === "blue") {
      return "text-blue-600";
    }

    if (candidate?.decision_color === "yellow") {
      return "text-yellow-600";
    }

    const score = candidate?.score || 0;

    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";

    return "text-red-600";
  };

  const getMatchingLabel = () => {
    const score = candidate?.score || 0;

    if (score >= 85) return "Excellent";
    if (score >= 70) return "Bon";
    if (score >= 50) return "Moyen";

    return "Faible";
  };

  // ======================================================
  // EXPORT PDF
  // ======================================================

  const exportPDF = () => {
    if (!candidate) return;

    const doc = new jsPDF("p", "mm", "a4");

    const skills = parseSkills(candidate.skills);
    const missingSkills = parseSkills(candidate.missing_skills);
    const score = candidate.score || 0;

    const img = new Image();
    img.src = LogoSmartRecruit;

    img.onload = () => {
      // PAGE 1 : EN-TÊTE ET RÉSUMÉ
      doc.setFillColor(5, 46, 43);
      doc.rect(0, 0, 210, 42, "F");

      doc.addImage(img, "PNG", 14, 7, 26, 26);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SMARTRECRUIT AI", 48, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Rapport professionnel d'analyse candidat", 48, 29);

      doc.setFontSize(9);
      doc.text(new Date().toLocaleDateString("fr-FR"), 165, 29);

      // CARTE CANDIDAT
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 55, 182, 58, 6, 6, "F");
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 55, 182, 58, 6, 6, "S");

      // INITIALES
      doc.setFillColor(6, 78, 59);
      doc.circle(34, 84, 14, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(getInitials(), 28, 88);

      // INFOS CANDIDAT
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(17);
      doc.text(getCandidateName(), 55, 70);

      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`ID candidat : #${candidate.id}`, 55, 82);
      doc.text(`Profil : ${candidate.title || "Non renseigné"}`, 55, 90);
      doc.text(`Email : ${candidate.email || "Non renseigné"}`, 55, 98);
      doc.text(`Téléphone : ${candidate.phone || "Non renseigné"}`, 55, 106);

      // SCORE CIRCULAIRE
      doc.setDrawColor(6, 78, 59);
      doc.setLineWidth(3);
      doc.circle(170, 84, 20);

      doc.setTextColor(6, 78, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(`${score}%`, 160, 84);

      doc.setFontSize(8);
      doc.text("SCORE IA", 158, 94);

      doc.setLineWidth(0.2);

      // ==========================================
      // BADGE DECISION RH
      // ==========================================
      
      let decisionColor = [22, 163, 74];

      if ((candidate.score || 0) < 85 && (candidate.score || 0) >= 70) {
        decisionColor = [37, 99, 235];
      }

      if ((candidate.score || 0) < 70 && (candidate.score || 0) >= 50) {
        decisionColor = [202, 138, 4];
      }

      if ((candidate.score || 0) < 50) {
        decisionColor = [220, 38, 38];
      }

      doc.setFillColor(
        decisionColor[0],
        decisionColor[1],
        decisionColor[2]
      );

      doc.roundedRect(140, 112, 55, 18, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);

      doc.text(
        getDecision(),
        145,
        123
      );

      doc.setTextColor(0, 0, 0);

      // RÉSUMÉ IA
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Résumé IA", 14, 174);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 182, 182, 48, 6, 6, "F");

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const summaryLines = doc.splitTextToSize(
        candidate.summary || "Aucun résumé disponible.",
        165
      );

      doc.text(summaryLines, 24, 194);

      // SYNTHÈSE IA
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Synthèse IA", 14, 244);

      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(`Compétences détectées : ${skills.length}`, 24, 256);
      doc.text(`Compétences manquantes : ${missingSkills.length}`, 24, 264);
      doc.text(`Niveau de matching : ${getMatchingLabel()}`, 24, 272);

      // FOOTER PAGE 1
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 282, 196, 282);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("SmartRecruit AI | Rapport RH confidentiel", 14, 289);
      doc.text("Page 1", 180, 289);

      // PAGE 2 : DÉTAILS DES COMPÉTENCES ET CONTEXTE
      doc.addPage();

      doc.setFillColor(5, 46, 43);
      doc.rect(0, 0, 210, 32, "F");

      doc.addImage(img, "PNG", 14, 6, 18, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Analyse détaillée", 40, 18);

      let y = 50;

      // ==========================================
      // FORCES DU CANDIDAT
      // ==========================================
      
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(16);

      doc.text("Forces du candidat", 15, y);
      
      y += 10;

      doc.setFontSize(10);

      const pdfStrengths = [
        "Compétences alignées avec le poste",
        "Bon profil technique",
        "Expérience détectée",
        "Projets techniques présents",
      ];

      pdfStrengths.forEach((item, index) => {
        doc.text(`✓  ${item}`, 20, y + index * 6);
      });

      y += pdfStrengths.length * 6 + 15;

      // ==========================================
      // AXES D'AMÉLIORATION
      // ==========================================
      
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(16);

      doc.text("Axes d'amélioration", 15, y);
      
      y += 10;

      doc.setFontSize(10);

      if (missingSkills.length > 0) {
        missingSkills.forEach((skill, index) => {
          doc.text(`•  ${skill}`, 20, y + index * 6);
        });

        y += missingSkills.length * 6 + 15;
      } else {
        doc.text(
          "Aucune compétence critique manquante.",
          20,
          y
        );
        
        y += 15;
      }

      // ==========================================
      // CONTEXTE
      // ==========================================
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);

      doc.text("Contexte du poste", 15, y);

      y += 10;

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, y, 182, 50, 6, 6, "F");

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const contextLines = doc.splitTextToSize(
        candidate.job_context || "Aucun contexte renseigné.",
        165
      );

      doc.text(contextLines.slice(0, 10), 24, y + 10);

      // FOOTER PAGE 2
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 282, 196, 282);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("SmartRecruit AI | Rapport RH confidentiel", 14, 289);
      doc.text("Page 2", 180, 289);

      doc.save(`SmartRecruit-Candidat-${candidate.id}.pdf`);
    };
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          <FaRobot className="text-5xl text-[#064e3b] mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 font-bold">Chargement du candidat...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ======================================================
  // CANDIDAT INTROUVABLE
  // ======================================================

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          <h1 className="text-3xl font-black text-red-600">
            Candidat introuvable
          </h1>
          <Link
            to="/candidates"
            className="inline-flex mt-6 bg-[#064e3b] text-white px-6 py-3 rounded-2xl font-bold"
          >
            Retour aux candidats
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const skills = parseSkills(candidate.skills);
  const missingSkills = parseSkills(candidate.missing_skills);

  const strengths = candidate.strengths
    ? candidate.strengths.split("|")
    : [];

  const weaknesses = candidate.weaknesses
    ? candidate.weaknesses.split("|")
    : [];

  const advice = candidate.advice
    ? candidate.advice.split("|")
    : [];

  const interviewQuestions = candidate.interview_questions
    ? candidate.interview_questions.split("|")
    : [];
    
  const hrRecommendation = candidate.hr_recommendation;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* RETOUR */}
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-[#064e3b] font-black"
        >
          <FaArrowLeft />
          Retour aux candidats
        </Link>

        {/* HERO */}
        <div className="bg-gradient-to-r from-[#052e2b] via-[#064e3b] to-[#0f766e] rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-3xl bg-white text-[#064e3b] flex items-center justify-center text-4xl font-black">
                {getInitials()}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full mb-3 text-sm">
                  <FaIdBadge />
                  ID candidat #{candidate.id}
                </div>
                <h1 className="text-4xl font-black">{getCandidateName()}</h1>
                <p className="text-emerald-100 mt-2">
                  {candidate.title || "Profil candidat"}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-2">
                    <FaEnvelope />
                    {candidate.email || "Email non renseigné"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaPhone />
                    {candidate.phone || "Téléphone non renseigné"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black">{candidate.score || 0}%</div>
              <p className="text-emerald-100">Score IA</p>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaUserTie className="text-3xl text-blue-600 mb-3" />
            <p className="text-gray-500 text-sm">Profil</p>
            <h3 className="font-black text-xl">
              {candidate.title || "Non renseigné"}
            </h3>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaCheckCircle className="text-3xl text-green-600 mb-3" />
            <p className="text-gray-500 text-sm">Décision</p>
            <h3 className={`font-black text-xl ${getDecisionColorClass()}`}>
              {getDecision()}
            </h3>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaMapMarkerAlt className="text-3xl text-orange-600 mb-3" />
            <p className="text-gray-500 text-sm">Localisation</p>
            <h3 className="font-black text-xl">
              {candidate.location || "Non renseignée"}
            </h3>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaStar className="text-3xl text-yellow-500 mb-3" />
            <p className="text-gray-500 text-sm">Matching</p>
            <h3 className="font-black text-xl">{getMatchingLabel()}</h3>
          </div>
        </div>

        {/* STATISTIQUES AVANCÉES */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Expérience
            </p>
            <h3 className="font-black text-2xl">
              {candidate.years_experience || 0} ans
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Compétences détectées
            </p>
            <h3 className="font-black text-2xl">
              {skills.length}
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Compétences manquantes
            </p>
            <h3 className="font-black text-2xl">
              {missingSkills.length}
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Niveau du profil
            </p>
            <h3 className="font-black text-2xl">
              {candidate.profile_level || "Junior"}
            </h3>
          </div>
        </div>

        {/* CONTACT */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaLinkedin className="text-3xl text-blue-600 mb-3" />
            <p className="text-gray-500 text-sm">LinkedIn</p>
            <h3 className="font-black break-all">
              {candidate.linkedin || "Non renseigné"}
            </h3>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border">
            <FaGithub className="text-3xl text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">GitHub</p>
            <h3 className="font-black break-all">
              {candidate.github || "Non renseigné"}
            </h3>
          </div>
        </div>

        {/* RESUME IA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-emerald-600 text-2xl" />
            <h2 className="text-2xl font-black">Résumé IA</h2>
          </div>
          <p className="text-gray-600 leading-8 whitespace-pre-line">
            {candidate.summary || "Aucun résumé disponible."}
          </p>
        </div>

        {/* SKILLS */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black mb-5 text-green-700">
              Compétences détectées
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.length === 0 ? (
                <p className="text-gray-500">Aucune compétence détectée.</p>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black mb-5 text-red-600">
              Compétences manquantes
            </h2>
            <div className="flex flex-wrap gap-3">
              {missingSkills.length === 0 ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  Aucune compétence manquante
                </span>
              ) : (
                missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* BESOIN ENTREPRISE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <h2 className="text-2xl font-black mb-4">
            Besoin entreprise / contexte poste
          </h2>
          <p className="text-gray-600 leading-8 whitespace-pre-line">
            {candidate.job_context || "Aucun contexte renseigné."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black text-green-700 mb-4">
              Points forts
            </h2>
            <ul className="space-y-3">
              {strengths.map((item, index) => (
                <li key={index} className="text-gray-700">
                  ✅ {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black text-red-600 mb-4">
              Axes d'amélioration
            </h2>
            <ul className="space-y-3">
              {weaknesses.map((item, index) => (
                <li key={index} className="text-gray-700">
                  ⚠️ {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black text-blue-700 mb-4">
              Conseils IA
            </h2>
            <ul className="space-y-3">
              {advice.map((item, index) => (
                <li key={index} className="text-gray-700">
                  💡 {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMANDATION RH + QUESTIONS ENTRETIEN */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black text-[#064e3b] mb-4">
              Recommandation RH IA
            </h2>
            <p className="text-gray-700 leading-8">
              {hrRecommendation || "Aucune recommandation RH."}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h2 className="text-2xl font-black text-purple-700 mb-4">
              Questions d'entretien IA
            </h2>
            <ul className="space-y-3">
              {interviewQuestions.length > 0 ? (
                interviewQuestions.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {index + 1}. {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">
                  Aucune question générée.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => updateDecision("Candidat accepté", "green")}
            disabled={updatingDecision}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <FaCheckCircle />
            {updatingDecision ? "Mise à jour..." : "Accepter le candidat"}
          </button>
          <button
            onClick={() => updateDecision("Candidat refusé", "red")}
            disabled={updatingDecision}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <FaTimesCircle />
            {updatingDecision ? "Mise à jour..." : "Refuser"}
          </button>
          <button
            onClick={exportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <FaDownload />
            Télécharger PDF
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDetails;