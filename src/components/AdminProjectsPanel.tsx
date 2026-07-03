import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChronicleArtifact } from "../types";
import { DEFAULT_ARTIFACTS, ARTIFACT_IMAGES } from "../data";
import {
  Plus, Edit, Trash2, RotateCcw, Search, Sparkles, X, Sliders
} from "lucide-react";

interface AdminProjectsPanelProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
  onArtifactsChange?: (artifacts: ChronicleArtifact[]) => void;
}

export default function AdminProjectsPanel({ onAddLogMessage, onArtifactsChange }: AdminProjectsPanelProps) {
  const [artifacts, setArtifacts] = useState<ChronicleArtifact[]>(() => {
    const saved = localStorage.getItem("hall_chronicles_artifacts");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_ARTIFACTS;
  });

  const [search, setSearch] = useState("");
  const [editingArtifact, setEditingArtifact] = useState<ChronicleArtifact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState<"Architectural" | "Mythological" | "Technical" | "Relic">("Technical");
  const [newDescription, setNewDescription] = useState("");
  const [newArchivist, setNewArchivist] = useState("");
  const [newLoad, setNewLoad] = useState(60);
  const [newPurity, setNewPurity] = useState(90);
  const [newMesh, setNewMesh] = useState(5);

  useEffect(() => {
    localStorage.setItem("hall_chronicles_artifacts", JSON.stringify(artifacts));
    onArtifactsChange?.(artifacts);
  }, [artifacts]);

  const resetForm = () => {
    setNewName(""); setNewCode(""); setNewCategory("Technical");
    setNewDescription(""); setNewArchivist("");
    setNewLoad(60); setNewPurity(90); setNewMesh(5);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      alert("Name and Catalog Code are required.");
      return;
    }
    const artifact: ChronicleArtifact = {
      id: "art-" + Date.now(),
      code: newCode.toUpperCase(),
      name: newName,
      description: newDescription || "No custom description cataloged.",
      category: newCategory,
      imageUrl: ARTIFACT_IMAGES.neuralLattice,
      loadIndex: newLoad,
      purityIndex: newPurity,
      cyberMeshLevel: newMesh,
      archivist: newArchivist || "Admin Custodian",
      dateCreated: new Date().toISOString().split("T")[0]
    };
    setArtifacts((prev) => [artifact, ...prev]);
    onAddLogMessage(`Admin created artifact ${artifact.code}: "${artifact.name}".`, "success");
    resetForm();
    setShowAddForm(false);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingArtifact) return;
    setArtifacts((prev) =>
      prev.map((a) => (a.id === editingArtifact.id ? editingArtifact : a))
    );
    onAddLogMessage(`Admin updated artifact ${editingArtifact.code}: "${editingArtifact.name}".`, "info");
    setEditingArtifact(null);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Permanently purge artifact ${code} from the vault database?`)) {
      setArtifacts((prev) => prev.filter((a) => a.id !== id));
      onAddLogMessage(`Admin declassified artifact ${code}.`, "critical");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all project relics to factory defaults?")) {
      setArtifacts(DEFAULT_ARTIFACTS);
      onAddLogMessage("Project Crate registry reset to factory presets.", "warning");
    }
  };

  const filtered = artifacts.filter((a) =>
    [a.name, a.code, a.category, a.archivist].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  const FormFields = ({ artifact, onChange }: {
    artifact: { name: string; code: string; category: string; description: string; archivist: string; loadIndex: number; purityIndex: number; cyberMeshLevel: number };
    onChange: (updated: typeof artifact) => void;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Relic Name *</label>
          <input type="text" required placeholder="e.g. Socratic Logic Engine"
            value={artifact.name}
            onChange={(e) => onChange({ ...artifact, name: e.target.value })}
            className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Catalog Code *</label>
          <input type="text" required placeholder="e.g. TECH-9821"
            value={artifact.code}
            onChange={(e) => onChange({ ...artifact, code: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface uppercase" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Class Definition</label>
          <select value={artifact.category}
            onChange={(e) => onChange({ ...artifact, category: e.target.value })}
            className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface">
            <option value="Technical">Technical</option>
            <option value="Architectural">Architectural</option>
            <option value="Mythological">Mythological</option>
            <option value="Relic">Relic</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Registrar Scribe</label>
          <input type="text" placeholder="e.g. Lysandra"
            value={artifact.archivist}
            onChange={(e) => onChange({ ...artifact, archivist: e.target.value })}
            className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Chronicle Description</label>
        <textarea rows={3} placeholder="Specify relic historical roots, defensive properties, or technical logic details..."
          value={artifact.description}
          onChange={(e) => onChange({ ...artifact, description: e.target.value })}
          className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
      </div>
      <div className="space-y-3 pt-2">
        <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest block">Telemetry Sliders</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "COGNITIVE LOAD", val: artifact.loadIndex, suffix: "%", set: (v: number) => onChange({ ...artifact, loadIndex: v }), min: 10, max: 100 },
            { label: "PURITY RATIO", val: artifact.purityIndex, suffix: "%", set: (v: number) => onChange({ ...artifact, purityIndex: v }), min: 50, max: 100 },
            { label: "CYBER-MESH", val: artifact.cyberMeshLevel, suffix: "/10", set: (v: number) => onChange({ ...artifact, cyberMeshLevel: v }), min: 1, max: 10 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between font-mono text-[9px] mb-1">
                <span>{s.label}</span><span>{s.val}{s.suffix}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.val}
                onChange={(e) => s.set(parseInt(e.target.value))}
                className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
          <input type="text" placeholder="Search by code, title, archivist, or category..."
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
            <Plus className="w-4 h-4" /> Add Project Relic
          </button>
        </div>
      </div>

      <div className="font-mono text-[10px] text-on-surface/40 uppercase">
        Showing {filtered.length} of {artifacts.length} registered relics
      </div>

      <div className="overflow-x-auto w-full no-scrollbar border border-on-surface/10 rounded">
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr className="bg-surface-container-high border-b border-on-surface/15 font-mono text-[10px] uppercase text-on-surface/70">
              <th className="p-4 font-bold">Catalog Code</th>
              <th className="p-4 font-bold">Relic Title</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Load</th>
              <th className="p-4 font-bold">Purity</th>
              <th className="p-4 font-bold">Mesh</th>
              <th className="p-4 font-bold">Scribe</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-on-surface/5">
            {filtered.map((art) => (
              <tr key={art.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-800">{art.code}</td>
                <td className="p-4 font-serif text-sm font-semibold max-w-[200px] truncate">{art.name}</td>
                <td className="p-4">
                  <span className="border border-on-surface/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-on-surface/85">{art.category}</span>
                </td>
                <td className="p-4 font-mono font-semibold">{art.loadIndex}%</td>
                <td className="p-4 font-mono font-semibold text-emerald-800">{art.purityIndex}%</td>
                <td className="p-4 font-mono">{art.cyberMeshLevel}/10</td>
                <td className="p-4">{art.archivist}</td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  <button onClick={() => setEditingArtifact(art)}
                    className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(art.id, art.code)}
                    className="p-1.5 border border-rose-800/10 rounded bg-surface hover:bg-rose-50 transition-all text-rose-800 cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase">
                    <Trash2 className="w-3 h-3" /> Purge
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center text-on-surface/40 font-mono">No project relics mapped to database nodes.</td></tr>
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
              className="notched-card bg-surface w-full max-w-xl p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6">
              <button onClick={() => setShowAddForm(false)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">Vault Registry Command Console</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">Inject Project Relic</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <FormFields artifact={{
                  name: newName, code: newCode, category: newCategory,
                  description: newDescription, archivist: newArchivist,
                  loadIndex: newLoad, purityIndex: newPurity, cyberMeshLevel: newMesh
                }} onChange={(u) => {
                  setNewName(u.name); setNewCode(u.code);
                  setNewCategory(u.category as typeof newCategory);
                  setNewDescription(u.description); setNewArchivist(u.archivist);
                  setNewLoad(u.loadIndex); setNewPurity(u.purityIndex); setNewMesh(u.cyberMeshLevel);
                }} />
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer">Dismiss</button>
                  <button type="submit"
                    className="px-6 py-2.5 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer">Authenticate & Inject</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingArtifact && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="notched-card bg-surface w-full max-w-xl p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6">
              <button onClick={() => setEditingArtifact(null)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">Vault Patch Console</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">Patch Relic: {editingArtifact.code}</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <FormFields artifact={editingArtifact} onChange={(u) => setEditingArtifact({ ...editingArtifact, ...u })} />
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setEditingArtifact(null)}
                    className="px-5 py-2.5 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer">Dismiss</button>
                  <button type="submit"
                    className="px-6 py-2.5 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer">Apply Patch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
