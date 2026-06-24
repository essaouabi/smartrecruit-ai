// ======================================================
// DASHBOARD LAYOUT - SMARTRECRUIT AI
// ======================================================

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import socket from "../services/socket";
import logoSmartRecruit from "../assets/logo-smartrecruit.png";

import {
  FaChartPie,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaPlus,
  FaServer,
  FaDatabase,
  FaWifi,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaCircle,
} from "react-icons/fa";

interface Props {
  children: React.ReactNode;
}

type NotificationItem = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  date: string;
};

const DashboardLayout = ({ children }: Props) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      type: "success",
      title: "Monitoring actif",
      message: "Les logs backend sont actuellement surveillés.",
      date: new Date().toISOString(),
    },
    {
      type: "info",
      title: "Pipeline de données prêt",
      message: "Import CSV et stockage PostgreSQL opérationnels.",
      date: new Date().toISOString(),
    },
  ]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "candidate";
  const isRecruiter = role === "recruiter";

  const menuItems = isRecruiter
    ? [
        {
          label: "Tableau de bord",
          path: "/recruiter-dashboard",
          icon: <FaChartPie />,
        },
        {
          label: "Candidats",
          path: "/candidates",
          icon: <FaUsers />,
        },
        {
          label: "Emplois",
          path: "/jobs",
          icon: <FaBriefcase />,
        },
        {
          label: "Analyseur CV",
          path: "/cv-analyzer",
          icon: <FaFileAlt />,
        },
        {
          label: "Assistant IA",
          path: "/ai-assistant",
          icon: <FaRobot />,
        },
        {
          label: "Data Pipeline",
          path: "/data-pipeline",
          icon: <FaDatabase />,
        },
        {
          label: "Monitoring",
          path: "/monitoring",
          icon: <FaServer />,
        },
      ]
    : [
        {
          label: "Assistant IA",
          path: "/ai-assistant",
          icon: <FaRobot />,
        },
      ];

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleConnect = () => {
      setIsRealtimeConnected(true);
    };

    const handleDisconnect = () => {
      setIsRealtimeConnected(false);
    };

    const handleNotification = (payload: NotificationItem) => {
      setNotifications((prev) => [
        {
          type: payload.type || "info",
          title: payload.title || "Notification",
          message: payload.message || "Nouvel événement SmartRecruit.",
          date: payload.date || new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    const handleMonitoringLog = (payload: any) => {
      setNotifications((prev) => [
        {
          type: "info",
          title: "Log backend",
          message: payload.message || "Nouvelle activité backend détectée.",
          date: payload.date || new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("monitoring-log", handleMonitoringLog);

    if (socket.connected) {
      setIsRealtimeConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("monitoring-log", handleMonitoringLog);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationStyle = (type: NotificationItem["type"]) => {
    if (type === "success") {
      return {
        box: "bg-emerald-50 border-emerald-100",
        icon: "text-emerald-700 bg-emerald-100",
        iconComponent: <FaCheckCircle />,
      };
    }

    if (type === "error") {
      return {
        box: "bg-red-50 border-red-100",
        icon: "text-red-700 bg-red-100",
        iconComponent: <FaExclamationTriangle />,
      };
    }

    return {
      box: "bg-blue-50 border-blue-100",
      icon: "text-blue-700 bg-blue-100",
      iconComponent: <FaWifi />,
    };
  };

  return (
    <div className="flex min-h-screen bg-[#f6f8fb] text-slate-900">
      <aside className="w-[260px] bg-[#081c15] text-white flex flex-col justify-between px-4 py-5 fixed left-0 top-0 bottom-0 z-50 shadow-2xl">
        <div>
          {/* LOGO */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-[#0d2f24] to-[#134437] rounded-3xl p-4 border border-white/10 shadow-2xl backdrop-blur-xl hover:scale-[1.02] hover:shadow-emerald-500/20 transition-all">
              <img
                src={logoSmartRecruit}
                alt="SmartRecruit AI"
                className="w-[95px] h-auto object-contain"
              />
            </div>

            <h2 className="mt-4 text-xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              SmartRecruit AI
            </h2>

            <p className="text-[10px] tracking-[2px] uppercase text-slate-400 text-center">
              Intelligent Hiring Platform
            </p>
          </div>

          {/* SYSTEM STATUS */}
          <div className="mx-2 mb-7 rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-xl shadow-2xl hover:scale-[1.02] hover:shadow-emerald-500/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-200">Infrastructure</p>

              <FaCircle
                className={`text-[10px] ${
                  isRealtimeConnected ? "text-emerald-400" : "text-orange-400"
                }`}
              />
            </div>

            <h3 className="font-black text-sm">
              {isRealtimeConnected ? "Système en ligne" : "Mode local"}
            </h3>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                    isActive
                      ? "bg-emerald-500 text-[#081c15] border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "text-emerald-50/80 border-transparent hover:bg-white/10 hover:text-white hover:border-white/10 hover:scale-[1.02] hover:shadow-emerald-500/20"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* USER + LOGOUT */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#081c15] flex items-center justify-center font-black shadow-lg">
                {user.fullname ? user.fullname.charAt(0) : "U"}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-emerald-200">Connecté</p>

                <h3 className="font-black text-sm truncate">
                  {user.fullname || "Utilisateur"}
                </h3>

                <p className="text-[11px] text-slate-400 capitalize">
                  {isRecruiter ? "Recruteur" : "Candidat"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-emerald-50/80 hover:bg-red-500 hover:text-white hover:scale-[1.02] transition-all"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-[260px] min-h-screen">
        <header className="h-[76px] bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-7 shadow-sm">
          <div>
            <p className="text-xs text-slate-400 capitalize">{today}</p>

            <h2 className="text-xl font-black text-slate-900">
              Bienvenue à nouveau, {user.fullname || "Utilisateur"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[360px] bg-[#f8fafc]/90 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <FaSearch className="text-slate-400 text-sm" />

              <input
                type="text"
                placeholder={
                  isRecruiter
                    ? "Rechercher candidat, offre..."
                    : "Rechercher..."
                }
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>

            {isRecruiter && (
              <NavLink
                to="/jobs"
                className="bg-[#064e3b] text-white px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-[#043b2d] hover:scale-[1.02] hover:shadow-emerald-500/20 transition-all shadow-lg"
              >
                <FaPlus />
                Nouvel emploi
              </NavLink>
            )}

            <div
              className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border shadow-sm ${
                isRealtimeConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-orange-50 text-orange-700 border-orange-100"
              }`}
            >
              <FaWifi />
              {isRealtimeConnected ? "En ligne" : "Hors ligne"}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-[1.02] transition-all shadow-sm"
              >
                <FaBell className="text-[#064e3b]" />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-[390px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-5 z-50">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Événements temps réel
                      </p>
                    </div>

                    <button
                      onClick={clearNotifications}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <p className="text-slate-500 text-sm">
                          Aucune notification.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification, index) => {
                        const style = getNotificationStyle(notification.type);

                        return (
                          <div
                            key={index}
                            className={`${style.box} rounded-xl p-4 border shadow-sm hover:scale-[1.02] transition-all`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl ${style.icon} flex items-center justify-center text-sm`}
                              >
                                {style.iconComponent}
                              </div>

                              <div className="flex-1">
                                <p className="font-bold text-slate-900">
                                  {notification.title}
                                </p>

                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>

                                <p className="text-xs text-slate-400 mt-2">
                                  {new Date(notification.date).toLocaleString(
                                    "fr-FR"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;