import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, List, Play, Cpu, Heart, 
  Terminal, ShieldCheck, HelpCircle, FileText, X, Activity, Archive, Sliders
} from "lucide-react";

// Types & Data
import { TelemetryLog, ChronicleArtifact } from "./types";
import { CORE_TELEMETRIAL_LOGS_PRESET, DEFAULT_ARTIFACTS } from "./data";

// Sub-components
import GalleryView from "./components/GalleryView";
import CrateView from "./components/CrateView";
import LeaderboardView from "./components/LeaderboardView";
import BotSimulatorView from "./components/BotSimulatorView";
import AccessTerminalModal from "./components/AccessTerminalModal";
import AdminView from "./components/AdminView";

export default function App() {
  const [activeTab, setActiveTab] = useState<"gallery" | "crate" | "leaderboard" | "bot" | "admin">("gallery");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [logs, setLogs] = useState<TelemetryLog[]>(CORE_TELEMETRIAL_LOGS_PRESET);
  const [activeFooterModal, setActiveFooterModal] = useState<"privacy" | "status" | "manual" | null>(null);
  const [isPopMode, setIsPopMode] = useState<boolean>(() => {
    return localStorage.getItem("ieeesoc_pop_mode") === "true";
  });

  // Play a synthesized pop sound using Web Audio API
  const playPopChime = (active: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      if (active) {
        // Upward energetic chord
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(659.25, now); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
      } else {
        // Soft bubble pop whistle
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.18); // D4
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Fail silently if audio context is blocked
    }
  };

  const togglePopMode = () => {
    const nextState = !isPopMode;
    setIsPopMode(nextState);
    playPopChime(nextState);
    handleAddNewLog(nextState ? "Retro Neo-Pop Atrium skin initialized! 🎨🎈" : "Reverted back to Classical Renaissance Putty tone.", nextState ? "success" : "info");
  };

  useEffect(() => {
    if (isPopMode) {
      document.body.classList.add("pop-mode");
      localStorage.setItem("ieeesoc_pop_mode", "true");
    } else {
      document.body.classList.remove("pop-mode");
      localStorage.setItem("ieeesoc_pop_mode", "false");
    }
  }, [isPopMode]);

  // Synchronize artifacts list in parent to feed terminal info
  const [artifacts, setArtifacts] = useState<ChronicleArtifact[]>([]);

  useEffect(() => {
    // Read from localStorage or assign default on mount
    const saved = localStorage.getItem("hall_chronicles_artifacts");
    if (saved) {
      try {
        setArtifacts(JSON.parse(saved));
      } catch (e) {
        setArtifacts(DEFAULT_ARTIFACTS);
      }
    } else {
      setArtifacts(DEFAULT_ARTIFACTS);
    }
  }, [activeTab]); // Fetch fresh values on tab switches

  // Helper to add log statement dynamically across all subcomponents
  const handleAddNewLog = (message: string, type: "info" | "warning" | "success" | "critical") => {
    const timestamp = `[${new Date().toTimeString().split(" ")[0]}]`;
    const newLog: TelemetryLog = {
      id: "log-" + Date.now() + Math.random().toString(36).substr(2, 4),
      timestamp,
      message,
      type
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([
      { id: "log-sys-clear", timestamp: `[${new Date().toTimeString().split(" ")[0]}]`, message: "Manual telemetry wipe executed. Standby...", type: "warning" }
    ]);
  };

  // Trigger overclock from terminal
  const handleTerminalOverclock = () => {
    const customEvent = new CustomEvent("override-overclock", { detail: { active: true } });
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="relative min-h-screen bg-primary-container text-on-surface flex flex-col justify-between selection:bg-on-surface selection:text-surface">
      {/* GLOBAL SCENE LIGHT AMBIENCE */}
      <div className="absolute inset-x-0 top-0 h-screen pointer-events-none putty-overlay z-0"></div>

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full flex justify-between items-center px-4 md:px-margin-desktop py-5 z-40 bg-surface/80 backdrop-blur-sm border-b border-on-surface/5">
        
        {/* Logo / Brand */}
        <div 
          onClick={() => setActiveTab("gallery")}
          className="font-serif text-2xl md:text-3xl text-on-surface tracking-tighter cursor-pointer hover:opacity-85 select-none font-bold"
        >
          IEEESOC'26
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex gap-8 items-center bg-surface-container-low border border-on-surface/5 rounded-full px-5 py-1.5 h-11">
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`font-sans text-xs uppercase tracking-widest transition-all p-1.5 cursor-pointer relative ${
              activeTab === "gallery" ? "text-on-surface font-semibold" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Gallery
            {activeTab === "gallery" && (
              <motion.span layoutId="nav-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("crate")}
            className={`font-sans text-xs uppercase tracking-widest transition-all p-1.5 cursor-pointer relative ${
              activeTab === "crate" ? "text-on-surface font-semibold" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Chronicles
            {activeTab === "crate" && (
              <motion.span layoutId="nav-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`font-sans text-xs uppercase tracking-widest transition-all p-1.5 cursor-pointer relative ${
              activeTab === "leaderboard" ? "text-on-surface font-semibold" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Honor Board
            {activeTab === "leaderboard" && (
              <motion.span layoutId="nav-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("bot")}
            className={`font-sans text-xs uppercase tracking-widest transition-all p-1.5 cursor-pointer relative ${
              activeTab === "bot" ? "text-on-surface font-semibold" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Simulations
            {activeTab === "bot" && (
              <motion.span layoutId="nav-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("admin")}
            className={`font-sans text-xs uppercase tracking-widest transition-all p-1.5 cursor-pointer relative ${
              activeTab === "admin" ? "text-on-surface font-semibold" : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Admin Panel
            {activeTab === "admin" && (
              <motion.span layoutId="nav-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-on-surface" />
            )}
          </button>
        </nav>

        {/* Actions cluster */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Pop touch toggle */}
          <button 
            type="button"
            id="pop-mode-toggle"
            onClick={togglePopMode}
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-sans text-[10px] md:text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 font-bold ${
              isPopMode 
                ? "bg-yellow-400 text-black border-2 border-black animate-bounce shadow-[3px_3px_0px_#000]"
                : "bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface border border-on-surface/10 hover:border-on-surface/30"
            }`}
            title="Toggle energetic Pop Touch Art theme!"
          >
            <span>{isPopMode ? "✨ POP ACTIVE" : "🎨 POP MODE"}</span>
          </button>

          {/* Access terminal action button */}
          <button 
            onClick={() => setIsTerminalOpen(true)}
            className="bg-on-surface text-surface hover:bg-neutral-800 active:scale-95 px-4 py-2 sm:px-7 sm:py-3 rounded-full font-mono text-[10px] uppercase tracking-widest cursor-pointer transition-all border border-on-surface flex items-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 animate-pulse" /> Access Terminal
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT PORTALS */}
      <main className="flex-grow w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "gallery" && (
            <motion.div
              key="gallery-view"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.4 }}
            >
              <GalleryView 
                onEnterLyceum={() => handleAddNewLog("Entered the Hall of Wisdom inner sanctum.", "info")} 
                onExploreCrate={() => setActiveTab("crate")} 
              />
            </motion.div>
          )}

          {activeTab === "crate" && (
            <motion.div
              key="crate-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <CrateView onAddLogMessage={handleAddNewLog} />
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <LeaderboardView onAddLogMessage={handleAddNewLog} />
            </motion.div>
          )}

          {activeTab === "bot" && (
            <motion.div
              key="bot-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <BotSimulatorView 
                logs={logs}
                onAddLogMessage={handleAddNewLog}
                onClearLogs={handleClearLogs}
              />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <AdminView 
                onAddLogMessage={handleAddNewLog}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOAT BOTTOM PILL MENU Navigation - Authentic matching the HTML visual exactly */}
      <div className="bottom-nav-container">
        <nav className="nav-pill flex items-center justify-center gap-1 shadow-2xl border border-on-surface" id="bottom-nav">
          <button 
            onClick={() => setActiveTab("crate")}
            className={`px-4 sm:px-6 py-2.5 flex items-center gap-2 rounded-full transition-all font-mono text-[9px] sm:text-[10px] uppercase tracking-wider cursor-pointer ${
              activeTab === "crate" 
                ? "bg-on-surface text-surface" 
                : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Project Crate
          </button>

          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 sm:px-6 py-2.5 flex items-center gap-2 rounded-full transition-all font-mono text-[9px] sm:text-[10px] uppercase tracking-wider cursor-pointer ${
              activeTab === "leaderboard" 
                ? "bg-on-surface text-surface" 
                : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <List className="w-3.5 h-3.5" /> Leaderboards
          </button>

          <button 
            onClick={() => setActiveTab("bot")}
            className={`px-4 sm:px-6 py-2.5 flex items-center gap-2 rounded-full transition-all font-mono text-[9px] sm:text-[10px] uppercase tracking-wider cursor-pointer ${
              activeTab === "bot" 
                ? "bg-on-surface text-surface" 
                : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Bot Simulator
          </button>

          <button 
            onClick={() => setActiveTab("admin")}
            className={`px-4 sm:px-6 py-2.5 flex items-center gap-2 rounded-full transition-all font-mono text-[9px] sm:text-[10px] uppercase tracking-wider cursor-pointer ${
              activeTab === "admin" 
                ? "bg-on-surface text-surface" 
                : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Admin Console
          </button>
        </nav>
      </div>

      {/* GLOBAL FOOTER */}
      <footer className="w-full py-16 border-t border-on-surface/10 bg-surface z-25 relative" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-xs text-on-surface-variant">
          
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="font-serif text-2xl font-bold leading-none text-on-surface">IEEESOC'26</span>
            <span className="opacity-60 text-[10px] tracking-wider font-semibold">
              © 2026 IEEE SOC - HALL OF CHRONICLES
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-80 text-[11px]">
            <button 
              onClick={() => setActiveFooterModal("privacy")}
              className="hover:underline hover:text-on-surface uppercase tracking-wider cursor-pointer"
            >
              Privacy Protocol
            </button>
            <button 
              onClick={() => setActiveFooterModal("status")}
              className="hover:underline hover:text-on-surface uppercase tracking-wider cursor-pointer"
            >
              System Status
            </button>
            <button 
              onClick={() => setActiveFooterModal("manual")}
              className="hover:underline hover:text-on-surface uppercase tracking-wider cursor-pointer"
            >
              Manual
            </button>
          </div>
        </div>
      </footer>

      {/* UNIX COMMAND SHELL OVERLAY */}
      <AccessTerminalModal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        artifacts={artifacts}
        onTriggerOverclock={handleTerminalOverclock}
        onAddLogMessage={handleAddNewLog}
      />

      {/* MODAL: INFO POPOVERS (Privacy, Status, Manual) */}
      <AnimatePresence>
        {activeFooterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="notched-card bg-surface border border-on-surface max-w-lg w-full p-6 relative space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setActiveFooterModal(null)}
                className="absolute right-4 top-4 text-on-surface hover:opacity-75 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {activeFooterModal === "privacy" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-800">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-serif text-xl font-bold uppercase tracking-wider">Privacy Protocol active</h3>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Under the strict classical secure block synchronization standard, the IEEESOC'26 Hall of Chronicles enforces complete local client compartmentalization. 
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    No private keys, user data payloads, or cryptographic relics transit to third-party indexing servers. All calibrations, chronicle logs, and customizations reside safely inside your local storage vault index.
                  </p>
                  <div className="text-[9px] font-mono opacity-50 bg-surface-container p-2 text-center">
                    ENCRYPTION: SHAKE_256_LATTICE_CIPHER_OK
                  </div>
                </div>
              )}

              {activeFooterModal === "status" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-serif text-xl font-bold uppercase tracking-wider animate-pulse">System Status: NOMINAL</h3>
                  </div>
                  <div className="divide-y divide-on-surface/5 font-mono text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span>Vault Block Registry</span>
                      <span className="text-emerald-700 font-bold">ONLINE</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>Chronicle Synchronization Index</span>
                      <span className="text-emerald-700 font-bold">STABLE (99.85%)</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>Scribe Reputation Chain</span>
                      <span className="text-emerald-700 font-bold">SYNC_COMPLETE</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>Gilded Guardian Hydralic loop</span>
                      <span className="text-emerald-700 font-bold">ONLINE (1.4 MPa)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFooterModal === "manual" && (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                  <div className="flex items-center gap-2 text-on-surface">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-serif text-xl font-bold uppercase tracking-wider">Custodian Operations Manual</h3>
                  </div>
                  <div className="font-sans text-xs text-on-surface-variant leading-relaxed space-y-3">
                    <p>
                      <strong>1. Navigating the Sanctum:</strong> Use the top and bottom navigation bars to toggle views. Explore the Gallery, manage the Project Crate relics, view the Archivist Leaderboard, or calibrate the Gilded Guardian's controls.
                    </p>
                    <p>
                      <strong>2. Relic Inoculation:</strong> Select the Project Crate and choose "Log Cryptographic Relic" to catalog custom entries. Enter code standards, assign names, adjust values, and calibrate indexes safely.
                    </p>
                    <p>
                      <strong>3. Automation Management:</strong> Open the Bot Simulator. Click "START TICKER" to active automated telemetry cycles. Use "OVERCLOCK FORGE" for speeds, "DISCHARGE" to cool, or "CALIBRATE" to sync sensory grids.
                    </p>
                    <p>
                      <strong>4. Terminal Commands:</strong> Access the high-frequency Unix command line shell in the header. Supported entries include <code>help</code>, <code>about</code>, <code>list</code>, <code>simulate</code>, and <code>status</code>.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setActiveFooterModal(null)}
                  className="px-5 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase font-bold cursor-pointer"
                >
                  Confirm Readout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
