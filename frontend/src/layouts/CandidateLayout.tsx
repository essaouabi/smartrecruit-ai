// ======================================================
// CANDIDATE LAYOUT - SMARTRECRUIT AI
// Premium Compact Candidate Sidebar / Career Hub
// ======================================================

import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logoSmartRecruit from "../assets/logo-smartrecruit.png";

import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaClipboardList,
  FaRobot,
  FaSignOutAlt,
  FaCheckCircle,
  FaRocket,
  FaFilePdf,
  FaShieldAlt,
  FaChevronRight,
  FaBell,
  FaChartLine,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type CandidateLayoutProps = {
  children: ReactNode;
};

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: string;
};

// ======================================================
// COMPONENT
// ======================================================

function CandidateLayout({ children }: CandidateLayoutProps) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fullname = user.fullname || user.name || "Candidat";
  const email = user.email || "candidate@smartrecruit.ai";

  const initials =
    fullname
      ?.split(" ")
      .map((part: string) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  const menuItems: MenuItem[] = [
    {
      label: "Mon espace",
      path: "/candidate-dashboard",
      icon: <FaHome />,
      badge: "Hub",
    },
    {
      label: "Mon profil",
      path: "/candidate-profile",
      icon: <FaUser />,
    },
    {
      label: "Offres",
      path: "/candidate-jobs",
      icon: <FaBriefcase />,
    },
    {
      label: "Candidatures",
      path: "/my-applications",
      icon: <FaClipboardList />,
    },
    {
      label: "Assistant IA",
      path: "/candidate-assistant",
      icon: <FaRobot />,
      badge: "AI",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-[270px] overflow-hidden bg-[#050817] text-white border-r border-white/10 flex flex-col">
        {/* BRAND */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black leading-tight truncate">
                SmartRecruit
              </h1>

              <p className="text-[10px] uppercase tracking-[2px] text-violet-300 font-black">
                Candidate Hub
              </p>
            </div>
          </div>
        </div>

        {/* USER CARD */}
        <div className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-500 p-4 shadow-xl">
            <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-white/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-violet-700 flex items-center justify-center font-black text-lg shrink-0">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h2 className="font-black text-white truncate text-sm">
                    {fullname}
                  </h2>

                  <p className="text-[11px] text-violet-100 truncate">
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <p className="text-[9px] text-violet-100 uppercase font-black tracking-[1.5px]">
                    Profil
                  </p>

                  <h3 className="text-sm font-black text-white mt-1">
                    Actif
                  </h3>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <p className="text-[9px] text-violet-100 uppercase font-black tracking-[1.5px]">
                    Statut
                  </p>

                  <h3 className="text-sm font-black text-white mt-1">
                    Candidat
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="px-4 py-4 space-y-2">
          <p className="px-3 mb-2 text-[10px] uppercase tracking-[3px] text-slate-500 font-black">
            Navigation
          </p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-white/5 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">
                        {item.label}
                      </p>

                      {item.badge && (
                        <p
                          className={`text-[9px] font-black mt-0.5 ${
                            isActive ? "text-pink-100" : "text-slate-500"
                          }`}
                        >
                          {item.badge}
                        </p>
                      )}
                    </div>
                  </div>

                  <FaChevronRight
                    className={`text-[10px] transition shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 group-hover:text-white"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* CAREER CARD COMPACT */}
        <div className="px-4 mt-auto pb-4">
          <div className="rounded-[22px] bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                <FaRocket />
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-white text-sm">
                  Career Progress
                </h3>

                <p className="text-[11px] text-slate-400">
                  Profil candidat IA
                </p>
              </div>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full w-[78%] bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SidebarStatus icon={<FaCheckCircle />} label="CV" />
              <SidebarStatus icon={<FaFilePdf />} label="PDF" />
              <SidebarStatus icon={<FaChartLine />} label="Suivi" />
              <SidebarStatus icon={<FaShieldAlt />} label="Sécurité" />
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 px-4 py-3 rounded-2xl font-black flex items-center justify-center gap-3 transition"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-[270px] min-h-screen w-[calc(100%-270px)]">
        {/* TOP MOBILE / PAGE HEADER SMALL */}
        <div className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-xl border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-violet-600 font-black">
              Candidate Workspace
            </p>

            <h2 className="text-lg font-black text-slate-900">
              Espace candidat SmartRecruit AI
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <FaCheckCircle className="text-emerald-600" />

              <span className="text-sm font-black text-slate-700">
                Profil actif
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-violet-600 shadow-sm">
              <FaBell />
            </div>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

function SidebarStatus({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-2 py-2">
      <span className="text-emerald-400 text-xs">{icon}</span>
      <span className="text-slate-300 font-black text-[11px]">{label}</span>
    </div>
  );
}

export default CandidateLayout;