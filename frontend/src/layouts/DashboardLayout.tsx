// ======================================================
// DASHBOARD LAYOUT - SMARTRECRUIT AI
// Ultra Premium Layout / Jury Ready
// ======================================================

import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../services/api";
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
  FaHistory,
  FaExternalLinkAlt,
  FaChevronRight,
  FaBug, // Ajout de FaBug ici
} from "react-icons/fa";

interface Props {
  children: ReactNode;
}

type NotificationType = "success" | "error" | "info";

type NotificationItem = {
  id?: number;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  is_read?: boolean;
};

type QuickStats = {
  totalCandidates: number;
  totalJobs: number;
  totalAnalyses: number;
};

const DashboardLayout = ({ children }: Props) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalCandidates: 0,
    totalJobs: 0,
    totalAnalyses: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "candidate";
  const isRecruiter = role === "recruiter" || role === "admin";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const normalizeNotificationType = (type: any): NotificationType => {
    if (type === "success" || type === "error" || type === "info") {
      return type;
    }

    return "info";
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const formattedNotifications: NotificationItem[] = data.map(
        (notification: any) => ({
          id: notification.id,
          type: normalizeNotificationType(notification.type),
          title: notification.title || "Notification",
          message:
            notification.message || "Nouvel événement SmartRecruit AI.",
          date:
            notification.created_at ||
            notification.date ||
            new Date().toISOString(),
          is_read: notification.is_read ?? false,
        })
      );

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
    }
  };

  const fetchQuickStats = async () => {
    if (!isRecruiter) return;

    try {
      const response = await api.get("/dashboard/stats");

      setQuickStats({
        totalCandidates: response.data?.stats?.totalCandidates || 0,
        totalJobs: response.data?.stats?.totalJobs || 0,
        totalAnalyses: response.data?.stats?.totalAnalyses || 0,
      });
    } catch (error) {
      console.error("Erreur chargement statistiques rapides :", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error("Erreur mise à jour notifications :", error);
    }
  };

  const handleToggleNotifications = () => {
    const nextValue = !showNotifications;

    setShowNotifications(nextValue);

    if (nextValue) {
      markAllNotificationsAsRead();
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.is_read === false
  ).length;

  const menuItems = isRecruiter
    ? [
        {
          label: "Dashboard",
          path: "/recruiter-dashboard",
          icon: <FaChartPie />,
          badge: null,
        },
        {
          label: "Candidats",
          path: "/candidates",
          icon: <FaUsers />,
          badge: quickStats.totalCandidates,
        },
        {
          label: "Emplois",
          path: "/jobs",
          icon: <FaBriefcase />,
          badge: quickStats.totalJobs,
        },
        {
          label: "Analyseur CV",
          path: "/cv-analyzer",
          icon: <FaFileAlt />,
          badge: null,
        },
        {
          label: "Assistant IA",
          path: "/ai-assistant",
          icon: <FaRobot />,
          badge: null,
        },
        {
          label: "Data Pipeline",
          path: "/data-pipeline",
          icon: <FaDatabase />,
          badge: null,
        },
        {
          label: "Monitoring",
          path: "/monitoring",
          icon: <FaServer />,
          badge: null,
        },
        {
          label: "Notifications",
          path: "/notifications",
          icon: <FaBell />,
          badge: unreadCount > 0 ? unreadCount : null,
        },
        // AJOUT DE LA ROUTE INCIDENT CENTER ICI
        {
          label: "Incident Center",
          path: "/incident-center",
          icon: <FaBug />,
          badge: "E5",
        },
        {
          label: "Audit Logs",
          path: "/audit-logs",
          icon: <FaHistory />,
          badge: null,
        },
      ]
    : [
        {
          label: "Dashboard",
          path: "/candidate-dashboard",
          icon: <FaChartPie />,
          badge: null,
        },
        {
          label: "Offres",
          path: "/candidate-jobs",
          icon: <FaBriefcase />,
          badge: null,
        },
        {
          label: "Mes candidatures",
          path: "/my-applications",
          icon: <FaFileAlt />,
          badge: null,
        },
        {
          label: "Profil",
          path: "/candidate-profile",
          icon: <FaUsers />,
          badge: null,
        },
        {
          label: "Assistant IA",
          path: "/candidate-assistant",
          icon: <FaRobot />,
          badge: null,
        },
      ];

  useEffect(() => {
    fetchNotifications();
    fetchQuickStats();

    const handleConnect = () => {
      setIsRealtimeConnected(true);
    };

    const handleDisconnect = () => {
      setIsRealtimeConnected(false);
    };

    const handleNotification = (payload: any) => {
      const notification: NotificationItem = {
        id: payload.data?.id || Date.now(),
        type: normalizeNotificationType(payload.type || payload.data?.type),
        title: payload.title || payload.data?.title || "Notification",
        message:
          payload.message ||
          payload.data?.message ||
          "Nouvel événement SmartRecruit AI.",
        date:
          payload.date ||
          payload.data?.created_at ||
          new Date().toISOString(),
        is_read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
      fetchQuickStats();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);

    if (socket.connected) {
      setIsRealtimeConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getNotificationStyle = (type: NotificationType) => {
    if (type === "success") {
      return {
        box: "bg-emerald-50 border-emerald-100",
        icon: "bg-emerald-100 text-emerald-700",
        iconComponent: <FaCheckCircle />,
      };
    }

    if (type === "error") {
      return {
        box: "bg-red-50 border-red-100",
        icon: "bg-red-100 text-red-700",
        iconComponent: <FaExclamationTriangle />,
      };
    }

    return {
      box: "bg-blue-50 border-blue-100",
      icon: "bg-blue-100 text-blue-700",
      iconComponent: <FaWifi />,
    };
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-[260px] overflow-y-auto bg-[#050b16] text-white shadow-2xl">
        <div className="min-h-screen flex flex-col justify-between px-4 py-5">
          <div>
            {/* LOGO */}
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                <img
                  src={logoSmartRecruit}
                  alt="SmartRecruit AI"
                  className="h-8 w-8 object-contain rounded-lg"
                />
              </div>

              <div>
                <h1 className="text-sm font-black leading-tight">
                  SmartRecruit
                </h1>

                <p className="text-[10px] uppercase tracking-[2px] text-cyan-300 font-black">
                  AI Platform
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>

                  <span className="flex-1">{item.label}</span>

                  {item.badge !== null && item.badge !== undefined && (
                <span className="min-w-[26px] rounded-md bg-slate-800 px-2 py-1 text-center text-[10px] font-black text-cyan-300">
                              {typeof item.badge === "number" && item.badge > 99
                                ? "99+"
                                          : item.badge}
                                                        </span>
                                                      )}    

                  <FaChevronRight className="text-[10px] opacity-0 transition-all group-hover:opacity-100" />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* SYSTEM STATUS */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl">
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />

              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
                  Système IA
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <FaCircle
                    className={`text-[9px] ${
                      isRealtimeConnected
                        ? "text-emerald-400"
                        : "text-orange-400"
                    }`}
                  />

                  <span className="text-sm font-black">
                    {isRealtimeConnected ? "Connecté" : "Mode local"}
                  </span>

                  <span className="text-xs text-cyan-300 font-black">
                    v2.4.1
                  </span>
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  API • PostgreSQL • Socket.io
                </p>
              </div>
            </div>

            {/* USER */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-[#050b16] flex items-center justify-center font-black">
                  {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Connecté</p>

                  <h3 className="truncate text-sm font-black">
                    {user.fullname || "Utilisateur"}
                  </h3>

                  <p className="text-[11px] text-slate-500 capitalize">
                    {isRecruiter ? "Recruteur" : "Candidat"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-white/10 py-3 text-sm font-black text-slate-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <FaSignOutAlt />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ml-[260px] min-h-screen flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-40 h-[78px] border-b border-slate-200 bg-white/85 backdrop-blur-2xl">
          <div className="flex h-full items-center justify-between px-7">
            {/* SEARCH */}
            <div className="hidden lg:flex w-[440px] items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <FaSearch className="text-slate-400 text-sm" />

              <input
                type="text"
                placeholder={
                  isRecruiter
                    ? "Rechercher un candidat, une offre..."
                    : "Rechercher..."
                }
                className="w-full bg-transparent text-sm outline-none"
              />

              <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-black text-slate-400">
                ⌘K
              </span>
            </div>

            <div className="lg:hidden">
              <h2 className="text-lg font-black text-slate-900">
                SmartRecruit AI
              </h2>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <div
                className={`hidden md:flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black ${
                  isRealtimeConnected
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-orange-100 bg-orange-50 text-orange-700"
                }`}
              >
                <FaWifi />
                {isRealtimeConnected ? "Temps réel actif" : "Hors ligne"}
              </div>

              {isRecruiter && (
                <NavLink
                  to="/jobs"
                  className="hidden md:flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg hover:scale-[1.02] transition-all"
                >
                  <FaPlus />
                  Nouvel emploi
                </NavLink>
              )}

              {/* NOTIFICATIONS */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all"
                >
                  <FaBell className="text-slate-700" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-[430px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl z-50">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          Notifications
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          PostgreSQL + Socket.io
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100 flex items-center gap-2"
                        >
                          <FaCheckCircle />
                          Tout lu
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowNotifications(false)}
                          className="h-9 w-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[370px] space-y-3 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-5 text-center">
                          <p className="text-sm font-bold text-slate-500">
                            Aucune notification.
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((notification, index) => {
                          const style = getNotificationStyle(notification.type);

                          return (
                            <div
                              key={notification.id || index}
                              className={`${style.box} rounded-2xl border p-4 shadow-sm ${
                                notification.is_read ? "opacity-70" : ""
                              }`}
                            >
                              <div className="flex gap-3">
                                <div
                                  className={`h-11 w-11 rounded-2xl ${style.icon} flex items-center justify-center text-sm`}
                                >
                                  {style.iconComponent}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="truncate font-black text-slate-900">
                                      {notification.title}
                                    </p>

                                    {!notification.is_read && (
                                      <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-black text-white">
                                        Nouveau
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                    {notification.message}
                                  </p>

                                  <p className="mt-2 text-xs text-slate-400">
                                    {new Date(
                                      notification.date
                                    ).toLocaleString("fr-FR")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <NavLink
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#050b16] px-4 py-3 text-sm font-black text-white hover:bg-slate-800 transition-all"
                    >
                      Voir toutes les notifications
                      <FaExternalLinkAlt />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-7">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;