// ======================================================
// HOME PAGE - SMARTRECRUIT AI
// ======================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import logoSmartRecruit from "../assets/logo-smartrecruit.png";

import {
  FaRobot,
  FaFileAlt,
  FaBrain,
  FaDatabase,
  FaServer,
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaBolt,
  FaCode,
  FaLock,
  FaCloud,
} from "react-icons/fa";

// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  const features = [
    {
      title: "Analyse CV IA",
      description:
        "Extraction automatique des compétences, résumé RH, score IA et décision candidat.",
      icon: <FaFileAlt />,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Assistant RH IA",
      description:
        "Génération d’offres, questions d’entretien, synthèse candidat et aide au recrutement.",
      icon: <FaRobot />,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Data Pipeline",
      description:
        "Import CSV, nettoyage, validation, historique, stockage PostgreSQL et traçabilité.",
      icon: <FaDatabase />,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Monitoring DevOps",
      description:
        "Logs Winston, Socket.io, Swagger, GitHub Actions, tests Jest et supervision backend.",
      icon: <FaServer />,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  const stats = [
    ["CV analysés", "128+"],
    ["Offres créées", "24"],
    ["Score IA moyen", "92%"],
    ["Pipeline", "Live"],
  ];

  const stack = [
    {
      label: "Frontend",
      value: "React + TypeScript",
      icon: <FaCode />,
    },
    {
      label: "Backend",
      value: "Node.js + Express",
      icon: <FaServer />,
    },
    {
      label: "Database",
      value: "PostgreSQL",
      icon: <FaDatabase />,
    },
    {
      label: "Sécurité",
      value: "JWT + Middleware",
      icon: <FaLock />,
    },
    {
      label: "DevOps",
      value: "GitHub Actions",
      icon: <FaCloud />,
    },
  ];

  const rncpBlocks = [
    "E1 Data Engineering",
    "E2 Service IA",
    "E3 Développement IA",
    "E4 Fullstack",
    "E5 Monitoring & DevOps",
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fb] overflow-hidden text-[#071f19]">
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#0d2f24] to-[#134437] rounded-2xl p-2 border border-emerald-500/20 shadow-md">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-14 h-14 object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#064e3b] to-[#2563eb] bg-clip-text text-transparent">
                SmartRecruit AI
              </h1>

              <p className="text-xs tracking-[1.5px] uppercase text-gray-500">
                Intelligent Hiring Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[#064e3b] font-black hover:text-emerald-600 transition"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="bg-[#064e3b] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#043b2d] transition shadow-lg"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative max-w-7xl mx-auto px-8 pt-16 pb-20 grid grid-cols-1 xl:grid-cols-2 gap-14 items-center">
        <div className="absolute top-20 right-20 w-[460px] h-[460px] bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[320px] h-[320px] bg-blue-300/20 rounded-full blur-3xl"></div>

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-3 rounded-full font-black mb-8 shadow-sm">
            <FaBrain />
            Plateforme RH intelligente RNCP Ready
          </div>

          <h2 className="text-6xl xl:text-7xl font-black leading-tight mb-8 tracking-tight">
            Recrutez plus vite avec une IA RH intelligente.
          </h2>

          <p className="text-xl text-gray-600 leading-9 max-w-2xl">
            SmartRecruit AI automatise l’analyse des CV, le matching
            candidat/offre, le scoring IA, la gestion des offres, la supervision
            backend et le pipeline de données dans une plateforme fullstack
            moderne.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#064e3b] to-[#0f766e] text-white px-8 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-3"
            >
              Accéder au dashboard
              <FaArrowRight />
            </Link>

            <Link
              to="/register"
              className="bg-white border border-gray-200 text-[#064e3b] px-8 py-5 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-sm"
            >
              Créer un compte
            </Link>
          </div>

          {/* TRUST CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
            {[
              ["IA", "Matching intelligent"],
              ["Data", "PostgreSQL + CSV"],
              ["DevOps", "CI/CD + Monitoring"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
              >
                <p className="text-gray-400 text-sm">
                  {label}
                </p>

                <h3 className="text-[#064e3b] font-black text-lg mt-1">
                  {value}
                </h3>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative z-10"
        >
          <div className="relative bg-white rounded-[42px] p-7 shadow-[0_30px_90px_rgba(15,23,42,0.14)] border border-gray-100">
            {/* MINI DASHBOARD */}

            <div className="bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[34px] p-8 text-white mb-6 overflow-hidden relative">
              <div className="absolute right-[-60px] top-[-60px] w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

              <div className="relative flex justify-between items-start mb-10">
                <div>
                  <p className="text-emerald-300 font-black">
                    SmartRecruit Dashboard
                  </p>

                  <h3 className="text-5xl font-black mt-2">
                    92%
                  </h3>

                  <p className="text-emerald-100">
                    Score IA moyen
                  </p>
                </div>

                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
                  <FaChartLine />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {stats.map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-white/10 border border-white/10 rounded-2xl p-4"
                  >
                    <p className="text-emerald-200 text-sm">
                      {label}
                    </p>

                    <h4 className="font-black text-2xl">
                      {value}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURES MINI */}

            <div className="grid grid-cols-2 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-[#f8fafc] border border-gray-100 rounded-3xl p-5"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>

                  <h4 className="font-black text-[#064e3b] mb-2">
                    {feature.title}
                  </h4>

                  <p className="text-sm text-gray-500 leading-6">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          FEATURES SECTION
      ================================================== */}

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-full text-emerald-700 font-black mb-5">
            <FaBolt />
            Solution complète pour recruteurs
          </div>

          <h2 className="text-5xl font-black text-[#071f19] mb-4">
            Data + IA + Recrutement dans une seule plateforme.
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Une architecture complète avec frontend, backend, base de données,
            API IA, tests, documentation Swagger et supervision technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="bg-white rounded-[30px] p-7 shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all"
            >
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-6 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-[#064e3b] mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          STACK SECTION
      ================================================== */}

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-black text-[#071f19]">
                Architecture technique moderne
              </h2>

              <p className="text-gray-500 mt-2">
                Stack complète utilisée dans SmartRecruit AI.
              </p>
            </div>

            <span className="bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl font-black">
              Fullstack + IA + DevOps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stack.map((item) => (
              <div
                key={item.label}
                className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100"
              >
                <div className="text-emerald-700 text-2xl mb-4">
                  {item.icon}
                </div>

                <p className="text-sm text-gray-400">
                  {item.label}
                </p>

                <h3 className="font-black text-[#064e3b] mt-1">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          RNCP SECTION
      ================================================== */}

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[44px] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-[-80px] bottom-[-80px] w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col xl:flex-row xl:justify-between xl:items-start gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full mb-6">
                <FaShieldAlt className="text-emerald-300" />

                <span className="font-black text-emerald-100">
                  Couverture RNCP
                </span>
              </div>

              <h2 className="text-5xl font-black mb-4">
                Projet prêt pour la soutenance.
              </h2>

              <p className="text-emerald-100 leading-8 max-w-3xl">
                Le projet présente des preuves techniques visibles : API REST,
                documentation Swagger, CI/CD GitHub Actions, tests Jest,
                PostgreSQL, Socket.io, monitoring et intelligence artificielle.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-7 min-w-[230px]">
              <p className="text-emerald-200">
                État projet
              </p>

              <h3 className="text-4xl font-black mt-2">
                Ready
              </h3>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-5">
            {rncpBlocks.map((block) => (
              <div
                key={block}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <FaCheckCircle className="text-emerald-300 text-2xl mb-4" />

                <h3 className="font-black text-lg">
                  {block}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="max-w-7xl mx-auto px-8 pb-10">
        <div className="bg-white rounded-[30px] p-7 border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#0d2f24] to-[#134437] rounded-2xl p-2 border border-emerald-500/20">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-12 h-12 object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#064e3b]">
                SmartRecruit AI
              </h3>

              <p className="text-gray-500 mt-1">
                Intelligent Recruitment Platform • Projet développé par Mohamed
                Amine Essaouabi.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="bg-[#064e3b] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#043b2d] transition"
          >
            Accéder à la plateforme
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;