// ======================================================
// LOGIN PAGE - SMARTRECRUIT AI
// International Premium Auth Design
// ======================================================

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import logoSmartRecruit from "../../assets/logo-smartrecruit.png";

import {
  FaEnvelope,
  FaLock,
  FaRobot,
  FaArrowRight,
  FaShieldAlt,
  FaBrain,
  FaDatabase,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaGlobe,
} from "react-icons/fa";

// ======================================================
// LOGIN COMPONENT
// ======================================================

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const userRole = response.data.user?.role;

      if (userRole === "candidate") {
        navigate("/candidate-dashboard", {
          replace: true,
        });
      } else {
        navigate("/recruiter-dashboard", {
          replace: true,
        });
      }
    } catch (error: any) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message || "Erreur de connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950 overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-220px] right-[-160px] w-[620px] h-[620px] bg-blue-200/60 rounded-full blur-3xl" />
        <div className="absolute bottom-[-260px] left-[-180px] w-[650px] h-[650px] bg-violet-200/50 rounded-full blur-3xl" />
        <div className="absolute top-[260px] left-[45%] w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl" />
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

              <p className="text-[10px] uppercase tracking-[3px] text-blue-600 font-black">
                Global Recruitment Intelligence
              </p>
            </div>
          </Link>

          <Link
            to="/register"
            className="hidden sm:inline-flex bg-slate-950 text-white px-5 py-3 rounded-2xl font-black hover:bg-blue-700 transition"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 xl:grid-cols-12 gap-10 items-center">
        {/* LEFT BRANDING */}
        <motion.section
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="xl:col-span-7 hidden xl:block"
        >
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 px-5 py-3 rounded-full font-black mb-8">
            <FaGlobe />
            International AI Hiring Platform
          </div>

          <h2 className="text-6xl font-black leading-tight max-w-3xl">
            Connectez-vous à une plateforme
            <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              RH intelligente.
            </span>
          </h2>

          <p className="text-slate-600 text-lg leading-9 max-w-2xl mt-7">
            Analyse CV, matching candidat/offre, assistant RH IA, data pipeline,
            audit logs et monitoring DevOps dans une seule plateforme
            professionnelle.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-3xl">
            <FeatureBox
              icon={<FaBrain />}
              title="AI Matching"
              text="Analyse intelligente"
            />

            <FeatureBox
              icon={<FaShieldAlt />}
              title="Secure Access"
              text="JWT + audit"
            />

            <FeatureBox
              icon={<FaDatabase />}
              title="Data Driven"
              text="PostgreSQL"
            />
          </div>

          <div className="mt-10 rounded-[34px] bg-slate-950 text-white p-7 shadow-2xl max-w-3xl overflow-hidden relative">
            <div className="absolute top-[-90px] right-[-90px] w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-3 gap-5">
              <Metric label="CV analysés" value="128+" />
              <Metric label="Score IA" value="92%" />
              <Metric label="Pipeline" value="Live" />
            </div>
          </div>
        </motion.section>

        {/* RIGHT FORM */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="xl:col-span-5"
        >
          <div className="bg-white rounded-[36px] shadow-[0_35px_100px_rgba(15,23,42,0.14)] border border-slate-200 p-7 md:p-9 max-w-lg mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-blue-600 text-xs uppercase tracking-[3px] font-black">
                  Secure login
                </p>

                <h2 className="text-4xl font-black text-slate-950 mt-2">
                  Connexion
                </h2>

                <p className="text-slate-500 mt-2">
                  Accédez à votre espace SmartRecruit AI.
                </p>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-3xl shadow-lg">
                <FaRobot />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Adresse email
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-blue-100 transition">
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

                <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50 focus-within:ring-4 focus-within:ring-blue-100 transition">
                  <FaLock className="text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Votre mot de passe"
                    className="bg-transparent outline-none w-full text-slate-900"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
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
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:scale-[1.01] text-white py-4 rounded-2xl font-black text-lg transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaBolt className="animate-pulse" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-600" />

              <p className="text-sm text-slate-600">
                Connexion sécurisée avec authentification JWT et redirection
                automatique selon votre rôle.
              </p>
            </div>

            <p className="text-center text-slate-500 mt-8">
              Vous n’avez pas de compte ?
              <Link
                to="/register"
                className="text-blue-600 font-black ml-2 hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

function FeatureBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] bg-white border border-slate-200 p-5 shadow-sm">
      <div className="text-blue-600 text-2xl mb-4">{icon}</div>
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="text-slate-500 text-sm mt-1">{text}</p>
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

export default Login;