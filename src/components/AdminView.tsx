import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChronicleArtifact, KeeperLeaderboardRow } from "../types";
import { DEFAULT_ARTIFACTS, DEFAULT_KEEPERS, ARTIFACT_IMAGES } from "../data";
import { 
  Plus, Edit, Trash2, RotateCcw, Sliders, Database, 
  Search, ShieldAlert, Cpu, Heart, CheckCircle2, User, 
  Activity, Award, Sparkles, X, PlusCircle, LayoutGrid, Users,
  Zap, Gauge, Thermometer, ShieldCheck
} from "lucide-react";

interface AdminViewProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

interface BotConfig {
  hydraulicPressure: number;
  laserIntensity: number;
  opticArraySync: number;
  coreTemperature: number;
  overclockActive: boolean;
}

const DEFAULT_BOT_CONFIG: BotConfig = {
  hydraulicPressure: 1.4,
  laserIntensity: 72,
  opticArraySync: 84,
  coreTemperature: 42,
  overclockActive: false
};

export default function AdminView({ onAddLogMessage }: AdminViewProps) {
  // Load artifacts
  const [artifacts, setArtifacts] = useState<ChronicleArtifact[]>(() => {
    const saved = localStorage.getItem("hall_chronicles_artifacts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_ARTIFACTS;
  });

  // Load keepers
  const [keepers, setKeepers] = useState<KeeperLeaderboardRow[]>(() => {
    const saved = localStorage.getItem("hall_chronicles_keepers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_KEEPERS;
  });

  // Load bot config
  const [botConfig, setBotConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem("hall_chronicles_bot_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_BOT_CONFIG;
  });

  // Sub-tabs in admin panel
  const [adminTab, setAdminTab] = useState<"projects" | "keepers" | "automaton">("projects");

  // Search states
  const [projectSearch, setProjectSearch] = useState("");
  const [keeperSearch, setKeeperSearch] = useState("");

  // Edit modals state
  const [editingArtifact, setEditingArtifact] = useState<ChronicleArtifact | null>(null);
  const [editingKeeper, setEditingKeeper] = useState<KeeperLeaderboardRow | null>(null);

  // New states for project form
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState<"Architectural" | "Mythological" | "Technical" | "Relic">("Technical");
  const [newDescription, setNewDescription] = useState("");
  const [newArchivist, setNewArchivist] = useState("");
  const [newLoad, setNewLoad] = useState(60);
  const [newPurity, setNewPurity] = useState(90);
  const [newMesh, setNewMesh] = useState(5);

  // New states for keeper form
  const [showAddKeeperForm, setShowAddKeeperForm] = useState(false);
  const [newKeeperName, setNewKeeperName] = useState("");
  const [newKeeperRole, setNewKeeperRole] = useState("");
  const [newKeeperChronicles, setNewKeeperChronicles] = useState(15000);
  const [newKeeperReputation, setNewKeeperReputation] = useState(150);
  const [newKeeperStatus, setNewKeeperStatus] = useState<"active" | "dormant" | "synchronizing">("active");

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("hall_chronicles_artifacts", JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem("hall_chronicles_keepers", JSON.stringify(keepers));
  }, [keepers]);

  useEffect(() => {
    localStorage.setItem("hall_chronicles_bot_config", JSON.stringify(botConfig));
  }, [botConfig]);

  // Project Functions
  const handleCreateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      alert("Name and Catalog Code are required.");
      return;
    }

    const newArtifact: ChronicleArtifact = {
      id: "art-" + Date.now(),
      code: newCode.toUpperCase(),
      name: newName,
      description: newDescription || "No custom description cataloged.",
      category: newCategory,
      imageUrl: ARTIFACT_IMAGES.neuralLattice, // Default placeholder
      loadIndex: newLoad,
      purityIndex: newPurity,
      cyberMeshLevel: newMesh,
      archivist: newArchivist || "Admin Custodian",
      dateCreated: new Date().toISOString().split("T")[0]
    };

    setArtifacts((prev) => [newArtifact, ...prev]);
    onAddLogMessage(`Admin created artifact ${newArtifact.code}: "${newArtifact.name}".`, "success");
    
    // Reset Add Form
    setNewName("");
    setNewCode("");
    setNewCategory("Technical");
    setNewDescription("");
    setNewArchivist("");
    setNewLoad(60);
    setNewPurity(90);
    setNewMesh(5);
    setShowAddProjectForm(false);
  };

  const handleUpdateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtifact) return;

    setArtifacts((prev) => 
      prev.map((art) => (art.id === editingArtifact.id ? editingArtifact : art))
    );
    onAddLogMessage(`Admin updated artifact ${editingArtifact.code}: "${editingArtifact.name}".`, "info");
    setEditingArtifact(null);
  };

  const handleDeleteArtifact = (id: string, code: string) => {
    if (confirm(`Are you sure you want to permanently purge artifact ${code} from the vault database?`)) {
      setArtifacts((prev) => prev.filter((art) => art.id !== id));
      onAddLogMessage(`Admin declassified/purged artifact ${code} from the vault database.`, "critical");
    }
  };

  const handleResetArtifacts = () => {
    if (confirm("Reset all project relics back to system factory defaults? Any manually added projects will be cleared.")) {
      setArtifacts(DEFAULT_ARTIFACTS);
      onAddLogMessage("Project Crate registry re-synchronized to initial factory presets.", "warning");
    }
  };

  // Keeper Functions
  const handleCreateKeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeeperName.trim() || !newKeeperRole.trim()) {
      alert("Name and Role are required.");
      return;
    }

    const newRow: KeeperLeaderboardRow = {
      rank: keepers.length + 1,
      name: newKeeperName,
      role: newKeeperRole,
      chroniclesCount: newKeeperChronicles,
      reputationPoints: newKeeperReputation || Math.round(newKeeperChronicles / 100),
      imageUrl: ARTIFACT_IMAGES.socrates,
      status: newKeeperStatus
    };

    setKeepers((prev) => {
      const updated = [...prev, newRow];
      // Re-sort based on chronicles count
      return updated
        .sort((a, b) => b.chroniclesCount - a.chroniclesCount)
        .map((k, idx) => ({ ...k, rank: idx + 1 }));
    });

    onAddLogMessage(`Admin nominated new Scribe: "${newKeeperName}".`, "success");

    // Reset Keeper Form
    setNewKeeperName("");
    setNewKeeperRole("");
    setNewKeeperChronicles(15000);
    setNewKeeperReputation(150);
    setNewKeeperStatus("active");
    setShowAddKeeperForm(false);
  };

  const handleUpdateKeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKeeper) return;

    setKeepers((prev) => {
      const updated = prev.map((k) => (k.name === editingKeeper.name ? editingKeeper : k));
      // Re-sort based on chronicles count
      return updated
        .sort((a, b) => b.chroniclesCount - a.chroniclesCount)
        .map((k, idx) => ({ ...k, rank: idx + 1 }));
    });

    onAddLogMessage(`Admin updated contributor profile for: "${editingKeeper.name}".`, "info");
    setEditingKeeper(null);
  };

  const handleDeleteKeeper = (name: string) => {
    if (confirm(`Remove keeper "${name}" from the active leaderboard registry?`)) {
      setKeepers((prev) => {
        const remaining = prev.filter((k) => k.name !== name);
        // Re-calculate ranks
        return remaining.map((k, idx) => ({ ...k, rank: idx + 1 }));
      });
      onAddLogMessage(`Admin removed contributor "${name}" from leaderboard registry.`, "critical");
    }
  };

  const handleResetKeepers = () => {
    if (confirm("Reset all leaderboard keepers back to initial system defaults? All manual score offsets will be cleared.")) {
      setKeepers(DEFAULT_KEEPERS);
      onAddLogMessage("Leaderboard records re-synchronized to initial defaults.", "warning");
    }
  };

  // Bot Functions
  const handleUpdateBotParam = <K extends keyof BotConfig>(key: K, val: BotConfig[K]) => {
    setBotConfig((prev) => ({
      ...prev,
      [key]: val
    }));
    onAddLogMessage(`Admin updated Gilded Guardian baseline: ${String(key)} set to ${val}.`, "info");
  };

  const handleResetBotConfig = () => {
    if (confirm("Reset Gilded Guardian automaton baselines back to system defaults?")) {
      setBotConfig(DEFAULT_BOT_CONFIG);
      onAddLogMessage("Automaton baseline variables re-synchronized to defaults.", "warning");
    }
  };

  // Filter lists
  const filteredArtifacts = artifacts.filter((art) => 
    art.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    art.code.toLowerCase().includes(projectSearch.toLowerCase()) ||
    art.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
    art.archivist.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredKeepers = keepers.filter((k) => 
    k.name.toLowerCase().includes(keeperSearch.toLowerCase()) ||
    k.role.toLowerCase().includes(keeperSearch.toLowerCase())
  );

  // Estimating storage payload
  const storagePayload = (JSON.stringify(artifacts) + JSON.stringify(keepers) + JSON.stringify(botConfig)).length;

  return (
    <div className="relative w-full min-h-screen pt-28 pb-40 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
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
              Root configuration dashboard for manually managing open project credentials, editing contributor scores, and regulating system storage buffers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {adminTab !== "automaton" ? (
              <button
                onClick={adminTab === "projects" ? handleResetArtifacts : handleResetKeepers}
                className="flex items-center gap-2 px-5 py-3 border border-on-surface/30 bg-surface hover:bg-on-surface/5 transition-all font-mono text-xs uppercase tracking-wider cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Registry
              </button>
            ) : (
              <button
                onClick={handleResetBotConfig}
                className="flex items-center gap-2 px-5 py-3 border border-on-surface/30 bg-surface hover:bg-on-surface/5 transition-all font-mono text-xs uppercase tracking-wider cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Baselines
              </button>
            )}
            
            {adminTab !== "automaton" && (
              <button
                onClick={() => {
                  if (adminTab === "projects") {
                    setShowAddProjectForm(true);
                  } else {
                    setShowAddKeeperForm(true);
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 notched-card bg-on-surface hover:bg-neutral-800 transition-all text-surface font-mono text-xs uppercase tracking-wider cursor-pointer font-bold"
              >
                <Plus className="w-4 h-4" /> {adminTab === "projects" ? "Add Project Relic" : "Nominate Contributor"}
              </button>
            )}
          </div>
        </header>

        {/* METRICS DASHBOARD BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="notched-card p-5 bg-surface-container-low border border-on-surface/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-on-surface/40 uppercase font-bold tracking-widest">Total Projects</span>
              <h3 className="font-serif text-3xl font-bold text-on-surface">{artifacts.length}</h3>
            </div>
            <LayoutGrid className="w-8 h-8 text-on-surface/30" />
          </div>

          <div className="notched-card p-5 bg-surface-container-low border border-on-surface/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-on-surface/40 uppercase font-bold tracking-widest">Active Keepers</span>
              <h3 className="font-serif text-3xl font-bold text-on-surface">{keepers.length}</h3>
            </div>
            <Users className="w-8 h-8 text-on-surface/30" />
          </div>

          <div className="notched-card p-5 bg-surface-container-low border border-on-surface/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-on-surface/40 uppercase font-bold tracking-widest">Database Buffer</span>
              <h3 className="font-serif text-xl font-bold text-on-surface">{(storagePayload / 1024).toFixed(2)} KB</h3>
            </div>
            <Database className="w-8 h-8 text-on-surface/30" />
          </div>

          <div className="notched-card p-5 bg-surface-container-low border border-on-surface/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-on-surface/40 uppercase font-bold tracking-widest">Telemetry Link</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="font-mono text-xs text-emerald-800 font-bold uppercase tracking-wider">ACTIVE SYNC</span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-on-surface/30 animate-pulse" />
          </div>
        </div>

        {/* SECTION TOGGLE */}
        <div className="flex border-b border-on-surface/10">
          <button
            onClick={() => setAdminTab("projects")}
            className={`px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
              adminTab === "projects" ? "text-on-surface font-bold" : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            Project Crate Controller
            {adminTab === "projects" && (
              <motion.span layoutId="admin-nav-glow" className="absolute bottom-[-1px] inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>
          
          <button
            onClick={() => setAdminTab("keepers")}
            className={`px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
              adminTab === "keepers" ? "text-on-surface font-bold" : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            Honor Board Regulator
            {adminTab === "keepers" && (
              <motion.span layoutId="admin-nav-glow" className="absolute bottom-[-1px] inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>

          <button
            onClick={() => setAdminTab("automaton")}
            className={`px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
              adminTab === "automaton" ? "text-on-surface font-bold" : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            Automaton Overlord
            {adminTab === "automaton" && (
              <motion.span layoutId="admin-nav-glow" className="absolute bottom-[-1px] inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>
        </div>

        {/* CONTROLLER PANELS */}
        <div className="bg-surface/50 border border-on-surface/10 notched-card p-6 min-h-[400px]">
          
          {/* TAB 1: PROJECTS (ARTIFACTS) MANAGEMENT */}
          {adminTab === "projects" && (
            <div className="space-y-6">
              {/* Search & Tool belt */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
                  <input 
                    type="text"
                    placeholder="Search by code, title, archivist, or category..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/15 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                  />
                </div>
                <div className="font-mono text-[10px] text-on-surface/40 uppercase">
                  Showing {filteredArtifacts.length} of {artifacts.length} registered relics
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto w-full no-scrollbar border border-on-surface/10 rounded">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-on-surface/15 font-mono text-[10px] uppercase text-on-surface/70">
                      <th className="p-4 font-bold">Catalog Code</th>
                      <th className="p-4 font-bold">Relic Title</th>
                      <th className="p-4 font-bold">Class Category</th>
                      <th className="p-4 font-bold">Cog Load</th>
                      <th className="p-4 font-bold">Purity Integrity</th>
                      <th className="p-4 font-bold">Mesh Level</th>
                      <th className="p-4 font-bold">Registrar Scribe</th>
                      <th className="p-4 font-bold text-right">Database Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-surface/5">
                    {filteredArtifacts.map((art) => (
                      <tr key={art.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-amber-800">{art.code}</td>
                        <td className="p-4 font-serif text-sm font-semibold max-w-[200px] truncate">{art.name}</td>
                        <td className="p-4">
                          <span className="border border-on-surface/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-on-surface/85">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold">{art.loadIndex}%</td>
                        <td className="p-4 font-mono font-semibold text-emerald-800">{art.purityIndex}%</td>
                        <td className="p-4 font-mono">{art.cyberMeshLevel}/10</td>
                        <td className="p-4">{art.archivist}</td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setEditingArtifact(art)}
                            className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase"
                            title="Edit project payload"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteArtifact(art.id, art.code)}
                            className="p-1.5 border border-rose-800/10 rounded bg-surface hover:bg-rose-50 transition-all text-rose-800 cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase"
                            title="Purge project relic"
                          >
                            <Trash2 className="w-3 h-3" /> Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredArtifacts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-on-surface/40 font-mono">
                          No project relics mapped to database nodes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: KEEPERS (LEADERBOARD) MANAGEMENT */}
          {adminTab === "keepers" && (
            <div className="space-y-6">
              {/* Search & Tool belt */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
                  <input 
                    type="text"
                    placeholder="Search by Nominee name or Role..."
                    value={keeperSearch}
                    onChange={(e) => setKeeperSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/15 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                  />
                </div>
                <div className="font-mono text-[10px] text-on-surface/40 uppercase">
                  Showing {filteredKeepers.length} of {keepers.length} Nominated Scribes
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto w-full no-scrollbar border border-on-surface/10 rounded">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-on-surface/15 font-mono text-[10px] uppercase text-on-surface/70">
                      <th className="p-4 font-bold">Rank</th>
                      <th className="p-4 font-bold">Nominee Archivist</th>
                      <th className="p-4 font-bold">Official Role/Affiliation</th>
                      <th className="p-4 font-bold">Chronicle Score</th>
                      <th className="p-4 font-bold">Reputation level</th>
                      <th className="p-4 font-bold">Telemetry Status</th>
                      <th className="p-4 font-bold text-right">Database Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-surface/5">
                    {filteredKeepers.map((k) => (
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
                          }`}>
                            {k.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Inject points button */}
                          <button
                            onClick={() => {
                              setKeepers((prev) => {
                                const updated = prev.map((item) => 
                                  item.name === k.name 
                                    ? { ...item, chroniclesCount: item.chroniclesCount + 50000, reputationPoints: item.reputationPoints + 500 }
                                    : item
                                );
                                return updated
                                  .sort((a, b) => b.chroniclesCount - a.chroniclesCount)
                                  .map((item, idx) => ({ ...item, rank: idx + 1 }));
                              });
                              onAddLogMessage(`Admin offset +50,000 Chronicles score to ${k.name}.`, "success");
                            }}
                            className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase"
                            title="Boost chronicles score (+50k)"
                          >
                            <PlusCircle className="w-3 h-3 text-emerald-700" /> Boost
                          </button>

                          <button
                            onClick={() => setEditingKeeper(k)}
                            className="p-1.5 border border-on-surface/10 rounded bg-surface hover:bg-on-surface/5 transition-all text-on-surface cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase"
                            title="Modify keeper credentials"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteKeeper(k.name)}
                            className="p-1.5 border border-rose-800/10 rounded bg-surface hover:bg-rose-50 transition-all text-rose-800 cursor-pointer inline-flex items-center gap-1 font-mono text-[9px] uppercase"
                            title="Demote Scribe"
                          >
                            <Trash2 className="w-3 h-3" /> Demote
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredKeepers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-on-surface/40 font-mono">
                          No keeper nominees synchronizing with master node lists.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATON (BOT) REGULATOR */}
          {adminTab === "automaton" && (
            <div className="space-y-8">
              <div className="max-w-xl space-y-2">
                <h3 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-800 animate-pulse" /> Automaton Overlord Interceptor
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Calibrate active telemetries and baseline constraints for the Gilded Guardian model automaton. Overrides here will directly seed variables used by the physical simulator dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Sliders for Gilded Guardian baselines */}
                <div className="space-y-6 notched-card p-5 bg-surface border border-on-surface/10">
                  <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest border-b border-on-surface/10 pb-2 block">
                    Telemetry Baseline Settings
                  </span>

                  {/* Slider 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Hydraulic Pressure Baseline</span>
                      <span className="font-bold">{botConfig.hydraulicPressure} MPa</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={Math.round(botConfig.hydraulicPressure * 10)}
                      onChange={(e) => handleUpdateBotParam("hydraulicPressure", parseFloat((parseInt(e.target.value) / 10).toFixed(2)))}
                      className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                    />
                    <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
                      <span>0.5 MPa (MIN)</span>
                      <span>3.0 MPa (MAX)</span>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Optic Laser Power Baseline</span>
                      <span className="font-bold">{botConfig.laserIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={botConfig.laserIntensity}
                      onChange={(e) => handleUpdateBotParam("laserIntensity", parseInt(e.target.value))}
                      className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                    />
                    <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
                      <span>10% (LOW)</span>
                      <span>100% (CRITICAL)</span>
                    </div>
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Optic Focal Array Target Sync</span>
                      <span className="font-bold">{botConfig.opticArraySync}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={botConfig.opticArraySync}
                      onChange={(e) => handleUpdateBotParam("opticArraySync", parseInt(e.target.value))}
                      className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                    />
                    <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
                      <span>50% (DIVERGED)</span>
                      <span>100% (ALIGNED)</span>
                    </div>
                  </div>
                </div>

                {/* Overclock and temperature settings */}
                <div className="space-y-6 notched-card p-5 bg-surface border border-on-surface/10">
                  <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest border-b border-on-surface/10 pb-2 block">
                    Safety & Thermal Constraints
                  </span>

                  {/* Slider 4 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> Core Target Temperature</span>
                      <span className="font-bold">{botConfig.coreTemperature}°C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={botConfig.coreTemperature}
                      onChange={(e) => handleUpdateBotParam("coreTemperature", parseInt(e.target.value))}
                      className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                    />
                    <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
                      <span>20°C (COOL)</span>
                      <span>80°C (WARM)</span>
                    </div>
                  </div>

                  {/* Overclock Toggle */}
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-800/10 rounded notched-card border-none">
                      <div className="space-y-1 flex-grow pr-4">
                        <span className="font-mono text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                          Automated Overclock Lockout
                        </span>
                        <p className="font-sans text-[10px] text-on-surface-variant leading-tight">
                          Forcibly lock the Gilded Guardian into hyper-velocity clock speeds. Disables manual cockpit laser dial scaling.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleUpdateBotParam("overclockActive", !botConfig.overclockActive)}
                        className={`px-4 py-2 border rounded font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer ${
                          botConfig.overclockActive 
                            ? "bg-rose-700 text-surface border-rose-850" 
                            : "bg-surface text-on-surface border-on-surface/20"
                        }`}
                      >
                        {botConfig.overclockActive ? "LOCKED ACTIVE" : "STANDBY"}
                      </button>
                    </div>

                    <div className="p-3.5 bg-primary-container/10 border border-on-surface/5 text-[10px] font-mono leading-relaxed space-y-1 rounded text-on-surface-variant">
                      <div className="font-bold uppercase text-on-surface flex items-center gap-1 text-[9px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-800" /> Synchronization Loop Active
                      </div>
                      <span>
                        Changes made here will instantly re-calibrate the Gilded Guardian state variables. Sync metrics are written to local ledger blocks.
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* MODAL: ADD RELIC FORM */}
        <AnimatePresence>
          {showAddProjectForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-xl p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setShowAddProjectForm(false)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Vault Registry Command Console
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
                  Inject Project Relic
                </h3>

                <form onSubmit={handleCreateArtifact} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Relic Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Socratic Logic Engine"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Catalog Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TECH-9821"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Class Definition
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Architectural">Architectural</option>
                        <option value="Mythological">Mythological</option>
                        <option value="Relic">Relic</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Registrar Scribe Custodian
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lysandra"
                        value={newArchivist}
                        onChange={(e) => setNewArchivist(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                      Chronicle Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify relic historical roots, defensive properties, or technical logic details..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest block">
                      Custom Telemetry Sliders
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>COGNITIVE LOAD</span>
                          <span>{newLoad}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={newLoad}
                          onChange={(e) => setNewLoad(parseInt(e.target.value))}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>PURITY RATIO</span>
                          <span>{newPurity}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={newPurity}
                          onChange={(e) => setNewPurity(parseInt(e.target.value))}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>CYBER-MESH</span>
                          <span>{newMesh}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={newMesh}
                          onChange={(e) => setNewMesh(parseInt(e.target.value))}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddProjectForm(false)}
                      className="px-5 py-2.5 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Authenticate & Inject
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT RELIC FORM */}
        <AnimatePresence>
          {editingArtifact && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-xl p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setEditingArtifact(null)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Vault Patch Console
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
                  Patch Relic: {editingArtifact.code}
                </h3>

                <form onSubmit={handleUpdateArtifact} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Relic Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArtifact.name}
                        onChange={(e) => setEditingArtifact({ ...editingArtifact, name: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Catalog Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArtifact.code}
                        onChange={(e) => setEditingArtifact({ ...editingArtifact, code: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Class Definition
                      </label>
                      <select
                        value={editingArtifact.category}
                        onChange={(e) => setEditingArtifact({ ...editingArtifact, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Architectural">Architectural</option>
                        <option value="Mythological">Mythological</option>
                        <option value="Relic">Relic</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                        Registrar Scribe Custodian
                      </label>
                      <input
                        type="text"
                        value={editingArtifact.archivist}
                        onChange={(e) => setEditingArtifact({ ...editingArtifact, archivist: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">
                      Chronicle Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingArtifact.description}
                      onChange={(e) => setEditingArtifact({ ...editingArtifact, description: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest block">
                      Custom Telemetry Sliders
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>COGNITIVE LOAD</span>
                          <span>{editingArtifact.loadIndex}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={editingArtifact.loadIndex}
                          onChange={(e) => setEditingArtifact({ ...editingArtifact, loadIndex: parseInt(e.target.value) })}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>PURITY RATIO</span>
                          <span>{editingArtifact.purityIndex}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={editingArtifact.purityIndex}
                          onChange={(e) => setEditingArtifact({ ...editingArtifact, purityIndex: parseInt(e.target.value) })}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-mono text-[9px] mb-1">
                          <span>CYBER-MESH</span>
                          <span>{editingArtifact.cyberMeshLevel}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editingArtifact.cyberMeshLevel}
                          onChange={(e) => setEditingArtifact({ ...editingArtifact, cyberMeshLevel: parseInt(e.target.value) })}
                          className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingArtifact(null)}
                      className="px-5 py-2.5 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Apply Patch
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD KEEPER FORM */}
        <AnimatePresence>
          {showAddKeeperForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-md p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setShowAddKeeperForm(false)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Leaderboard Recommendation Ledger
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-on-surface">
                  Nominate Chronicle Scribe
                </h3>

                <form onSubmit={handleCreateKeeper} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Archivist Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Penelope"
                      value={newKeeperName}
                      onChange={(e) => setNewKeeperName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Official Role / Affiliation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metaphysical Ledger Sentry"
                      value={newKeeperRole}
                      onChange={(e) => setNewKeeperRole(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                        Chronicles Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newKeeperChronicles}
                        onChange={(e) => setNewKeeperChronicles(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                        Reputation Level
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newKeeperReputation}
                        onChange={(e) => setNewKeeperReputation(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Initial Status
                    </label>
                    <select
                      value={newKeeperStatus}
                      onChange={(e) => setNewKeeperStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                    >
                      <option value="active">Active</option>
                      <option value="synchronizing">Synchronizing</option>
                      <option value="dormant">Dormant</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddKeeperForm(false)}
                      className="px-5 py-2 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-on-surface hover:bg-neutral-800 text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Certify Nominee
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT KEEPER FORM */}
        <AnimatePresence>
          {editingKeeper && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-md p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setEditingKeeper(null)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Leaderboard Record Modifier
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-on-surface">
                  Edit Contributor: {editingKeeper.name}
                </h3>

                <form onSubmit={handleUpdateKeeper} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Official Role / Affiliation *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingKeeper.role}
                      onChange={(e) => setEditingKeeper({ ...editingKeeper, role: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                        Chronicles Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingKeeper.chroniclesCount}
                        onChange={(e) => setEditingKeeper({ ...editingKeeper, chroniclesCount: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                        Reputation Level
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingKeeper.reputationPoints}
                        onChange={(e) => setEditingKeeper({ ...editingKeeper, reputationPoints: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Sync Status
                    </label>
                    <select
                      value={editingKeeper.status}
                      onChange={(e) => setEditingKeeper({ ...editingKeeper, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                    >
                      <option value="active">Active</option>
                      <option value="synchronizing">Synchronizing</option>
                      <option value="dormant">Dormant</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingKeeper(null)}
                      className="px-5 py-2 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-on-surface hover:bg-neutral-800 text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Apply Overrides
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
