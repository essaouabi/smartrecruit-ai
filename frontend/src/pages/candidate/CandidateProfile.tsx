import { useState } from "react";
import { motion } from "framer-motion";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaBriefcase,
  FaSave,
  FaCheckCircle,
  FaCode,
  FaLanguage,
  FaCertificate,
  FaGraduationCap,
} from "react-icons/fa";

type FormData = {
  fullname: string;
  email: string;
  phone: string;
  city: string;
  title: string;
  linkedin: string;
  github: string;
  skills: string;
  languages: string;
  education: string;
  certifications: string;
};

function CandidateProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const savedProfile = JSON.parse(localStorage.getItem("candidateProfile") || "{}");

  const [formData, setFormData] = useState<FormData>({
    fullname: savedProfile.fullname || user.fullname || "",
    email: savedProfile.email || user.email || "",
    phone: savedProfile.phone || "",
    city: savedProfile.city || "",
    title: savedProfile.title || "",
    linkedin: savedProfile.linkedin || "",
    github: savedProfile.github || "",
    skills: savedProfile.skills || "",
    languages: savedProfile.languages || "",
    education: savedProfile.education || "",
    certifications: savedProfile.certifications || "",
  });

  const completedFields = Object.values(formData).filter(
    (value) => value.trim() !== ""
  ).length;

  const profileScore = Math.round(
    (completedFields / Object.keys(formData).length) * 100
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("candidateProfile", JSON.stringify(formData));
    alert("Profil enregistré avec succès.");
  };

  return (
    <CandidateLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] bg-[#020617] p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-cyan-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-[-90px] left-[-80px] w-80 h-80 bg-blue-600/30 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <span className="inline-flex bg-white/10 border border-white/10 text-cyan-200 px-4 py-2 rounded-full text-sm font-bold">
                SmartRecruit AI Profile
              </span>
              <h1 className="text-5xl font-black mt-6">Mon profil candidat</h1>
              <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                Construisez un profil professionnel clair, complet et optimisé pour les recruteurs.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 min-w-[260px]">
              <p className="text-slate-300 text-sm">Complétion du profil</p>
              <div className="flex items-end gap-2 mt-3">
                <span className="text-6xl font-black text-cyan-300">{profileScore}</span>
                <span className="text-2xl font-black text-cyan-300 mb-2">%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-cyan-300 rounded-full" style={{ width: `${profileScore}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[32px] bg-white p-7 shadow-xl border border-slate-200"
          >
            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-4xl font-black shadow-lg">
              {(formData.fullname || "C").charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-black mt-5 text-slate-900">{formData.fullname || "Candidat"}</h2>
            <p className="text-slate-500 mt-2">{formData.title || "Titre professionnel non renseigné"}</p>

            <div className="mt-6 space-y-3">
              <ProfileCheck label="Nom complet" done={!!formData.fullname} />
              <ProfileCheck label="Email" done={!!formData.email} />
              <ProfileCheck label="Téléphone" done={!!formData.phone} />
              <ProfileCheck label="Ville" done={!!formData.city} />
              <ProfileCheck label="LinkedIn" done={!!formData.linkedin} />
              <ProfileCheck label="GitHub" done={!!formData.github} />
              <ProfileCheck label="Compétences" done={!!formData.skills} />
              <ProfileCheck label="Langues" done={!!formData.languages} />
              <ProfileCheck label="Formation" done={!!formData.education} />
              <ProfileCheck label="Certifications" done={!!formData.certifications} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 rounded-[32px] bg-white p-7 shadow-xl border border-slate-200"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-2">Informations professionnelles</h2>
            <p className="text-slate-500 mb-6">Ces informations seront utilisées pour améliorer vos candidatures.</p>

            <div className="grid md:grid-cols-2 gap-5">
              <Input icon={<FaUser />} label="Nom complet" name="fullname" value={formData.fullname} onChange={handleChange} />
              <Input icon={<FaEnvelope />} label="Email" name="email" value={formData.email} onChange={handleChange} />
              <Input icon={<FaPhone />} label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input icon={<FaMapMarkerAlt />} label="Ville" name="city" value={formData.city} onChange={handleChange} />
              <Input icon={<FaBriefcase />} label="Titre professionnel" name="title" value={formData.title} onChange={handleChange} />
              <Input icon={<FaLinkedin />} label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <Input icon={<FaGithub />} label="GitHub" name="github" value={formData.github} onChange={handleChange} />
              <Input icon={<FaCode />} label="Compétences" name="skills" value={formData.skills} onChange={handleChange} />
              <Input icon={<FaLanguage />} label="Langues" name="languages" value={formData.languages} onChange={handleChange} />
              <Input icon={<FaGraduationCap />} label="Formation" name="education" value={formData.education} onChange={handleChange} />
              <Input icon={<FaCertificate />} label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} />
            </div>

            <button
              onClick={handleSave}
              className="mt-7 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-7 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg transition"
            >
              <FaSave />
              Enregistrer le profil
            </button>
          </motion.div>
        </div>
      </div>
    </CandidateLayout>
  );
}

function Input({ icon, label, name, value, onChange }: any) {
  return (
    <div>
      <label className="block font-bold mb-2 text-slate-800">{label}</label>
      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500">
        <span className="text-blue-600">{icon}</span>
        <input type="text" name={name} value={value} onChange={onChange} className="bg-transparent outline-none w-full" />
      </div>
    </div>
  );
}

function ProfileCheck({ label, done }: { label: string, done: boolean }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3">
      <span className="font-bold text-slate-700">{label}</span>
      <span className={`flex items-center gap-2 font-bold ${done ? "text-emerald-600" : "text-slate-400"}`}>
        <FaCheckCircle /> {done ? "OK" : "Manquant"}
      </span>
    </div>
  );
}

export default CandidateProfile;