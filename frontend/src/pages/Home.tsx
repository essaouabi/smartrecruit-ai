// ===============================
// IMPORTS
// ===============================

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaRobot,
  FaUsers,
  FaFileAlt,
  FaBrain,
  FaDatabase,
  FaServer,
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

// ===============================
// HOME PAGE
// ===============================

function Home() {
  const features = [
    {
      title: "Analyse CV IA",
      description:
        "Analyse automatique des CV avec extraction des compétences, résumé RH et score de matching.",
      icon: <FaFileAlt />,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Assistant RH IA",
      description:
        "Assistant intelligent pour rédiger des offres, préparer des entretiens et comparer des profils.",
      icon: <FaRobot />,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Data Pipeline",
      description:
        "Import CSV, nettoyage, validation, stockage PostgreSQL et historique des imports.",
      icon: <FaDatabase />,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Monitoring",
      description:
        "Supervision backend, logs Winston, incidents Gemini et traçabilité technique.",
      icon: <FaServer />,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  const rncpBlocks = [
    "E1 Data Engineering",
    "E3 Intelligence Artificielle",
    "E4 Fullstack Application",
    "E5 Monitoring & DevOps",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf4ef] via-white to-[#e4ece7] overflow-hidden">
      {/* NAVBAR */}

      <header className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-[#062c22] flex items-center justify-center text-2xl font-black shadow-xl">
            SR
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#062c22]">
              SmartRecruit AI
            </h1>

            <p className="text-sm text-gray-500">
              AI Recruitment Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[#062c22] font-bold hover:text-green-700"
          >
            Connexion
          </Link>

          <Link
            to="/register"
            className="bg-[#0b3d2e] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#145443] transition"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-8 pt-10 pb-20 grid grid-cols-2 gap-14 items-center">
        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold mb-8">
            <FaBrain />
            Plateforme RH intelligente RNCP Ready
          </div>

          <h2 className="text-7xl font-black text-[#062c22] leading-tight mb-8">
            Recrutement augmenté par l’intelligence artificielle
          </h2>

          <p className="text-xl text-gray-600 leading-9 max-w-2xl">
            SmartRecruit AI automatise l’analyse CV, le matching candidat/offre,
            la gestion des offres, la supervision technique et le pipeline de données
            dans une seule plateforme fullstack moderne.
          </p>

          <div className="flex gap-5 mt-10">
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#062c22] to-[#0b3d2e] text-white px-8 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-3"
            >
              Connexion RH
              <FaArrowRight />
            </Link>

            <Link
              to="/register"
              className="bg-white border border-gray-200 text-[#062c22] px-8 py-5 rounded-2xl font-black text-lg hover:bg-green-50 transition-all shadow-sm"
            >
              Créer un compte
            </Link>
          </div>

          {/* TRUST */}

          <div className="grid grid-cols-3 gap-5 mt-12">
            {[
              ["IA", "Gemini API"],
              ["DB", "PostgreSQL"],
              ["Stack", "React + Node"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
              >
                <p className="text-gray-400 text-sm">
                  {label}
                </p>

                <h3 className="text-[#062c22] font-black text-lg">
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
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative"
        >
          <div className="absolute right-[-80px] top-[-80px] w-80 h-80 bg-green-300/30 rounded-full blur-3xl"></div>

          <div className="relative bg-white rounded-[44px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.15)] border border-gray-100">
            {/* MINI DASHBOARD */}

            <div className="bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[36px] p-8 text-white mb-6">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-green-300 font-bold">
                    SmartRecruit Dashboard
                  </p>

                  <h3 className="text-4xl font-black mt-2">
                    92%
                  </h3>

                  <p className="text-green-100">
                    Score IA moyen
                  </p>
                </div>

                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl">
                  <FaChartLine />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  ["CV", "128"],
                  ["Jobs", "24"],
                  ["Logs", "Live"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-white/10 rounded-2xl p-4"
                  >
                    <p className="text-green-200 text-sm">
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
                  className="bg-gray-50 rounded-3xl p-5"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>

                  <h4 className="font-black text-[#062c22] mb-2">
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

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-[#062c22] mb-4">
            Une plateforme complète Data + IA + RH
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            SmartRecruit AI réunit les éléments essentiels d’un projet professionnel :
            frontend, backend, base de données, IA, monitoring et traçabilité.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
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
              className="bg-white rounded-[34px] p-7 shadow-sm border border-gray-100 hover:-translate-y-2 transition-all"
            >
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-6 ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-[#062c22] mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RNCP */}

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-gradient-to-br from-[#031d16] via-[#062c22] to-[#0b3d2e] rounded-[44px] p-10 text-white shadow-xl">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full mb-6">
                <FaShieldAlt className="text-green-300" />
                <span className="font-bold text-green-100">
                  Couverture RNCP
                </span>
              </div>

              <h2 className="text-5xl font-black mb-4">
                Projet structuré pour la soutenance
              </h2>

              <p className="text-green-100 leading-8 max-w-3xl">
                Le projet couvre les blocs Data Engineering, Intelligence Artificielle,
                Développement Fullstack et Monitoring / DevOps avec preuves techniques visibles.
              </p>
            </div>

            <div className="bg-white/10 rounded-3xl p-7 min-w-[230px]">
              <p className="text-green-200">
                État projet
              </p>

              <h3 className="text-4xl font-black mt-2">
                Ready
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {rncpBlocks.map((block) => (
              <div
                key={block}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <FaCheckCircle className="text-green-300 text-2xl mb-4" />

                <h3 className="font-black text-xl">
                  {block}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE */}

      <footer className="max-w-7xl mx-auto px-8 pb-10">
        <div className="bg-white rounded-[34px] p-8 border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-[#062c22]">
              SmartRecruit AI
            </h3>

            <p className="text-gray-500 mt-1">
              Projet développé par Mohamed Amine Essaouabi.
            </p>
          </div>

          <Link
            to="/login"
            className="bg-[#0b3d2e] text-white px-6 py-4 rounded-2xl font-bold"
          >
            Accéder à la plateforme
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;