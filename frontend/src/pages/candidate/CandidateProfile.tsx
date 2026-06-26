// ======================================================
// CANDIDATE PROFILE PAGE - SMARTRECRUIT AI
// Premium Candidate Profile / Violet Indigo Career Design
// ======================================================

import { useState, type ChangeEvent, type ReactNode } from "react";
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
  FaRocket,
  FaStar,
  FaClipboardCheck,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

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

// ======================================================
// COMPONENT
// ======================================================

function CandidateProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const savedProfile = JSON.parse(
    localStorage.getItem("candidateProfile") || "{}"
  );

  const [savedMessage, setSavedMessage] = useState("");

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

  const fields = Object.keys(formData) as Array<keyof FormData>;

  const completedFields = fields.filter(
    (field) => formData[field].trim() !== ""
  ).length;

  const profileScore = Math.round((completedFields / fields.length) * 100);

  const missingFields = fields.length - completedFields;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSavedMessage("");

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("candidateProfile", JSON.stringify(formData));
    setSavedMessage("Profil enregistré avec succès.");

    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  const profileChecks = [
    { label: "Nom complet", done: !!formData.fullname },
    { label: "Email", done: !!formData.email },
    { label: "Téléphone", done: !!formData.phone },
    { label: "Ville", done: !!formData.city },
    { label: "Titre professionnel", done: !!formData.title },
    { label: "LinkedIn", done: !!formData.linkedin },
    { label: "GitHub", done: !!formData.github },
    { label: "Compétences", done: !!formData.skills },
    { label: "Langues", done: !!formData.languages },
    { label: "Formation", done: !!formData.education },
    { label: "Certifications", done: !!formData.certifications },
  ];

  return (
    <CandidateLayout>
      <div className="space-y-7">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#312e81] via-[#7c3aed] to-[#ec4899] p-8 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-pink-300/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-300/25 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaRocket className="text-pink-100" />

                <span className="text-xs uppercase tracking-[3px] font-black text-pink-100">
                  SmartRecruit Candidate Profile
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Construisez un profil
                <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  complet et professionnel.
                </span>
              </h1>

              <p className="text-indigo-100 max-w-3xl mt-5 leading-7">
                Ajoutez vos informations, compétences, formations et liens
                professionnels pour améliorer la qualité de vos candidatures.
              </p>
            </div>

            <div className="xl:col-span-5">
              <div className="rounded-[30px] bg-white/10 border border-white/10 p-6 backdrop-blur-xl">
                <p className="text-indigo-100 text-sm font-bold">
                  Complétion du profil
                </p>

                <div className="flex items-end gap-2 mt-4">
                  <span className="text-7xl font-black text-white">
                    {profileScore}
                  </span>
                  <span className="text-3xl font-black text-white mb-2">%</span>
                </div>

                <div className="h-3 bg-white/15 rounded-full mt-5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileScore}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <HeroMiniStat label="Champs OK" value={completedFields} />
                  <HeroMiniStat label="Manquants" value={missingFields} />
                  <HeroMiniStat label="Score" value={profileScore} />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Profil"
            value={profileScore}
            suffix="%"
            icon={<FaUser />}
            color="bg-indigo-50 text-indigo-700"
          />

          <MiniStat
            title="Champs remplis"
            value={completedFields}
            icon={<FaCheckCircle />}
            color="bg-emerald-50 text-emerald-700"
          />

          <MiniStat
            title="Champs manquants"
            value={missingFields}
            icon={<FaTimesCircle />}
            color="bg-pink-50 text-pink-700"
          />

          <MiniStat
            title="Présence pro"
            value={formData.linkedin || formData.github ? 100 : 0}
            suffix="%"
            icon={<FaStar />}
            color="bg-violet-50 text-violet-700"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-4 rounded-[32px] bg-white p-6 shadow-xl border border-slate-200"
          >
            <div className="rounded-[28px] bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 p-6">
              <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-violet-600 to-pink-500 text-white flex items-center justify-center text-4xl font-black shadow-lg">
                {(formData.fullname || "C").charAt(0).toUpperCase()}
              </div>

              <h2 className="text-3xl font-black mt-5 text-slate-900">
                {formData.fullname || "Candidat"}
              </h2>

              <p className="text-slate-500 mt-2">
                {formData.title || "Titre professionnel non renseigné"}
              </p>

              <div className="mt-5 rounded-2xl bg-white border border-violet-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-700">
                    Score profil
                  </span>

                  <span className="text-sm font-black text-violet-700">
                    {profileScore}%
                  </span>
                </div>

                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full"
                    style={{ width: `${profileScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {profileChecks.map((item) => (
                <ProfileCheck
                  key={item.label}
                  label={item.label}
                  done={item.done}
                />
              ))}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="xl:col-span-8 rounded-[32px] bg-white p-6 shadow-xl border border-slate-200"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  Informations professionnelles
                </h2>

                <p className="text-slate-500 mt-2">
                  Ces informations servent à mieux présenter votre profil et à
                  améliorer vos candidatures.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="bg-gradient-to-r from-violet-600 to-pink-500 hover:scale-[1.01] text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition"
              >
                <FaSave />
                Enregistrer
              </button>
            </div>

            {savedMessage && (
              <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 font-bold flex items-center gap-3">
                <FaCheckCircle />
                {savedMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                icon={<FaUser />}
                label="Nom complet"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />

              <Input
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                icon={<FaPhone />}
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                icon={<FaMapMarkerAlt />}
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />

              <Input
                icon={<FaBriefcase />}
                label="Titre professionnel"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />

              <Input
                icon={<FaLinkedin />}
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />

              <Input
                icon={<FaGithub />}
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleChange}
              />

              <Input
                icon={<FaLanguage />}
                label="Langues"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5">
              <TextArea
                icon={<FaCode />}
                label="Compétences"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Ex : React, Node.js, PostgreSQL, Docker, Git..."
              />

              <TextArea
                icon={<FaGraduationCap />}
                label="Formation"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Ex : Bachelor Informatique, Développement, Data et IA..."
              />

              <TextArea
                icon={<FaCertificate />}
                label="Certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Ex : AWS, Machine Learning, GitHub, React..."
              />
            </div>
          </motion.div>
        </div>

        {/* SUMMARY */}
        <PanelCard
          title="Résumé de votre profil"
          subtitle="Éléments importants pour vos candidatures"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatusBox
              icon={<FaClipboardCheck />}
              label="Informations"
              value={`${completedFields}/${fields.length}`}
            />

            <StatusBox
              icon={<FaCode />}
              label="Compétences"
              value={formData.skills ? "Renseignées" : "Manquantes"}
            />

            <StatusBox
              icon={<FaLanguage />}
              label="Langues"
              value={formData.languages ? "Renseignées" : "Manquantes"}
            />

            <StatusBox
              icon={<FaShieldAlt />}
              label="Profil"
              value={profileScore >= 80 ? "Solide" : "À compléter"}
            />
          </div>
        </PanelCard>
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
  suffix = "",
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  suffix?: string;
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

          <h3 className="text-3xl font-black text-slate-900">
            {value}
            {suffix}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

function Input({
  icon,
  label,
  name,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block font-black mb-2 text-slate-800">{label}</label>

      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
        <span className="text-violet-600">{icon}</span>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="bg-transparent outline-none w-full text-slate-900"
        />
      </div>
    </div>
  );
}

function TextArea({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block font-black mb-2 text-slate-800">{label}</label>

      <div className="flex items-start gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
        <span className="text-violet-600 mt-1">{icon}</span>

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-slate-900 resize-none h-24"
        />
      </div>
    </div>
  );
}

function ProfileCheck({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-200">
      <span className="font-bold text-slate-700">{label}</span>

      <span
        className={`flex items-center gap-2 font-bold ${
          done ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        <FaCheckCircle />
        {done ? "OK" : "Manquant"}
      </span>
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
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-5">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function StatusBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] bg-slate-50 border border-slate-200 p-5">
      <div className="text-violet-600 text-2xl mb-3">{icon}</div>

      <p className="text-slate-500 text-xs uppercase tracking-[2px] font-black">
        {label}
      </p>

      <h3 className="text-lg font-black text-slate-900 mt-2">{value}</h3>
    </div>
  );
}

export default CandidateProfile;