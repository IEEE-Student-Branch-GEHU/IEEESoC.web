import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KeeperLeaderboardRow } from "../types";
import { DEFAULT_KEEPERS, ARTIFACT_IMAGES } from "../data";
import {
  Plus, Edit, Trash2, RotateCcw, Search, Sparkles, X, PlusCircle, Sliders
} from "lucide-react";

interface AdminKeepersPanelProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminKeepersPanel({ onAddLogMessage }: AdminKeepersPanelProps) {
  const [keepers, setKeepers] = useState<KeeperLeaderboardRow[]>(() => {
    const saved = localStorage.getItem("hall_chronicles_keepers");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_KEEPERS;
  });

  const [search, setSearch] = useState("");
  const [editingKeeper, setEditingKeeper] = useState<KeeperLeaderboardRow | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newChronicles, setNewChronicles] = useState(15000);
  const [newReputation, setNewReputation] = useState(150);
  const [newStatus, setNewStatus] = useState<"active" | "dormant" | "synchronizing">("active");

  useEffect(() => {
    localStorage.setItem("hall_chronicles_keepers", JSON.stringify(keepers));
  }, [keepers]);

  const sortByChronicles = (list: KeeperLeaderboardRow[]) =>
    list.sort((a, b) => b.chroniclesCount - a.chroniclesCount).map((k, i) => ({ ...k, rank: i + 1 }));

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) {
      alert("Name and Role are required.");
      return;
    }
    const row: KeeperLeaderboardRow = {
      rank: keepers.length + 1,
      name: newName,
      role: newRole,
      chroniclesCount: newChronicles,
      reputationPoints: newReputation || Math.round(newChronicles / 100),
      imageUrl: ARTIFACT_IMAGES.socrates,
      status: newStatus,
    };
    setKeepers((prev) => sortByChronicles([...prev, row]));
    onAddLogMessage(`Admin nominated new Scribe: "${newName}".`, "success");
    setNewName(""); setNewRole(""); setNewChronicles(15000); setNewReputation(150); setNewStatus("active");
    setShowAddForm(false);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingKeeper) return;
    setKeepers((prev) =>
      sortByChronicles(prev.map((k) => (k.name === editingKeeper.name ? editingKeeper : k)))
    );
    onAddLogMessage(`Admin updated contributor profile for: "${editingKeeper.name}".`, "info");
    setEditingKeeper(null);
  };

  const handleDelete = (name: string) => {
    if (confirm(`Remove keeper "${name}" from the active leaderboard registry?`)) {
      setKeepers((prev) => prev.filter((k) => k.name !== name).map((k, i) => ({ ...k, rank: i + 1 })));
      onAddLogMessage(`Admin removed contributor "${name}" from leaderboard registry.`, "critical");
    }
  };

  const handleBoost = (name: string) => {
    setKeepers((prev) =>
      sortByChronicles(prev.map((k) =>
        k.name === name ? { ...k, chroniclesCount: k.chroniclesCount + 50000, reputationPoints: k.reputationPoints + 500 } : k
      ))
    );
    onAddLogMessage(`Admin offset +50,000 Chronicles score to ${name}.`, "success");
  };

  const handleReset = () => {
    if (confirm("Reset all leaderboard keepers back to initial system defaults?")) {
      setKeepers(DEFAULT_KEEPERS);
      onAddLogMessage("Leaderboard records reset to initial defaults.", "warning");
    }
  };

  const filtered = keepers.filter((k) =>
    [k.name, k.role].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
          <input type="text" placeholder="Search by Nominee name or Role..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/15 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-on-surface/30 bg-surface hover:bg-on-surface/5 transition-all font-mono text-xs uppercase tracking-wider cursor-pointer font-bold">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 notched-card bg-on-surface hover:bg-neutral-800 transition-all text-surface font-mono text-xs uppercase tracking-wider cursor-pointer font-bold">
            <Plus className="w-4 h-4" /> Nominate Contributor
          </button>
        </div>
      </div>

      <div className="font-mono text-[10px] text-on-surface/40 uppercase">
        Showing {filtered.length} of {keepers.length} Nominated Scribes
      </div>

      <div className="overflow-x-auto w-full no-scrollbar border border-on-surface/10 rounded">
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr className="bg-surface-container-high border-b border-on-surface/15 font-mono text-[10px] uppercase text-on-surface/70">
              <th className="p-4 font-bold">Rank</th>
              <th className="p-4 font-bold">Nominee</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Chronicle Score</th>
              <th className="p-4 font-bold">Reputation</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-on-surface/5">
            {filtered.map((k) => (
              <tr key={k.name} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="p-4 font-serif text-sm font-bold text-amber-900">#{k.rank}</td>
                <td className="p-4 font-serif text-sm font-semibold">{k.name}</td>
                <td className="p-4 font-mono text-[10px] opacity-75">{k.role}</td>
                <td className="p-4 font-mono font-semibold">{k.chroniclesCount.toLocaleString()}</td>
                <td className="p-4 font-mono font-semibold text-emerald-800">{k.reputationPoints.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`status-chip font-mono text-[8px] uppercase px-1.5 py-0.5 tracking-wider font-semibold ${
                    k.status === "active"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-800/20"
                      : k.status === "synchronizing"
                      ? "bg-amber-100 text-amber-800 border-amber-800/20 animate-pulse"
                      : "bg-surface-container-high text-on-surface-variant border-on-surface-variant/20"
                  }`}>{k.status}</span>
                </td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  <button onClick={() => handleBoost(k.name)}
                    className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase">
                    <PlusCircle className="w-3 h-3 text-emerald-700" /> Boost
                  </button>
                  <button onClick={() => setEditingKeeper(k)}
                    className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(k.name)}
                    className="p-1.5 border border-rose-800/10 rounded bg-surface hover:bg-rose-50 transition-all text-rose-800 cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase">
                    <Trash2 className="w-3 h-3" /> Demote
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-12 text-center text-on-surface/40 font-mono">No keeper nominees synchronizing with master node lists.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="notched-card bg-surface w-full max-w-md p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6">
              <button onClick={() => setShowAddForm(false)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">Leaderboard Recommendation Ledger</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-on-surface">Nominate Chronicle Scribe</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Archivist Full Name *</label>
                  <input type="text" required placeholder="e.g. Master Penelope"
                    value={newName} onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Official Role / Affiliation *</label>
                  <input type="text" required placeholder="e.g. Metaphysical Ledger Sentry"
                    value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Chronicles Count</label>
                    <input type="number" min="0" value={newChronicles}
                      onChange={(e) => setNewChronicles(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Reputation Level</label>
                    <input type="number" min="0" value={newReputation}
                      onChange={(e) => setNewReputation(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Initial Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface">
                    <option value="active">Active</option>
                    <option value="synchronizing">Synchronizing</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)}
                    className="px-5 py-2 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer">Dismiss</button>
                  <button type="submit"
                    className="px-6 py-2 bg-on-surface hover:bg-neutral-800 text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer">Certify Nominee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingKeeper && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="notched-card bg-surface w-full max-w-md p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6">
              <button onClick={() => setEditingKeeper(null)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">Leaderboard Record Modifier</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-on-surface">Edit Contributor: {editingKeeper.name}</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Official Role / Affiliation *</label>
                  <input type="text" required value={editingKeeper.role}
                    onChange={(e) => setEditingKeeper({ ...editingKeeper, role: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Chronicles Count</label>
                    <input type="number" min="0" value={editingKeeper.chroniclesCount}
                      onChange={(e) => setEditingKeeper({ ...editingKeeper, chroniclesCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Reputation Level</label>
                    <input type="number" min="0" value={editingKeeper.reputationPoints}
                      onChange={(e) => setEditingKeeper({ ...editingKeeper, reputationPoints: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">Sync Status</label>
                  <select value={editingKeeper.status}
                    onChange={(e) => setEditingKeeper({ ...editingKeeper, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface">
                    <option value="active">Active</option>
                    <option value="synchronizing">Synchronizing</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setEditingKeeper(null)}
                    className="px-5 py-2 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer">Dismiss</button>
                  <button type="submit"
                    className="px-6 py-2 bg-on-surface hover:bg-neutral-800 text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer">Apply Overrides</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
