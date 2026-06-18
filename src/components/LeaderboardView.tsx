import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KeeperLeaderboardRow } from "../types";
import { DEFAULT_KEEPERS } from "../data";
import { 
  Award, Search, ArrowUpDown, ChevronUp, UserPlus, Heart, 
  ShieldAlert, RefreshCw, Sparkles, X, PlusCircle 
} from "lucide-react";

interface LeaderboardViewProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function LeaderboardView({ onAddLogMessage }: LeaderboardViewProps) {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"count" | "reputation" | "rank">("rank");
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [newKeeperName, setNewKeeperName] = useState("");
  const [newKeeperRole, setNewKeeperRole] = useState("");
  const [initialCount, setInitialCount] = useState(10000);
  const [lastPledgeTarget, setLastPledgeTarget] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem("hall_chronicles_keepers", JSON.stringify(keepers));
  }, [keepers]);

  // Handle Pledge action - updates counts dynamically
  const handlePledge = (name: string, amt = 25000) => {
    setKeepers((prev) => {
      const updated = prev.map((k) => {
        if (k.name === name) {
          return {
            ...k,
            chroniclesCount: k.chroniclesCount + amt,
            reputationPoints: k.reputationPoints + Math.round(amt / 100)
          };
        }
        return k;
      });
      // Recalculate ranks based on chronicles count
      return updated
        .sort((a, b) => b.chroniclesCount - a.chroniclesCount)
        .map((k, index) => ({ ...k, rank: index + 1 }));
    });

    setLastPledgeTarget(name);
    setTimeout(() => setLastPledgeTarget(null), 1000);
    onAddLogMessage(`Pledged +${amt.toLocaleString()} Chronicles to Custodian ${name}. reputation level increased!`, "success");
  };

  // Add new nominee
  const handleNominateKeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeeperName.trim() || !newKeeperRole.trim()) {
      alert("Name and Role / Affiliation are required.");
      return;
    }

    const newRow: KeeperLeaderboardRow = {
      rank: keepers.length + 1,
      name: newKeeperName,
      role: newKeeperRole,
      chroniclesCount: initialCount,
      reputationPoints: Math.round(initialCount / 100),
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLvdCLFQsDKHzmGQva0jSSSDkzk_X4AqZi83O6xxO4SebmIyOsuJ8B9HVs1ng8KGU8xzSKCLC-Dzg6DB4g1h9IP2Dg6YhxgUTmRx313qswI2hQVZZtR67eMgeD03PnPZTakvrnvf1nu1hm4MLoNCD5IKEDcT2CmVjcAaRu0MATlXfn_D_hO9uJ-zExRYKcoq0eWelR764KE_k3C--3R61XNxw94DdzOOcEHOAYRGX5QAw0Ndq8dYX8QTc30", // default statue
      status: "synchronizing"
    };

    setKeepers((prev) => {
      const merged = [...prev, newRow];
      return merged
        .sort((a, b) => b.chroniclesCount - a.chroniclesCount)
        .map((k, index) => ({ ...k, rank: index + 1 }));
    });

    onAddLogMessage(`Challenger Nominated: "${newKeeperName}" of "${newKeeperRole}".`, "info");
    
    // Reset Form
    setNewKeeperName("");
    setNewKeeperRole("");
    setInitialCount(10000);
    setShowNominateModal(false);
  };

  // Filter & Sort keepers
  const sortedKeepers = [...keepers]
    .filter((k) => 
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      k.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "count") return b.chroniclesCount - a.chroniclesCount;
      if (sortBy === "reputation") return b.reputationPoints - a.reputationPoints;
      return a.rank - b.rank; // default rank
    });

  return (
    <div className="relative w-full min-h-screen pt-28 pb-40 px-4 md:px-margin-desktop">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="text-center mb-16 space-y-4">
          <span className="font-mono text-[10px] text-on-surface-variant font-bold tracking-[0.3em] uppercase block">
            Registry of Honor
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface tracking-tight">
            Chronicle Keepers
          </h1>
          <div className="w-16 h-[2px] bg-on-surface mx-auto"></div>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-lg mx-auto">
            High-ranking classical custodians who continuously catalog, sync, and calibrate cognitive digital fragments into the Lyceum data engine.
          </p>
        </header>

        {/* ACTIVE LEADERBOARD TOOLS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-high/40 p-4 border border-on-surface/5 notched-card mb-8">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
            <input 
              type="text"
              placeholder="Search archivist name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface"
            />
          </div>

          {/* Sort & Register Nominee actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-on-surface/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface text-on-surface border border-on-surface/10 rounded px-2.5 py-1.5 font-mono text-[10px] uppercase focus:outline-none focus:border-on-surface"
              >
                <option value="rank">Sort by Rank</option>
                <option value="count">Sort by Chronicles</option>
                <option value="reputation">Sort by Reputation</option>
              </select>
            </div>

            <button
              onClick={() => setShowNominateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-on-surface bg-on-surface text-surface hover:bg-neutral-800 transition-all font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Nominate Scribe
            </button>
          </div>
        </div>

        {/* LADDER LISTINGS */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedKeepers.map((keeper, index) => {
              const isPledging = lastPledgeTarget === keeper.name;
              
              // Custom borders for top spots
              let rankStyle = "border-on-surface/15 bg-surface";
              let badgeColor = "bg-primary-container text-on-surface";
              if (keeper.rank === 1) {
                rankStyle = "border-amber-600/40 bg-surface-bright shadow-md shadow-amber-900/5";
                badgeColor = "bg-amber-600 text-white font-bold";
              } else if (keeper.rank === 2) {
                rankStyle = "border-slate-400/40 bg-surface-container-lowest";
                badgeColor = "bg-slate-500 text-white font-bold";
              } else if (keeper.rank === 3) {
                rankStyle = "border-amber-800/30 bg-surface-container-low";
                badgeColor = "bg-amber-800/80 text-white";
              }

              return (
                <motion.div
                  key={keeper.name}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`notched-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${rankStyle}`}
                >
                  {/* Left Side: Avatar & Identity info */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-grow">
                    {/* Rank Badge Indicator */}
                    <div className={`w-10 h-10 ${badgeColor} flex items-center justify-center font-serif text-lg rounded-full notched-card border-none`}>
                      {keeper.rank}
                    </div>

                    {/* Avatar structure */}
                    <div className="w-16 h-16 rounded-full border border-on-surface overflow-hidden bg-surface-container-high/60">
                      <img 
                        referrerPolicy="no-referrer"
                        src={keeper.imageUrl} 
                        alt={keeper.name} 
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>

                    {/* Identity Text */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <h3 className="font-serif text-xl font-bold text-on-surface">
                          {keeper.name}
                        </h3>
                        {/* Status chip */}
                        <span className={`status-chip font-mono text-[8px] uppercase px-1.5 py-0.5 tracking-wider ${
                          keeper.status === "active" 
                            ? "bg-emerald-100 text-emerald-800 border-emerald-800/20" 
                            : keeper.status === "synchronizing" 
                            ? "bg-amber-100 text-amber-800 border-amber-800/20 animate-pulse" 
                            : "bg-surface-container-high text-on-surface-variant border-on-surface-variant/20"
                        }`}>
                          {keeper.status}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] uppercase opacity-60 tracking-wider">
                        {keeper.role}
                      </p>
                    </div>
                  </div>

                  {/* Middle columns stats */}
                  <div className="grid grid-cols-2 gap-8 text-center md:text-right min-w-[170px]">
                    <div>
                      <div className="font-serif text-xl font-bold text-on-surface">
                        {keeper.chroniclesCount.toLocaleString()}
                      </div>
                      <span className="font-mono text-[9px] uppercase opacity-40 block tracking-widest leading-none">
                        CHRONICLES
                      </span>
                    </div>

                    <div>
                      <div className="font-serif text-xl font-bold text-on-surface">
                        {keeper.reputationPoints.toLocaleString()}
                      </div>
                      <span className="font-mono text-[9px] uppercase opacity-40 block tracking-widest leading-none">
                        REPUTATION
                      </span>
                    </div>
                  </div>

                  {/* Right side Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePledge(keeper.name, 15000)}
                      className={`relative overflow-hidden px-4 py-2 hover:bg-neutral-800 transition-colors cursor-pointer border border-on-surface font-mono text-[10px] uppercase tracking-wider ${
                        isPledging ? "bg-on-surface text-surface animate-bounce" : "bg-transparent text-on-surface"
                      }`}
                    >
                      {isPledging ? "Recalibrating..." : "Pledge Purity"}
                    </button>
                    
                    <button
                      onClick={() => handlePledge(keeper.name, 50000)}
                      title="Nominate Grand Volume"
                      className="px-2 py-2 hover:bg-primary-container hover:text-on-surface rounded-full transition-colors font-mono text-[10px] text-on-surface/60 border border-on-surface/5"
                    >
                      <PlusCircle className="w-4 h-4 text-on-surface" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* MODAL: NOMINATE DIALOG */}
        <AnimatePresence>
          {showNominateModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="notched-card bg-surface w-full max-w-md p-6 md:p-8 border border-on-surface relative shadow-2xl"
              >
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setShowNominateModal(false)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
                    Scribe Recommendation Ledger
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-on-surface mb-6">
                  Nominate Chronicle Custodian
                </h3>

                <form onSubmit={handleNominateKeeper} className="space-y-4">
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
                      Affiliation / Official Role *
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

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
                      Initial Catalog Volumes Count
                    </label>
                    <input
                      type="number"
                      min="500"
                      max="1000000"
                      value={initialCount}
                      onChange={(e) => setInitialCount(parseInt(e.target.value) || 10000)}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface"
                    />
                  </div>

                  <div className="p-3 bg-rose-50/50 border border-amber-600/10 text-[10px] text-on-surface-variant font-mono leading-tight space-y-1 rounded">
                    <div className="font-semibold text-amber-900 uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-800" /> Synchronization Mandatory
                    </div>
                    <span>
                      Nominated scribes initialize in deep synchronizing state. Reputation ratings auto-adjust relative to active catalog balances across the master database nodes.
                    </span>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowNominateModal(false)}
                      className="px-5 py-2 hover:border-on-surface/30 border border-on-surface/10 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-on-surface hover:bg-neutral-800 text-surface font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Certify Custodian
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
