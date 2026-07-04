import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { ReactNode } from "react";
import {
  LayoutDashboard, Archive, Users, Bot, LogOut, Shield
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/artifacts", label: "Project Crate", icon: Archive },
  { to: "/keepers", label: "Leaderboard", icon: Users },
  { to: "/users", label: "Users", icon: Shield },
  { to: "/bot-config", label: "Bot Config", icon: Bot },
];

export default function Layout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-on-surface/10 flex flex-col">
        <div className="p-6 border-b border-on-surface/10">
          <h1 className="font-serif text-xl font-bold text-on-surface">IEEESoC</h1>
          <p className="font-mono text-[10px] text-on-surface/50 uppercase tracking-widest mt-1">Admin Monitor</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded text-sm font-mono transition-colors ${
                  isActive
                    ? "bg-on-surface text-surface"
                    : "text-on-surface/60 hover:text-on-surface hover:bg-surface-container"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-on-surface/10">
          <div className="text-[10px] font-mono text-on-surface/40 mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-mono text-on-surface/60 hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
