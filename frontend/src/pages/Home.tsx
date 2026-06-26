// ======================================================
// HOME PAGE - SMARTRECRUIT AI
// International Corporate SaaS Landing Page
// Light Premium Design
// ======================================================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

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
  FaGlobe,
  FaRocket,
  FaUsers,
  FaLayerGroup,
  FaNetworkWired,
  FaTerminal,
  FaCogs,
  FaPlay,
  FaBriefcase,
  FaSearch,
  FaUserCheck,
  FaClipboardList,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
};

type StackItem = {
  label: string;
  value: string;
  icon: ReactNode;
};

type Step = {
  title: string;
  description: string;
  icon: ReactNode;
};

// ======================================================
// HOME
// ======================================================

function Home() {
  const features: Feature[] = [
    {
      title: "AI Resume Analysis",
      description:
        "Analyse automatique des CV, extraction des compétences, score IA et recommandation RH.",
      icon: <FaFileAlt />,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Smart Matching",
      description:
        "Matching intelligent entre candidat, compétences, offre et contexte métier.",
      icon: <FaBrain />,
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Recruiter Copilot",
      description:
        "Assistant IA pour rédiger des offres, préparer les entretiens et comparer les profils.",
      icon: <FaRobot />,
      color: "bg-cyan-50 text-cyan-700",
    },
    {
      title: "Candidate Experience",
      description:
        "Espace candidat moderne avec suivi des candidatures, analyse CV et recommandations.",
      icon: <FaUsers />,
      color: "bg-pink-50 text-pink-700",
    },
    {
      title: "Data Pipeline",
      description:
        "Import CSV, nettoyage, validation, historisation et stockage PostgreSQL.",
      icon: <FaDatabase />,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "DevOps Monitoring",
      description:
        "Logs backend, audit trail, notifications, Socket.io, tests et CI/CD.",
      icon: <FaServer />,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  const stack: StackItem[] = [
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
      label: "Security",
      value: "JWT + Middleware",
      icon: <FaLock />,
    },
    {
      label: "DevOps",
      value: "GitHub Actions",
      icon: <FaCloud />,
    },
  ];

  const steps: Step[] = [
    {
      title: "Collect",
      description: "Collecte des offres, CV et données candidates.",
      icon: <FaSearch />,
    },
    {
      title: "Analyze",
      description: "Analyse IA des profils, compétences et expériences.",
      icon: <FaBrain />,
    },
    {
      title: "Match",
      description: "Matching candidat/offre avec scoring intelligent.",
      icon: <FaChartLine />,
    },
    {
      title: "Decide",
      description: "Aide à la décision RH avec recommandations claires.",
      icon: <FaUserCheck />,
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
    <div className="min-h-screen bg-[#f8fbff] text-slate-950 overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-180px] right-[-120px] w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-3xl" />
        <div className="absolute top-[360px] left-[-200px] w-[620px] h-[620px] bg-violet-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-220px] right-[20%] w-[620px] h-[620px] bg-cyan-200/40 rounded-full blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-10 py-4 flex items-center justify-between">
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

          <nav className="hidden lg:flex items-center gap-8 text-sm font-black text-slate-600">
            <a href="#platform" className="hover:text-blue-600 transition">
              Platform
            </a>

            <a href="#features" className="hover:text-blue-600 transition">
              Features
            </a>

            <a href="#architecture" className="hover:text-blue-600 transition">
              Architecture
            </a>

            <a href="#rncp" className="hover:text-blue-600 transition">
              RNCP
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-5 py-3 rounded-2xl font-black text-slate-700 hover:bg-slate-100 transition"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pt-20 pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="xl:col-span-6"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 px-5 py-3 rounded-full font-black mb-8">
              <FaGlobe />
              International AI Hiring Platform
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-[1.03] tracking-tight">
              Modern hiring,
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg md:text-xl leading-9 text-slate-600">
              SmartRecruit AI est une plateforme fullstack de recrutement
              intelligent qui combine analyse CV, matching candidat/offre,
              assistant RH IA, data pipeline, audit logs et monitoring DevOps.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="group bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition flex items-center gap-3"
              >
                Accéder à la plateforme
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/register"
                className="bg-white border border-slate-200 text-slate-950 px-8 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition flex items-center gap-3 shadow-sm"
              >
                <FaPlay />
                Créer un compte
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TrustCard
                icon={<FaBrain />}
                label="AI Engine"
                value="Smart Matching"
              />

              <TrustCard
                icon={<FaDatabase />}
                label="Data Core"
                value="PostgreSQL"
              />

              <TrustCard
                icon={<FaShieldAlt />}
                label="Security"
                value="JWT + Audit"
              />
            </div>
          </motion.div>

          {/* RIGHT PRODUCT UI */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="xl:col-span-6"
          >
            <div className="relative rounded-[42px] bg-white border border-slate-200 shadow-[0_40px_120px_rgba(15,23,42,0.14)] p-5">
              <div className="rounded-[34px] bg-slate-950 p-6 text-white overflow-hidden relative">
                <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-[-90px] left-[-90px] w-72 h-72 bg-violet-500/30 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-blue-300 font-black">
                      SmartRecruit Intelligence
                    </p>

                    <h3 className="text-6xl font-black mt-3">92%</h3>

                    <p className="text-slate-400 mt-1">Average AI score</p>
                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center text-3xl">
                    <FaChartLine />
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <DarkMetric label="CV analyzed" value="128+" />
                  <DarkMetric label="Jobs created" value="24" />
                  <DarkMetric label="AI score" value="92%" />
                  <DarkMetric label="Pipeline" value="Live" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <MiniProductCard
                  icon={<FaFileAlt />}
                  title="CV Intelligence"
                  text="Extraction, résumé, score IA et décision."
                  color="bg-blue-50 text-blue-700"
                />

                <MiniProductCard
                  icon={<FaRobot />}
                  title="Recruiter Copilot"
                  text="Offres, questions et comparaison profils."
                  color="bg-violet-50 text-violet-700"
                />

                <MiniProductCard
                  icon={<FaDatabase />}
                  title="Data Pipeline"
                  text="CSV, validation, historique PostgreSQL."
                  color="bg-pink-50 text-pink-700"
                />

                <MiniProductCard
                  icon={<FaTerminal />}
                  title="Monitoring"
                  text="Logs, audit, Socket.io et CI/CD."
                  color="bg-orange-50 text-orange-700"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGOS / TRUST STRIP */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-20">
        <div className="rounded-[30px] bg-white border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <TrustStripItem icon={<FaRocket />} label="AI Ready" />
            <TrustStripItem icon={<FaShieldAlt />} label="Secure" />
            <TrustStripItem icon={<FaCloud />} label="CI/CD" />
            <TrustStripItem icon={<FaDatabase />} label="Data Driven" />
            <TrustStripItem icon={<FaNetworkWired />} label="Realtime" />
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section
        id="platform"
        className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-24"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 rounded-[40px] bg-slate-950 text-white p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-[-120px] right-[-120px] w-80 h-80 bg-blue-500/25 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center text-3xl mb-8">
                <FaLayerGroup />
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                One platform for the complete recruitment workflow.
              </h2>

              <p className="text-slate-300 leading-8 mt-6">
                Une plateforme claire, moderne et démontrable devant le jury :
                recruteur, candidat, IA, données, sécurité et supervision.
              </p>
            </div>
          </div>

          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                whileHover={{ y: -6 }}
                className="rounded-[32px] bg-white border border-slate-200 p-7 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>

                  <span className="text-xs uppercase tracking-[3px] font-black text-slate-400">
                    Step {index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  {step.title}
                </h3>

                <p className="text-slate-500 leading-7 mt-3">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-24"
      >
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-full text-blue-700 font-black mb-5 shadow-sm">
            <FaBolt />
            Enterprise-ready recruitment suite
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-5 text-slate-950">
            Designed for global recruitment teams.
          </h2>

          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-8">
            SmartRecruit AI regroupe les fonctionnalités essentielles d’une
            solution internationale : IA, data, expérience candidat,
            automatisation RH et supervision technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -8 }}
              className="rounded-[32px] bg-white border border-slate-200 p-7 shadow-lg"
            >
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-6 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-950 mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-500 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section
        id="architecture"
        className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-24"
      >
        <div className="rounded-[44px] bg-white border border-slate-200 shadow-xl p-8 md:p-10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 mb-10">
            <div>
              <p className="text-blue-600 uppercase tracking-[3px] text-xs font-black mb-3">
                Modern architecture
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-slate-950">
                Built with a professional fullstack foundation.
              </h2>

              <p className="text-slate-500 mt-4 max-w-3xl leading-8">
                Une architecture complète avec frontend React, API Express,
                PostgreSQL, authentification JWT, documentation Swagger,
                monitoring et CI/CD.
              </p>
            </div>

            <span className="bg-slate-950 text-white px-5 py-3 rounded-2xl font-black">
              Fullstack + AI + DevOps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stack.map((item) => (
              <div
                key={item.label}
                className="rounded-[26px] bg-slate-50 border border-slate-200 p-6"
              >
                <div className="text-blue-600 text-2xl mb-5">
                  {item.icon}
                </div>

                <p className="text-xs text-slate-400 uppercase tracking-[2px] font-black">
                  {item.label}
                </p>

                <h3 className="font-black text-slate-950 mt-2">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[30px] bg-slate-950 text-white p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black">
                Production-ready technical base
              </h3>

              <p className="text-slate-300 mt-2 leading-7">
                Tests Jest, Swagger, GitHub Actions, Socket.io, audit logs,
                notifications persistantes et supervision backend.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 px-5 py-4 rounded-2xl font-black flex items-center gap-3">
              <FaCogs />
              Connected Stack
            </div>
          </div>
        </div>
      </section>

      {/* RNCP */}
      <section
        id="rncp"
        className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-24"
      >
        <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-700 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute right-[-100px] bottom-[-100px] w-96 h-96 bg-pink-400/25 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-10">
            <div className="xl:col-span-8">
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-full mb-6">
                <FaShieldAlt className="text-cyan-200" />

                <span className="font-black text-cyan-100">
                  RNCP Technical Coverage
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-5">
                A project ready for professional presentation.
              </h2>

              <p className="text-indigo-100 leading-8 max-w-4xl">
                Le projet présente des preuves visibles : data engineering,
                intégration IA, développement fullstack, CI/CD, monitoring,
                audit logs, base de données, Socket.io et documentation API.
              </p>
            </div>

            <div className="xl:col-span-4 rounded-[28px] bg-white/10 border border-white/10 p-6">
              <p className="text-indigo-100 text-sm">Project status</p>
              <h3 className="text-5xl font-black mt-2">Ready</h3>
              <p className="text-indigo-200 mt-2">
                Soutenance preparation
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-5">
            {rncpBlocks.map((block) => (
              <div
                key={block}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <FaCheckCircle className="text-cyan-200 text-2xl mb-4" />

                <h3 className="font-black text-lg">{block}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="relative z-10 max-w-[1440px] mx-auto px-6 xl:px-10 pb-10">
        <div className="rounded-[36px] bg-white border border-slate-200 p-7 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-950">
                SmartRecruit AI
              </h3>

              <p className="text-slate-500 mt-1">
                Global recruitment intelligence platform • Projet développé par
                Mohamed Amine Essaouabi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition flex items-center gap-2"
            >
              Accéder à la plateforme
              <FaArrowRight />
            </Link>

            <Link
              to="/register"
              className="bg-slate-100 text-slate-950 px-6 py-4 rounded-2xl font-black hover:bg-slate-200 transition"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

function TrustCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white border border-slate-200 p-5 shadow-sm">
      <div className="text-blue-600 text-xl mb-3">{icon}</div>

      <p className="text-slate-400 text-sm font-bold">{label}</p>

      <h3 className="text-slate-950 font-black text-lg mt-1">{value}</h3>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <h4 className="text-2xl font-black mt-2">{value}</h4>
    </div>
  );
}

function MiniProductCard({
  icon,
  title,
  text,
  color,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className="rounded-[26px] bg-slate-50 border border-slate-200 p-5">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${color}`}
      >
        {icon}
      </div>

      <h4 className="font-black text-slate-950">{title}</h4>

      <p className="text-sm text-slate-500 leading-6 mt-2">{text}</p>
    </div>
  );
}

function TrustStripItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-slate-700 font-black">
      <span className="text-blue-600">{icon}</span>
      {label}
    </div>
  );
}

export default Home;