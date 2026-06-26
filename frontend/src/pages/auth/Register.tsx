// ======================================================
// REGISTER PAGE - SMARTRECRUIT AI
// International Premium Auth Design
// ======================================================

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import logoSmartRecruit from "../../assets/logo-smartrecruit.png";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaRobot,
  FaUsers,
  FaArrowRight,
  FaShieldAlt,
  FaBrain,
  FaDatabase,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaGlobe,
  FaUserTie,
  FaBriefcase,
  FaRocket,
} from "react-icons/fa";

// ======================================================
// REGISTER COMPONENT
// ======================================================

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "recruiter",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrorMessage("");

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "recruiter") {
        navigate("/recruiter-dashboard", {
          replace: true,
        });
      } else {
        navigate("/candidate-dashboard", {
          replace: true,
        });
      }
    } catch (error: any) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950 overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-220px] right-[-160px] w-[620px] h-[620px] bg-violet-200/60 rounded-full blur-3xl" />
        <div className="absolute bottom-[-260px] left-[-180px] w-[650px] h-[650px] bg-blue-200/50 rounded-full blur-3xl" />
        <div className="absolute top-[260px] left-[45%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2 shadow-lg">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                SmartRecruit AI
              </h1>

              <p className="text-[10px] uppercase tracking-[3px] text-violet-600 font-black">
                Global Recruitment Intelligence
              </p>
            </div>
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex bg-slate-950 text-white px-5 py-3 rounded-2xl font-black hover:bg-violet-700 transition"
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 xl:grid-cols-12 gap-10 items-center">
        {/* LEFT FORM */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="xl:col-span-5 order-2 xl:order-1"
        >
          <div className="bg-white rounded-[36px] shadow-[0_35px_100px_rgba(15,23,42,0.14)] border border-slate-200 p-7 md:p-9 max-w-lg mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-violet-600 text-xs uppercase tracking-[3px] font-black">
                  Create account
                </p>

                <h2 className="text-4xl font-black text-slate-950 mt-2">
                  Inscription
                </h2>

                <p className="text-slate-500 mt-2">
                  Créez votre espace SmartRecruit AI.
                </p>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-500 text-white flex items-center justify-center text-3xl shadow-lg">
                <FaRocket />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Nom complet
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
                  <FaUser className="text-slate-400" />

                  <input
                    type="text"
                    name="fullname"
                    placeholder="Mohamed Amine"
                    className="bg-transparent outline-none w-full text-slate-900"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Adresse email
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
                  <FaEnvelope className="text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    className="bg-transparent outline-none w-full text-slate-900"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Mot de passe
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
                  <FaLock className="text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 6 caractères"
                    className="bg-transparent outline-none w-full text-slate-900"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-violet-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Type de compte
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-violet-100 transition">
                  <FaUsers className="text-slate-400" />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="bg-transparent outline-none w-full text-slate-900 font-bold"
                  >
                    <option value="recruiter">Recruteur / RH</option>
                    <option value="candidate">Candidat</option>
                  </select>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:scale-[1.01] text-white py-4 rounded-2xl font-black text-lg transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaBolt className="animate-pulse" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 mt-8">
              Vous avez déjà un compte ?
              <Link
                to="/login"
                className="text-violet-600 font-black ml-2 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </motion.section>

        {/* RIGHT BRANDING */}
        <motion.section
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="xl:col-span-7 order-1 xl:order-2 hidden xl:block"
        >
          <div className="inline-flex items-center gap-3 bg-violet-50 border border-violet-100 text-violet-700 px-5 py-3 rounded-full font-black mb-8">
            <FaGlobe />
            Join SmartRecruit AI
          </div>

          <h2 className="text-6xl font-black leading-tight max-w-3xl">
            Créez un compte pour gérer
            <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 bg-clip-text text-transparent">
              votre recrutement intelligent.
            </span>
          </h2>

          <p className="text-slate-600 text-lg leading-9 max-w-2xl mt-7">
            Rejoignez une plateforme complète : espace recruteur, espace
            candidat, analyse CV, assistant IA, suivi des candidatures,
            monitoring et audit logs.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-3xl">
            <RoleCard
              icon={<FaUserTie />}
              title="Espace recruteur"
              text="Gérez les offres, les candidats, les scores IA et les décisions RH."
            />

            <RoleCard
              icon={<FaBriefcase />}
              title="Espace candidat"
              text="Analysez votre CV, postulez aux offres et suivez vos candidatures."
            />
          </div>

          <div className="mt-10 rounded-[34px] bg-slate-950 text-white p-7 shadow-2xl max-w-3xl overflow-hidden relative">
            <div className="absolute top-[-90px] right-[-90px] w-72 h-72 bg-violet-500/30 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-3 gap-5">
              <Metric label="AI Service" value="Ready" />
              <Metric label="Security" value="JWT" />
              <Metric label="Data" value="SQL" />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

function RoleCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] bg-white border border-slate-200 p-6 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center text-2xl mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-black text-slate-950">{title}</h3>

      <p className="text-slate-500 leading-7 mt-3">{text}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <p className="text-slate-400 text-xs">{label}</p>
      <h3 className="text-3xl font-black mt-2">{value}</h3>
    </div>
  );
}

export default Register;