import { useState } from "react";
import { motion } from "motion/react";
import { ChronicleArtifact } from "../types";
import {
  LayoutGrid, Users, Database, Activity
} from "lucide-react";
import AdminProjectsPanel from "./AdminProjectsPanel";
import AdminKeepersPanel from "./AdminKeepersPanel";
import AdminAutomatonPanel from "./AdminAutomatonPanel";

interface AdminViewProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
  onArtifactsChange?: (artifacts: ChronicleArtifact[]) => void;
}

export default function AdminView({ onAddLogMessage, onArtifactsChange }: AdminViewProps) {
  const [adminTab, setAdminTab] = useState<"projects" | "keepers" | "automaton">("projects");

  const artifactCount = JSON.parse(localStorage.getItem("hall_chronicles_artifacts") || "[]").length || 8;
  const keeperCount = JSON.parse(localStorage.getItem("hall_chronicles_keepers") || "[]").length || 5;
  const storagePayload =
    (localStorage.getItem("hall_chronicles_artifacts")?.length || 0) +
    (localStorage.getItem("hall_chronicles_keepers")?.length || 0) +
    (localStorage.getItem("hall_chronicles_bot_config")?.length || 0);

  return (
    <div className="relative w-full min-h-screen pt-28 pb-40 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto space-y-10">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-on-surface/10 pb-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-4">
              <span className="border border-on-surface/80 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest text-on-surface">
                Admin Center Section 00
              </span>
              <div className="h-[1px] flex-grow bg-on-surface/10"></div>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface tracking-tight font-bold">
              Lyceum Admin Console
            </h1>
            <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl">
              Root configuration dashboard for managing project credentials, contributor scores, and system storage buffers.
            </p>
          </div>

        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: artifactCount, icon: LayoutGrid },
            { label: "Active Keepers", value: keeperCount, icon: Users },
            { label: "Database Buffer", value: `${(storagePayload / 1024).toFixed(2)} KB`, icon: Database, small: true },
            { label: "Telemetry Link", value: "ACTIVE SYNC", icon: Activity, pulse: true },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="notched-card p-5 bg-surface-container-low border border-on-surface/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-on-surface/40 uppercase font-bold tracking-widest">{m.label}</span>
                  <h3 className={`font-serif font-bold text-on-surface ${m.small ? "text-xl" : "text-3xl"}`}>{m.value}</h3>
                  {m.pulse && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                      <span className="font-mono text-xs text-emerald-800 font-bold uppercase tracking-wider">ACTIVE SYNC</span>
                    </div>
                  )}
                </div>
                <Icon className={`w-8 h-8 text-on-surface/30 ${m.pulse ? "animate-pulse" : ""}`} />
              </div>
            );
          })}
        </div>

        <div className="flex border-b border-on-surface/10">
          {[
            { key: "projects" as const, label: "Project Crate Controller" },
            { key: "keepers" as const, label: "Honor Board Regulator" },
            { key: "automaton" as const, label: "Automaton Overlord" },
          ].map((t) => (
            <button key={t.key}
              onClick={() => setAdminTab(t.key)}
              className={`px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
                adminTab === t.key ? "text-on-surface font-bold" : "text-on-surface/40 hover:text-on-surface"
              }`}>
              {t.label}
              {adminTab === t.key && (
                <motion.span layoutId="admin-nav-glow" className="absolute bottom-[-1px] inset-x-0 h-[2px] bg-on-surface" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-surface/50 border border-on-surface/10 notched-card p-6 min-h-[400px]">
          {adminTab === "projects" && (
            <AdminProjectsPanel onAddLogMessage={onAddLogMessage} onArtifactsChange={onArtifactsChange} />
          )}
          {adminTab === "keepers" && (
            <AdminKeepersPanel onAddLogMessage={onAddLogMessage} />
          )}
          {adminTab === "automaton" && (
            <AdminAutomatonPanel onAddLogMessage={onAddLogMessage} />
          )}
        </div>

      </div>
    </div>
  );
}
