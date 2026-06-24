import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaUser,
  FaBriefcase,
  FaClipboardList,
  FaRobot,
  FaSignOutAlt,
  FaIdCard,
  FaCircle,
} from "react-icons/fa";

interface Props {
  children: React.ReactNode;
}

const CandidateLayout = ({ children }: Props) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Mon espace",
      path: "/candidate-dashboard",
      icon: <FaUser />,
    },
    {
      label: "Mon profil",
      path: "/candidate-profile",
      icon: <FaIdCard />,
    },
    {
      label: "Offres disponibles",
      path: "/candidate-jobs",
      icon: <FaBriefcase />,
    },
    {
      label: "Mes candidatures",
      path: "/my-applications",
      icon: <FaClipboardList />,
    },
    {
      label: "Assistant IA",
      path: "/candidate-assistant",
      icon: <FaRobot />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 bottom-0 w-[285px] bg-[#020617] text-white p-5 flex flex-col justify-between border-r border-white/10">
        <div>
          <div className="mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-2xl shadow-lg">
              S
            </div>

            <h1 className="text-2xl font-black mt-4">
              SmartRecruit AI
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Candidate Intelligence Hub
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="candidate-active-link"
                        className="absolute inset-0 rounded-2xl bg-white/10"
                      />
                    )}

                    <span className="relative z-10 text-lg">
                      {item.icon}
                    </span>

                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="rounded-3xl bg-white/10 border border-white/10 p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black">
                {(user.fullname || user.name || "Candidat")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <FaCircle className="text-green-400 text-[8px]" />
                  Connecté
                </p>

                <h3 className="font-black truncate">
                  {user.fullname || user.name || "Candidat"}
                </h3>

                <p className="text-xs text-cyan-300">
                  Candidat
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/20 py-3 rounded-2xl font-black transition"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="ml-[285px] w-full p-6">
        {children}
      </main>
    </div>
  );
};

export default CandidateLayout;