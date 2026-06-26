// ======================================================
// NOTIFICATIONS CENTER - SMARTRECRUIT AI
// Clean Premium Version / Jury Ready
// ======================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSyncAlt,
  FaTrash,
  FaSearch,
  FaDatabase,
  FaClock,
  FaUserTie,
  FaLayerGroup,
  FaEye,
  FaFilter,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type NotificationType = "success" | "error" | "info";

type NotificationItem = {
  id: number;
  user_id: number | null;
  user_role: string | null;
  type: NotificationType;
  title: string;
  message: string;
  entity: string | null;
  entity_id: number | null;
  is_read: boolean;
  created_at: string;
};

// ======================================================
// COMPONENT
// ======================================================

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "error">(
    "all"
  );

  // ======================================================
  // API
  // ======================================================

  const normalizeType = (type: any): NotificationType => {
    if (type === "success" || type === "error" || type === "info") {
      return type;
    }

    return "info";
  };

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/notifications");

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const formattedData: NotificationItem[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id ?? null,
        user_role: item.user_role ?? null,
        type: normalizeType(item.type),
        title: item.title || "Notification",
        message: item.message || "Nouvel événement SmartRecruit AI.",
        entity: item.entity ?? null,
        entity_id: item.entity_id ?? null,
        is_read: item.is_read ?? false,
        created_at: item.created_at || new Date().toISOString(),
      }));

      setNotifications(formattedData);
    } catch (error) {
      console.error("Erreur récupération notifications :", error);
      alert("Erreur lors de la récupération des notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Erreur lecture notification :", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error("Erreur lecture globale :", error);
    }
  };

  const deleteNotification = async (id: number) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette notification ?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Erreur suppression notification :", error);
    }
  };

  // ======================================================
  // DATA
  // ======================================================

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const value = search.toLowerCase();

      const matchesSearch =
        notification.title?.toLowerCase().includes(value) ||
        notification.message?.toLowerCase().includes(value) ||
        notification.entity?.toLowerCase().includes(value) ||
        notification.user_role?.toLowerCase().includes(value);

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.is_read) ||
        (filter === "read" && notification.is_read) ||
        (filter === "error" && notification.type === "error");

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readNotifications = totalNotifications - unreadNotifications;

  const errorNotifications = notifications.filter(
    (notification) => notification.type === "error"
  ).length;

  const successNotifications = notifications.filter(
    (notification) => notification.type === "success"
  ).length;

  const infoNotifications = notifications.filter(
    (notification) => notification.type === "info"
  ).length;

  const getTypeStyle = (type: NotificationType) => {
    if (type === "success") {
      return {
        icon: <FaCheckCircle />,
        iconBox: "bg-emerald-100 text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        line: "bg-emerald-500",
        label: "Succès",
      };
    }

    if (type === "error") {
      return {
        icon: <FaExclamationTriangle />,
        iconBox: "bg-red-100 text-red-700",
        badge: "bg-red-100 text-red-700 border-red-200",
        line: "bg-red-500",
        label: "Erreur",
      };
    }

    return {
      icon: <FaInfoCircle />,
      iconBox: "bg-cyan-100 text-cyan-700",
      badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
      line: "bg-cyan-500",
      label: "Info",
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#020617] via-[#041337] to-[#06384a] p-7 text-white shadow-2xl"
        >
          <div className="absolute top-[-90px] right-[-90px] w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <FaBell className="text-cyan-300" />

                <span className="text-xs uppercase tracking-[3px] font-black text-cyan-200">
                  SmartRecruit Notifications
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Centre de notifications
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  PostgreSQL & temps réel
                </span>
              </h1>

              <p className="text-slate-300 max-w-3xl mt-4 leading-7">
                Suivez les événements importants : candidatures, changements de
                statut, alertes système et activités RH. Les notifications sont
                persistantes en base PostgreSQL.
              </p>
            </div>

            <div className="xl:col-span-5 grid grid-cols-2 gap-3">
              <HeroMetric title="Total" value={totalNotifications} />
              <HeroMetric title="Non lues" value={unreadNotifications} />
              <HeroMetric title="Lues" value={readNotifications} />
              <HeroMetric title="Erreurs" value={errorNotifications} />
            </div>
          </div>
        </motion.section>

        {/* KPI PROPRE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MiniStat
            title="Total"
            value={totalNotifications}
            icon={<FaBell />}
            color="bg-cyan-50 text-cyan-700"
          />

          <MiniStat
            title="Non lues"
            value={unreadNotifications}
            icon={<FaExclamationTriangle />}
            color="bg-red-50 text-red-700"
          />

          <MiniStat
            title="Succès"
            value={successNotifications}
            icon={<FaCheckCircle />}
            color="bg-emerald-50 text-emerald-700"
          />

          <MiniStat
            title="Infos"
            value={infoNotifications}
            icon={<FaInfoCircle />}
            color="bg-violet-50 text-violet-700"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="xl:col-span-4 space-y-5">
            <PanelCard title="Filtres" subtitle="Recherche et statut">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <FaSearch className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FilterButton
                    label="Toutes"
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                  />

                  <FilterButton
                    label="Non lues"
                    active={filter === "unread"}
                    onClick={() => setFilter("unread")}
                  />

                  <FilterButton
                    label="Lues"
                    active={filter === "read"}
                    onClick={() => setFilter("read")}
                  />

                  <FilterButton
                    label="Erreurs"
                    active={filter === "error"}
                    onClick={() => setFilter("error")}
                  />
                </div>

                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="w-full px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Tout marquer comme lu
                </button>

                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="w-full px-4 py-3 rounded-2xl bg-[#050b16] text-white font-black text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  Actualiser
                </button>
              </div>
            </PanelCard>

            <PanelCard title="État système" subtitle="Notifications backend">
              <div className="space-y-3">
                <StatusLine
                  icon={<FaDatabase />}
                  label="Stockage"
                  value="PostgreSQL"
                />

                <StatusLine
                  icon={<FaShieldAlt />}
                  label="Traçabilité"
                  value="Active"
                />

                <StatusLine
                  icon={<FaBolt />}
                  label="Temps réel"
                  value="Socket.io"
                />

                <StatusLine
                  icon={<FaFilter />}
                  label="Filtres"
                  value="Disponibles"
                />
              </div>
            </PanelCard>
          </div>

          {/* RIGHT PANEL */}
          <div className="xl:col-span-8">
            <PanelCard
              title="Flux des notifications"
              subtitle={`${filteredNotifications.length} notification(s) affichée(s)`}
              action={
                <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-4 py-2 rounded-full text-xs font-black">
                  Live Events
                </span>
              }
            >
              {loading && (
                <div className="bg-slate-50 rounded-[28px] p-12 text-center border border-slate-200">
                  <FaBell className="text-6xl text-cyan-600 mx-auto mb-4 animate-pulse" />

                  <h2 className="text-2xl font-black text-slate-900">
                    Chargement des notifications...
                  </h2>
                </div>
              )}

              {!loading && filteredNotifications.length === 0 && (
                <div className="bg-slate-50 rounded-[28px] p-12 text-center border border-slate-200">
                  <FaDatabase className="text-6xl text-slate-300 mx-auto mb-4" />

                  <h2 className="text-2xl font-black text-slate-900">
                    Aucune notification trouvée
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Les événements importants apparaîtront ici automatiquement.
                  </p>
                </div>
              )}

              {!loading && filteredNotifications.length > 0 && (
                <div className="space-y-4">
                  {filteredNotifications.map((notification, index) => {
                    const style = getTypeStyle(notification.type);

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                        whileHover={{ y: -3 }}
                        className={`relative overflow-hidden rounded-[24px] border p-5 shadow-sm ${
                          notification.is_read
                            ? "bg-white border-slate-200"
                            : "bg-cyan-50/40 border-cyan-100 ring-1 ring-cyan-100"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-1.5 ${style.line}`}
                        />

                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 pl-3">
                          <div className="flex items-start gap-4 min-w-0">
                            <div
                              className={`w-13 h-13 rounded-2xl flex items-center justify-center text-xl shrink-0 ${style.iconBox}`}
                            >
                              {style.icon}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-black border ${style.badge}`}
                                >
                                  {style.label}
                                </span>

                                {!notification.is_read && (
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500 text-white">
                                    Nouveau
                                  </span>
                                )}

                                {notification.entity && (
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                                    {notification.entity}
                                  </span>
                                )}
                              </div>

                              <h2 className="text-xl font-black text-slate-900">
                                {notification.title}
                              </h2>

                              <p className="text-slate-600 mt-2 leading-7">
                                {notification.message}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                <InfoBox
                                  icon={<FaClock />}
                                  label="Date"
                                  value={new Date(
                                    notification.created_at
                                  ).toLocaleString("fr-FR")}
                                />

                                <InfoBox
                                  icon={<FaUserTie />}
                                  label="Rôle"
                                  value={notification.user_role || "Système"}
                                />

                                <InfoBox
                                  icon={<FaLayerGroup />}
                                  label="Entité"
                                  value={
                                    notification.entity_id
                                      ? `#${notification.entity_id}`
                                      : notification.entity || "Non renseignée"
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex xl:flex-col gap-2 shrink-0">
                            {!notification.is_read && (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification.id)}
                                className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                              >
                                <FaEye />
                                Lu
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteNotification(notification.id)}
                              className="px-4 py-3 rounded-2xl bg-red-50 text-red-700 font-black text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                            >
                              <FaTrash />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </PanelCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

function HeroMetric({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[3px] text-slate-400 font-black">
        {title}
      </p>

      <h3 className="text-3xl font-black mt-2 text-white">{value}</h3>
    </div>
  );
}

function MiniStat({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[2px] text-slate-400 font-black">
            {title}
          </p>

          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function PanelCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-2xl font-black text-sm transition ${
        active
          ? "bg-cyan-500 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[1.5px] text-slate-400">
        {icon}
        {label}
      </div>

      <p className="text-sm font-black text-slate-800 mt-2 break-all">
        {value}
      </p>
    </div>
  );
}

function StatusLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="text-cyan-600">{icon}</div>

        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <span className="text-sm font-black text-emerald-600">{value}</span>
    </div>
  );
}

export default Notifications;