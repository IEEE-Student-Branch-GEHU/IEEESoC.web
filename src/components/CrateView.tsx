import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChronicleArtifact } from "../types";
import { DEFAULT_ARTIFACTS, ARTIFACT_IMAGES } from "../data";
import { 
  Search, Filter, Plus, Calendar, ShieldAlert, Cpu, 
  User, CheckCircle, Crosshair, Award, Sparkles, X, Heart
} from "lucide-react";

interface CrateViewProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function CrateView({ onAddLogMessage }: CrateViewProps) {
  // Load initial artifacts from localStorage or defaults
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedArtifact, setSelectedArtifact] = useState<ChronicleArtifact | null>(null);
  
  // New Artifact form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState<"Architectural" | "Mythological" | "Technical" | "Relic">("Technical");
  const [newDescription, setNewDescription] = useState("");
  const [newArchivist, setNewArchivist] = useState("");
  const [newLoad, setNewLoad] = useState(65);
  const [newPurity, setNewPurity] = useState(95);
  const [newMesh, setNewMesh] = useState(6);

  // Persistence
  useEffect(() => {
    localStorage.setItem("hall_chronicles_artifacts", JSON.stringify(artifacts));
  }, [artifacts]);

  // Handle artifact creation
  const handleCreateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      alert("Name and Catalog Code are required.");
      return;
    }

    const brandNew: ChronicleArtifact = {
      id: "art-" + Date.now(),
      code: newCode.toUpperCase(),
      name: newName,
      description: newDescription || "No custom description cataloged.",
      category: newCategory,
      imageUrl: ARTIFACT_IMAGES.neuralLattice, // placeholder
      loadIndex: newLoad,
      purityIndex: newPurity,
      cyberMeshLevel: newMesh,
      archivist: newArchivist || "Anonymous Archivist",
      dateCreated: new Date().toISOString().split("T")[0]
    };

    setArtifacts((prev) => [brandNew, ...prev]);
    onAddLogMessage(`Logged Artifact ${brandNew.code}: "${brandNew.name}" into Vault.`, "success");
    
    // Reset form
    setNewName("");
    setNewCode("");
    setNewCategory("Technical");
    setNewDescription("");
    setNewArchivist("");
    setNewLoad(65);
    setNewPurity(95);
    setNewMesh(6);
    setShowAddForm(false);
  };

  const handleRemoveArtifact = (id: string, code: string) => {
    if (confirm(`Declassify or purge artifact ${code} from the active index?`)) {
      setArtifacts((prev) => prev.filter((art) => art.id !== id));
      onAddLogMessage(`Declassified Artifact ${code} from Vault directories.`, "warning");
      if (selectedArtifact?.id === id) {
        setSelectedArtifact(null);
      }
    }
  };

  const filteredArtifacts = artifacts.filter((art) => {
    const matchesSearch = 
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.archivist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative w-full min-h-screen pt-28 pb-40 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-4">
              <span className="border border-on-surface/80 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest text-on-surface">
                Vault Section 04
              </span>
              <div className="h-[1px] flex-grow bg-on-surface/10"></div>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface tracking-tight">
              Project Crate
            </h1>
            <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl">
              A curated digital repository of technical core structures, mythological forges, and classical ruins indexed into secure, queryable storage cells.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-4 notched-card bg-on-surface hover:bg-neutral-800 transition-all text-surface font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Cryptographic Relic
            </button>
          </div>
        </header>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 bg-surface-container/40 p-4 border border-on-surface/5 notched-card">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
            <input 
              type="text"
              placeholder="Search code, title, custodian or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
            />
          </div>

          {/* Category Selectors */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-on-surface/50 mr-2 flex items-center gap-1 uppercase">
              <Filter className="w-3 h-3" /> Classify:
            </span>
            {["All", "Technical", "Architectural", "Mythological", "Relic"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase transition-all tracking-wider border ${
                  selectedCategory === cat 
                    ? "bg-on-surface text-surface border-on-surface font-semibold"
                    : "bg-surface text-on-surface/70 border-on-surface/10 hover:border-on-surface/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ARTIFACTS GRID */}
        {filteredArtifacts.length === 0 ? (
          <div className="notched-card p-16 text-center text-on-surface/60 bg-surface/40 border border-dashed border-on-surface/20">
            <Cpu className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
            <h3 className="font-serif text-2xl text-on-surface">No Chronological Artifact Found</h3>
            <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto mt-2">
              No archives matched your active criteria. Try editing your query term, selecting another category, or log a brand new cryptographic entry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredArtifacts.map((art) => (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group notched-card p-4 bg-surface hover:bg-surface-container transition-all cursor-pointer border border-on-surface/15 flex flex-col justify-between"
                onClick={() => setSelectedArtifact(art)}
              >
                <div className="space-y-4">
                  {/* Image container representation */}
                  <div className="relative aspect-square bg-surface-container-high overflow-hidden notched-card border-none group-hover:opacity-90 transition-opacity">
                    <img 
                      referrerPolicy="no-referrer"
                      alt={art.name} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                      src={art.imageUrl}
                    />
                    <div className="absolute top-2 left-2 bg-on-surface text-surface font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
                      {art.category}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase text-on-surface/40 group-hover:text-amber-800 transition-colors">
                      {art.code}
                    </span>
                    <h4 className="font-serif text-lg leading-tight text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {art.name}
                    </h4>
                  </div>

                  <p className="font-sans text-xs text-on-surface-variant/80 line-clamp-2">
                    {art.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-on-surface/5 flex justify-between items-center text-on-surface/45 font-mono text-[9px]">
                  <span className="flex items-center gap-1 uppercase">
                    <User className="w-2.5 h-2.5" /> {art.archivist}
                  </span>
                  <span>{art.dateCreated}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* MODAL: DETAIL DIALOG */}
        <AnimatePresence>
          {selectedArtifact && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-3xl p-6 md:p-8 border border-on-surface relative shadow-2xl space-y-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column Image */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="aspect-square bg-surface-container-high notched-card border-none overflow-hidden">
                      <img 
                        referrerPolicy="no-referrer"
                        src={selectedArtifact.imageUrl} 
                        alt={selectedArtifact.name}
                        className="w-full h-full object-cover filter grayscale"
                      />
                    </div>

                    <div className="p-4 bg-primary-container/10 border border-on-surface/10 rounded space-y-1">
                      <span className="font-mono text-[8px] text-on-surface/40 uppercase font-bold block">CLASSIFICATION SUMMARY</span>
                      <p className="font-mono text-xs text-on-surface leading-tight">
                        Registered securely by Custodian <strong className="text-on-surface">{selectedArtifact.archivist}</strong>. Synchronized on digital ledger block index.
                      </p>
                    </div>
                  </div>

                  {/* Right Column Specs */}
                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="border border-on-surface/60 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-on-surface">
                          {selectedArtifact.category}
                        </span>
                        <span className="font-mono text-xs text-on-surface/40">•</span>
                        <span className="font-mono text-xs text-on-surface/60 font-semibold">{selectedArtifact.code}</span>
                      </div>
                      <h2 className="font-serif text-3xl text-on-surface tracking-tight font-bold">
                        {selectedArtifact.name}
                      </h2>
                    </div>

                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                      {selectedArtifact.description}
                    </p>

                    {/* GAUGES / INDICATORS */}
                    <div className="space-y-4 pt-4 border-t border-on-surface/10">
                      <h5 className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest">
                        Neural Telemetries & Health
                      </h5>

                      <div className="grid grid-cols-1 gap-4 font-mono text-[11px]">
                        {/* Progress Bar 1 */}
                        <div>
                          <div className="flex justify-between text-on-surface mb-1">
                            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> COGNITIVE LOAD INDEX</span>
                            <span className="font-bold">{selectedArtifact.loadIndex}%</span>
                          </div>
                          <div className="h-1.5 bg-on-surface/10 w-full relative">
                            <div 
                              className="absolute inset-y-0 left-0 bg-on-surface/80"
                              style={{ width: `${selectedArtifact.loadIndex}%` }}
                            />
                          </div>
                        </div>

                        {/* Progress Bar 2 */}
                        <div>
                          <div className="flex justify-between text-on-surface mb-1">
                            <span className="flex items-center gap-1"><Crosshair className="w-3.5 h-3.5" /> INTEGRITY PURITY RATIO</span>
                            <span className="font-bold">{selectedArtifact.purityIndex}%</span>
                          </div>
                          <div className="h-1.5 bg-on-surface/10 w-full relative">
                            <div 
                              className="absolute inset-y-0 left-0 bg-emerald-700/80"
                              style={{ width: `${selectedArtifact.purityIndex}%` }}
                            />
                          </div>
                        </div>

                        {/* Levels Grid Custom */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="p-3 bg-surface-container border border-on-surface/5 flex items-center justify-between">
                            <span className="text-on-surface/60 text-[10px] uppercase">CYBER-MESH LEVEL</span>
                            <span className="font-serif text-xl font-bold text-on-surface">{selectedArtifact.cyberMeshLevel}/10</span>
                          </div>
                          <div className="p-3 bg-surface-container border border-on-surface/5 flex items-center justify-between">
                            <span className="text-on-surface/60 text-[10px] uppercase">CATALOG SPEED</span>
                            <span className="font-serif text-xl font-bold text-on-surface">3.2 ms</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 font-mono text-[10px] text-on-surface/50 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Registered date: {selectedArtifact.dateCreated}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setArtifacts((prev) => 
                              prev.map((art) => 
                                art.id === selectedArtifact.id 
                                  ? { ...art, purityIndex: Math.min(100, art.purityIndex + 1) } 
                                  : art
                              )
                            );
                            setSelectedArtifact((prev) => prev ? { ...prev, purityIndex: Math.min(100, prev.purityIndex + 1) } : null);
                            onAddLogMessage(`Injected alignment signals to recalibrate ${selectedArtifact.code}.`, "info");
                          }}
                          className="px-3 py-1.5 bg-primary-container hover:bg-on-primary-container hover:text-surface transition-colors cursor-pointer border border-on-surface/10 uppercase"
                        >
                          Calibrate Resonance
                        </button>

                        <button
                          onClick={() => handleRemoveArtifact(selectedArtifact.id, selectedArtifact.code)}
                          className="px-3 py-1.5 text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer border border-rose-800/20 uppercase"
                        >
                          Declassify Relic
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD RELIC FORM */}
        <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-xl p-6 md:p-8 border border-on-surface relative shadow-2xl"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Vault Registration Console
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface mb-6">
                  Log Neural Relic Blueprint
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
                        placeholder="e.g. Athena Pillar Core"
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
                        placeholder="e.g. ARCH-5510"
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
                        Registrar Custodian (Custodian Archivist)
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

                  {/* Range Sliders for Stats details */}
                  <div className="space-y-3 pt-2">
                    <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest block">
                      Custom Telemetry Sliders
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Slider 1 */}
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

                      {/* Slider 2 */}
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

                      {/* Slider 3 */}
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
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-2.5 border border-on-surface/10 hover:bg-on-surface/5 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Authenticate & Save
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
