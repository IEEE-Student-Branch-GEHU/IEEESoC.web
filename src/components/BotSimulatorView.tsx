import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BotSimulatorState, TelemetryLog } from "../types";
import { CORE_TELEMETRIAL_LOGS_PRESET, ARTIFACT_IMAGES } from "../data";
import { 
  Play, RotateCcw, Zap, Thermometer, ShieldAlert, CheckCircle, 
  Settings, Power, HelpCircle, Activity, Gauge, Terminal, RefreshCw
} from "lucide-react";

interface BotSimulatorViewProps {
  logs: TelemetryLog[];
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
  onClearLogs: () => void;
}

export default function BotSimulatorView({ logs, onAddLogMessage, onClearLogs }: BotSimulatorViewProps) {
  // Simulator State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [hydraulicPressure, setHydraulicPressure] = useState(1.4); // MPa
  const [laserIntensity, setLaserIntensity] = useState(72); // %
  const [opticArraySync, setOpticArraySync] = useState(84); // %
  const [coreTemperature, setCoreTemperature] = useState(42); // °C
  const [overclockActive, setOverclockActive] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom whenever they change
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Simulated live ticker for active state runs
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        // Randomly fluctuate values slightly
        setHydraulicPressure((p) => {
          const delta = (Math.random() - 0.5) * 0.15;
          const target = overclockActive ? 2.1 : 1.4;
          return Math.max(0.8, Math.min(3.0, parseFloat((p + (target - p) * 0.2 + delta).toFixed(2))));
        });

        setOpticArraySync((s) => {
          const delta = Math.floor((Math.random() - 0.5) * 4);
          return Math.max(50, Math.min(100, s + delta));
        });

        setCoreTemperature((t) => {
          const heatingFactor = overclockActive ? 3 : 0.6;
          const coolingFactor = isCalibrating ? -4 : -0.2;
          const fluctuation = (Math.random() - 0.4) * 2;
          const newT = Math.round(t + heatingFactor + coolingFactor + fluctuation);
          
          if (newT > 85 && Math.random() > 0.7) {
            onAddLogMessage(`CRITICAL WARNING: Core Temperature reached high limits (${newT}°C). Initiate Cooling cycle.`, "critical");
          }
          return Math.max(25, Math.min(110, newT));
        });

        if (Math.random() > 0.85) {
          const logMessages = [
            "Optoelectronic stabilizers reporting healthy sync factors.",
            "Hydraulic backup cell recharging standard cycles.",
            "Analyzing perimeter mesh telemetry flags...",
            "Cognitive data blocks feeding to Main Vault Section 04."
          ];
          onAddLogMessage(logMessages[Math.floor(Math.random() * logMessages.length)], "info");
        }

      }, 2500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, overclockActive, isCalibrating]);

  // ACTIONS
  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      onAddLogMessage("Telemetry engine synchronized. Automated Gilded Guardian simulation loop STARTED.", "success");
    } else {
      onAddLogMessage("Telemetry engine decoupled. Simulation loop PAUSED.", "warning");
    }
  };

  const handleCoolingFlow = () => {
    onAddLogMessage("Active refrigeration matrix activated. Discharging ambient core heat...", "info");
    setIsCalibrating(true);
    setTimeout(() => {
      setCoreTemperature(32);
      setOverclockActive(false);
      setIsCalibrating(false);
      onAddLogMessage("Coolant flow complete. Temperature stabilized at safe 32°C.", "success");
    }, 1500);
  };

  const handleOverclockMode = () => {
    const nextOverclock = !overclockActive;
    setOverclockActive(nextOverclock);
    if (nextOverclock) {
      onAddLogMessage("OVERCLOCK MODE PRIMED. Hyper-velocity digital logic active. Expect high thermal levels.", "critical");
      setLaserIntensity(98);
      setHydraulicPressure(2.2);
    } else {
      onAddLogMessage("Overclock disabled. Returning to architectural baseline parameters.", "info");
      setLaserIntensity(72);
      setHydraulicPressure(1.4);
    }
  };

  const handleCalibrateSensors = () => {
    setIsCalibrating(true);
    onAddLogMessage("Realigning laser intensity matrices and optic focal arrays...", "info");
    setTimeout(() => {
      setOpticArraySync(99);
      setIsCalibrating(false);
      onAddLogMessage("Optic Alignment recalibrated to 99.8% precision factor.", "success");
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen pt-28 pb-40 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border border-on-surface/80 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold text-on-surface">
                TERMINAL_01A
              </span>
              <span className="font-mono text-xs text-on-surface/40">•</span>
              <span className={`flex items-center gap-1 font-mono text-[9px] uppercase ${isPlaying ? "text-emerald-700 font-bold" : "text-amber-800"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-600 animate-ping" : "bg-amber-600"}`}></span>
                {isPlaying ? "Telemetry Connected" : "Telemetry Suspended"}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface tracking-tight">
              Bot Simulator
            </h1>
          </div>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-sm">
            Control center responsible for simulating motor logic codes, thermal thresholds, and laser synchronization of the automatons.
          </p>
        </header>

        {/* MAIN SPLIT VIEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: GUARDIAN CONTROLS AND GAUGES */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* LARGE COCKPIT MONITORCARD */}
            <div className="notched-card p-6 md:p-8 bg-surface-container-low flex flex-col justify-between border-on-surface relative overflow-hidden h-[460px]">
              
              {/* Back ambient grid layout elements */}
              <div className="absolute inset-0 putty-overlay opacity-30 z-0"></div>

              {/* Cockpit Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
                    The Gilded Guardian
                  </h2>
                  <p className="font-mono text-[10px] text-on-surface/60 uppercase tracking-widest">
                    Model index: SECURE_AUTOMATON_X2
                  </p>
                </div>
                <div className="p-3 bg-surface border border-on-surface/10 notched-card">
                  <Settings className={`w-6 h-6 text-on-surface ${isPlaying ? "animate-spin" : ""}`} />
                </div>
              </div>

              {/* Centered Graphic Statue Illustration */}
              <div className="flex-grow flex items-center justify-center p-4 relative z-10">
                <motion.div
                  animate={{ 
                    y: isPlaying ? [0, -6, 0] : 0,
                    scale: overclockActive ? [1, 1.02, 1] : 1
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="max-h-[220px] aspect-square flex items-center justify-center overflow-hidden"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src={ARTIFACT_IMAGES.gildedGuardian} 
                    alt="The Gilded Guardian automaton mockup" 
                    className={`max-h-full max-w-full object-contain filter grayscale transition-all duration-500 hover:filter-none ${
                      overclockActive ? "brightness-110 drop-shadow-[0_0_15px_rgba(186,26,26,0.15)]" : ""
                    }`}
                  />
                </motion.div>
                
                {/* Calibration HUD Overlay indicators when calibrating */}
                <AnimatePresence>
                  {isCalibrating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-primary-container/10 border border-amber-600/30 flex items-center justify-center p-4 rounded z-20 backdrop-blur-[1px]"
                    >
                      <div className="text-center font-mono space-y-2">
                        <RefreshCw className="w-8 h-8 text-amber-900 mx-auto animate-spin" />
                        <span className="text-[10px] font-bold text-amber-950 uppercase tracking-widest block">
                          RECALIBRATING MATRIX CODES...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bot status bar graph */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between font-mono text-[9px] text-on-surface/60">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Core Synchronics</span>
                  <span>{isPlaying ? (overclockActive ? "Overloaded (95%)" : "Locked (84%)") : "Suspended (0%)"}</span>
                </div>
                <div className="h-2 bg-on-surface/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isPlaying ? (overclockActive ? "95%" : "84%") : "0%" }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-y-0 left-0 ${overclockActive ? "bg-rose-700" : "bg-on-surface"}`}
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC METRIC GAUGES PANEL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Gauge 1 */}
              <div className="notched-card p-4 bg-surface flex flex-col justify-between h-28 border-on-surface/10">
                <span className="font-mono text-[9px] text-on-surface/50 uppercase block">HYDRAULIC PRESS</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold block text-on-surface">
                    {hydraulicPressure} <span className="text-xs font-mono font-normal">MPa</span>
                  </span>
                  <div className="h-1 bg-on-surface/5 relative w-full">
                    <div 
                      className="absolute inset-y-0 left-0 bg-on-surface/60 transition-all"
                      style={{ width: `${(hydraulicPressure / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gauge 2 */}
              <div className="notched-card p-4 bg-surface flex flex-col justify-between h-28 border-on-surface/10">
                <span className="font-mono text-[9px] text-on-surface/50 uppercase block">OPTIC SYNC</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold block text-on-surface">
                    {opticArraySync}%
                  </span>
                  <div className="h-1 bg-on-surface/5 relative w-full">
                    <div 
                      className="absolute inset-y-0 left-0 bg-emerald-700/70 transition-all"
                      style={{ width: `${opticArraySync}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gauge 3 */}
              <div className="notched-card p-4 bg-surface flex flex-col justify-between h-28 border-on-surface/10">
                <span className="font-mono text-[9px] text-on-surface/50 uppercase block">COGNITIVE HEAT</span>
                <div className="space-y-1">
                  <span className={`font-serif text-2xl font-bold block ${coreTemperature > 85 ? "text-rose-700" : "text-on-surface"}`}>
                    {coreTemperature}°C
                  </span>
                  <div className="h-1 bg-on-surface/5 relative w-full">
                    <div 
                      className={`absolute inset-y-0 left-0 transition-all ${coreTemperature > 85 ? "bg-rose-700" : "bg-amber-600/70"}`}
                      style={{ width: `${Math.min(100, coreTemperature)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gauge 4 */}
              <div className="notched-card p-4 bg-surface flex flex-col justify-between h-28 border-on-surface/10">
                <span className="font-mono text-[9px] text-on-surface/50 uppercase block">OVERCLOCK SLOTS</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold block text-on-surface">
                    {overclockActive ? "ACTIVE" : "STANDBY"}
                  </span>
                  <span className="font-mono text-[8px] text-on-surface/40 block uppercase">
                    x1.8 speed factor
                  </span>
                </div>
              </div>

            </div>

            {/* MANUAL DIRECT CONTROL DIALS PANEL */}
            <div className="notched-card p-5 bg-surface border-on-surface/15 space-y-4">
              <h4 className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest border-b border-on-surface/10 pb-2">
                Auxiliary Cockpit Interceptors
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                {/* Dial Adjuster 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-on-surface/60 uppercase">LASER POWER MATRIX</span>
                    <span className="font-bold">{laserIntensity}%</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="100"
                    value={laserIntensity}
                    disabled={overclockActive}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setLaserIntensity(val);
                      if (val > 85 && Math.random() > 0.5) {
                        onAddLogMessage(`Increased laser power arrays to high ${val}% spectrum.`, "info");
                      }
                    }}
                    className="w-full h-1 bg-on-surface/10 rounded appearance-none cursor-pointer accent-on-surface"
                  />
                </div>

                {/* Dial Adjuster 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-on-surface/60 uppercase">HYDRAULIC BASELINE</span>
                    <span className="font-bold">{hydraulicPressure} MPa</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="30"
                    value={Math.round(hydraulicPressure * 10)}
                    disabled={overclockActive}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) / 10;
                      setHydraulicPressure(val);
                    }}
                    className="w-full h-1 bg-on-surface/10 rounded appearance-none cursor-pointer accent-on-surface"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: TELEMTRY CONSOLE LOG FEED */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* TERMINAL HEADER & BUTTON CONTROLS */}
            <div className="notched-card bg-inverse-surface border-on-surface p-6 flex flex-col justify-between h-[510px] text-surface-bright relative">
              
              {/* Cockpit interior border decor */}
              <div className="absolute top-2 left-2 right-2 h-4 border-t border-l border-r border-surface-bright/5 pointer-events-none"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-surface-bright/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary-fixed-dim" />
                    <span className="font-mono text-[10px] font-bold tracking-widest text-primary-fixed-dim uppercase">
                      Neural Telemetry Monitor
                    </span>
                  </div>
                  
                  <button 
                    onClick={onClearLogs}
                    className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-surface-bright/25 rounded hover:bg-surface-bright/5 text-surface-bright/60 hover:text-surface-bright"
                  >
                    Wipe Logs
                  </button>
                </div>

                {/* LOGS SCROLL WRAPPER */}
                <div className="h-[340px] overflow-y-auto no-scrollbar font-mono text-[11px] leading-relaxed space-y-3 pr-2 scroll-smooth">
                  {logs.map((log) => {
                    let typeColor = "text-primary-fixed-dim";
                    if (log.type === "success") typeColor = "text-emerald-400";
                    if (log.type === "warning") typeColor = "text-amber-350";
                    if (log.type === "critical") typeColor = "text-rose-400 font-bold";

                    return (
                      <div key={log.id} className="flex gap-2 items-start hover:bg-surface-bright/5 p-1 rounded transition-colors">
                        <span className="text-surface-bright/40 shrink-0">{log.timestamp}</span>
                        <div className={`break-words ${typeColor}`}>
                          <span className="text-surface-bright/50 mr-1">&gt;</span>
                          {log.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={logsEndRef} />
                </div>
              </div>

              {/* FOOTER BAR FOR COCKPIT SENSORS STATUS */}
              <div className="border-t border-surface-bright/10 pt-3 flex justify-between items-center text-surface-bright/55 font-mono text-[9px]">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-primary-fixed" /> Active Drivers: 4/4
                </span>
                <span>SECURE SHELL MODE</span>
              </div>
            </div>

            {/* ACTION TRIGGERS DRAWER */}
            <div className="notched-card p-5 bg-surface border-on-surface/15 space-y-4">
              <h4 className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest">
                Automation Driver Intercepts
              </h4>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px] font-bold">
                
                {/* Action Trigger 1 */}
                <button
                  onClick={handleTogglePlay}
                  className={`flex items-center justify-center gap-2 py-3 border border-on-surface cursor-pointer rounded transition-all ${
                    isPlaying 
                      ? "bg-amber-600/10 text-amber-900 border-amber-600/30 font-semibold" 
                      : "bg-surface text-on-surface hover:bg-on-surface/5"
                  }`}
                >
                  <Play className={`w-4 h-4 ${isPlaying ? "text-amber-800" : "text-on-surface"}`} />
                  {isPlaying ? "HALT TICKER" : "START TICKER"}
                </button>

                {/* Action Trigger 2 */}
                <button
                  onClick={handleCalibrateSensors}
                  className="flex items-center justify-center gap-2 py-3 bg-surface hover:bg-on-surface/5 cursor-pointer text-on-surface border border-on-surface/10 rounded transition-all"
                >
                  <Gauge className="w-4 h-4 text-on-surface" />
                  CALIBRATE SENSORS
                </button>

                {/* Action Trigger 3 */}
                <button
                  onClick={handleCoolingFlow}
                  className="flex items-center justify-center gap-2 py-3 bg-indigo-50/40 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer text-indigo-950 border border-indigo-900/15 rounded transition-all"
                >
                  <Thermometer className="w-4 h-4 text-indigo-800" />
                  DISCHARGE TEMPERATURE
                </button>

                {/* Action Trigger 4 */}
                <button
                  onClick={handleOverclockMode}
                  className={`flex items-center justify-center gap-2 py-3 rounded cursor-pointer transition-all border ${
                    overclockActive 
                      ? "bg-rose-700 text-surface border-rose-800 hover:bg-rose-800" 
                      : "bg-surface text-rose-850 hover:bg-rose-50 border-rose-800/20"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {overclockActive ? "OVERCLOCK ACTIVE" : "OVERCLOCK FORGE"}
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
