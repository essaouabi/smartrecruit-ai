// ===============================
// IMPORTS
// ===============================

import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import socket from "../services/socket";

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
} from "react-icons/fa";

// ===============================
// TYPES
// ===============================

interface Props {
  children: React.ReactNode;
}

type NotificationItem = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  date: string;
};

// ===============================
// DASHBOARD LAYOUT
// ===============================

const DashboardLayout = ({
  children,
}: Props) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [isRealtimeConnected, setIsRealtimeConnected] =
    useState(false);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([
      {
        type: "success",
        title: "Monitoring actif",
        message:
          "Les logs backend sont actuellement surveillés.",
        date: new Date().toISOString(),
      },
      {
        type: "info",
        title: "Data Pipeline disponible",
        message:
          "Import CSV et stockage PostgreSQL opérationnels.",
        date: new Date().toISOString(),
      },
    ]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ===============================
  // SOCKET.IO REALTIME
  // ===============================

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
          message:
            payload.message ||
            "Nouvel événement SmartRecruit.",
          date:
            payload.date ||
            new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    const handleMonitoringLog = (payload: any) => {
      setNotifications((prev) => [
        {
          type: "info",
          title: "Log backend reçu",
          message:
            payload.message ||
            "Nouvelle activité backend détectée.",
          date:
            payload.date ||
            new Date().toISOString(),
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

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // ===============================
  // CLEAR NOTIFICATIONS
  // ===============================

  const clearNotifications = () => {
    setNotifications([]);
  };

  // ===============================
  // MENU ITEMS
  // ===============================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/recruiter-dashboard",
      icon: <FaChartPie />,
    },
    {
      label: "Candidates",
      path: "/candidates",
      icon: <FaUsers />,
    },
    {
      label: "Jobs",
      path: "/jobs",
      icon: <FaBriefcase />,
    },
    {
      label: "CV Analyzer",
      path: "/cv-analyzer",
      icon: <FaFileAlt />,
    },
    {
      label: "AI Assistant",
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
  ];

  // ===============================
  // DATE
  // ===============================

  const today = new Date().toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // ===============================
  // NOTIFICATION STYLE
  // ===============================

  const getNotificationStyle = (
    type: NotificationItem["type"]
  ) => {
    if (type === "success") {
      return {
        box: "bg-green-50 border-green-100",
        icon: "text-green-700 bg-green-100",
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

  // ===============================
  // UI
  // ===============================

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#edf4ef] via-[#f7faf8] to-[#e4ece7]">
      {/* SIDEBAR */}

      <aside className="w-[300px] bg-gradient-to-b from-[#031d16] to-[#062c22] text-white flex flex-col justify-between px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.2)] border-r border-[#124c3b]">
        <div>
          {/* LOGO */}

          <div className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-[#062c22] text-2xl font-black shadow-xl">
                SR
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  SmartRecruit
                </h1>

                <p className="text-green-300 text-sm">
                  AI Recruitment Platform
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div className="bg-[#0d3a2e] border border-[#1d5b49] rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-200">
                    Infrastructure
                  </p>

                  <h3 className="font-bold mt-1">
                    {isRealtimeConnected
                      ? "Realtime Online"
                      : "System Online"}
                  </h3>
                </div>

                <div
                  className={`w-4 h-4 rounded-full animate-pulse ${
                    isRealtimeConnected
                      ? "bg-green-400"
                      : "bg-orange-400"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold ${
                    isActive
                      ? "bg-gradient-to-r from-green-400 to-green-500 text-[#062c22] shadow-2xl scale-[1.02]"
                      : "text-green-100 hover:bg-[#124c3b] hover:translate-x-1"
                  }`
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* FOOTER */}

        <div className="space-y-5">
          {/* USER CARD */}

          <div className="bg-gradient-to-br from-[#124c3b] to-[#0d3a2e] rounded-3xl p-5 border border-[#1f604d]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-400 text-[#062c22] flex items-center justify-center text-xl font-black shadow-xl">
                {user.fullname
                  ? user.fullname.charAt(0)
                  : "H"}
              </div>

              <div>
                <p className="text-sm text-green-200">
                  Connected as
                </p>

                <h3 className="font-bold text-lg">
                  {user.fullname || "HR Team"}
                </h3>

                <p className="text-xs text-green-300">
                  Recruiter Account
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-[#1d5b49] hover:bg-[#124c3b] transition-all duration-300 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
          >
            <FaSignOutAlt />

            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <header className="h-[95px] bg-white/70 backdrop-blur-2xl border-b border-white/40 sticky top-0 z-50 flex items-center justify-between px-10 shadow-sm">
          {/* LEFT */}

          <div>
            <p className="text-sm text-gray-500 capitalize">
              {today}
            </p>

            <h2 className="text-3xl font-black text-[#062c22] mt-1">
              Welcome back, {user.fullname || "HR Team"}
            </h2>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-5">
            {/* SEARCH */}

            <div className="w-[420px] bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <FaSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search candidates, jobs..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>

            {/* NEW JOB */}

            <NavLink
              to="/jobs"
              className="bg-gradient-to-r from-[#0b3d2e] to-[#145443] text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaPlus />

              New Job
            </NavLink>

            {/* REALTIME STATUS */}

            <div
              className={`px-5 py-4 rounded-2xl font-bold flex items-center gap-3 border ${
                isRealtimeConnected
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-orange-50 text-orange-700 border-orange-100"
              }`}
            >
              <FaWifi />

              {isRealtimeConnected
                ? "Live"
                : "Offline"}
            </div>

            {/* NOTIFICATIONS */}

            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="relative w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:scale-105 transition-all duration-300"
              >
                <FaBell className="text-[#0b3d2e]" />

                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 min-w-[22px] h-[22px] px-1 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length > 9
                      ? "9+"
                      : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-5 w-[430px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 p-6 z-50">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-[#062c22]">
                        Notifications Live
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Socket.io realtime events
                      </p>
                    </div>

                    <button
                      onClick={clearNotifications}
                      className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[460px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="bg-gray-50 rounded-2xl p-5 text-center">
                        <p className="text-gray-500">
                          Aucune notification.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (notification, index) => {
                          const style =
                            getNotificationStyle(
                              notification.type
                            );

                          return (
                            <div
                              key={index}
                              className={`${style.box} rounded-2xl p-5 border`}
                            >
                              <div className="flex gap-4">
                                <div
                                  className={`w-11 h-11 rounded-2xl ${style.icon} flex items-center justify-center text-lg`}
                                >
                                  {
                                    style.iconComponent
                                  }
                                </div>

                                <div className="flex-1">
                                  <p className="font-bold text-[#062c22]">
                                    {
                                      notification.title
                                    }
                                  </p>

                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {
                                      notification.message
                                    }
                                  </p>

                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(
                                      notification.date
                                    ).toLocaleString(
                                      "fr-FR"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// ===============================
// EXPORT
// ===============================

export default DashboardLayout;