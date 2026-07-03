import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Package, Users, Trophy, Bot, X,
} from "lucide-react";
import AdminCratePanel from "./AdminCratePanel";
import AdminUsersPanel from "./AdminUsersPanel";
import AdminBoardPanel from "./AdminBoardPanel";
import AdminBotPanel from "./AdminBotPanel";

const API = "/api/admin";

const sections = [
  { id: "stats", label: "Stats", icon: LayoutDashboard },
  { id: "crate", label: "Crate", icon: Package },
  { id: "users", label: "Users", icon: Users },
  { id: "board", label: "Board", icon: Trophy },
  { id: "bot", label: "Bot", icon: Bot },
];

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminDashboard({ onAddLogMessage }: Props) {
  const [activeSection, setActiveSection] = useState("stats");

  const renderSection = () => {
    switch (activeSection) {
      case "crate":
        return <AdminCratePanel onAddLogMessage={onAddLogMessage} />;
      case "users":
        return <AdminUsersPanel onAddLogMessage={onAddLogMessage} />;
      case "board":
        return <AdminBoardPanel onAddLogMessage={onAddLogMessage} />;
      case "bot":
        return <AdminBotPanel onAddLogMessage={onAddLogMessage} />;
      default:
        return <StatsPanel onAddLogMessage={onAddLogMessage} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-container pt-28 pb-20 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto flex gap-6">
        <aside className="w-48 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-28">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-mono text-left cursor-pointer transition-all ${
                    activeSection === s.id
                      ? "bg-on-surface text-surface font-bold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-on-surface/10 px-2 py-2 gap-1">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-mono cursor-pointer transition-all ${
                activeSection === s.id
                  ? "bg-on-surface text-surface font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatsPanel({ onAddLogMessage }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("ieeesoc_token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [artRes, keepRes, usersRes, botRes] = await Promise.all([
          fetch(`${API}/artifacts`, { headers }),
          fetch(`${API}/keepers`, { headers }),
          fetch(`${API}/users`, { headers }),
          fetch(`${API}/bot-config`, { headers }),
        ]);

        const art = await artRes.json();
        const keep = await keepRes.json();
        const users = await usersRes.json();
        const bot = await botRes.json();

        setStats({
          artifacts: art.artifacts?.length || 0,
          keepers: keep.keepers?.length || 0,
          users: users.users?.length || 0,
          botConfig: bot.config || null,
        });
      } catch {
        onAddLogMessage("Failed to load admin stats", "critical");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="notched-card bg-surface border border-on-surface/10 p-6">
        <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading telemetry data...</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Artifacts", value: stats?.artifacts ?? 0, color: "text-amber-700" },
    { label: "Active Keepers", value: stats?.keepers ?? 0, color: "text-emerald-700" },
    { label: "Portal Users", value: stats?.users ?? 0, color: "text-blue-700" },
    { label: "Bot Config", value: stats?.botConfig ? "Configured" : "Default", color: "text-rose-700" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface">Admin Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="notched-card bg-surface border border-on-surface/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{c.label}</p>
            <p className={`font-serif text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
        Use the sidebar to manage crate artifacts, portal users, honor board keepers, and bot configuration.
      </p>
    </div>
  );
}
