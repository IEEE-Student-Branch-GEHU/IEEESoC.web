import { useState, useEffect } from "react";
import { BotSimulatorState } from "../types";
import {
  RotateCcw, Cpu, Gauge, Zap, Activity, Thermometer, ShieldCheck
} from "lucide-react";

interface AdminAutomatonPanelProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

interface BotConfig {
  hydraulicPressure: number;
  laserIntensity: number;
  opticArraySync: number;
  coreTemperature: number;
  overclockActive: boolean;
}

const DEFAULT_CONFIG: BotConfig = {
  hydraulicPressure: 1.4,
  laserIntensity: 72,
  opticArraySync: 84,
  coreTemperature: 42,
  overclockActive: false,
};

export default function AdminAutomatonPanel({ onAddLogMessage }: AdminAutomatonPanelProps) {
  const [config, setConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem("hall_chronicles_bot_config");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem("hall_chronicles_bot_config", JSON.stringify(config));
  }, [config]);

  const update = <K extends keyof BotConfig>(key: K, val: BotConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
    onAddLogMessage(`Admin updated Gilded Guardian baseline: ${String(key)} set to ${val}.`, "info");
  };

  const handleReset = () => {
    if (confirm("Reset Gilded Guardian automaton baselines to system defaults?")) {
      setConfig(DEFAULT_CONFIG);
      onAddLogMessage("Automaton baseline variables reset to defaults.", "warning");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="max-w-xl space-y-2">
          <h3 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-800 animate-pulse" /> Automaton Overlord Interceptor
          </h3>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Calibrate active telemetries and baseline constraints for the Gilded Guardian model automaton.
          </p>
        </div>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-on-surface/30 bg-surface hover:bg-on-surface/5 transition-all font-mono text-xs uppercase tracking-wider cursor-pointer font-bold">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Baselines
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 notched-card p-5 bg-surface border border-on-surface/10">
          <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest border-b border-on-surface/10 pb-2 block">
            Telemetry Baseline Settings
          </span>

          {[
            { label: "Hydraulic Pressure Baseline", icon: Gauge, val: config.hydraulicPressure, unit: " MPa", key: "hydraulicPressure" as const, min: 5, max: 30, fmt: (v: number) => (v / 10).toFixed(2), displayMin: "0.5 MPa (MIN)", displayMax: "3.0 MPa (MAX)" },
            { label: "Optic Laser Power Baseline", icon: Zap, val: config.laserIntensity, unit: "%", key: "laserIntensity" as const, min: 10, max: 100, fmt: (v: number) => v.toString(), displayMin: "10% (LOW)", displayMax: "100% (CRITICAL)" },
            { label: "Optic Focal Array Target Sync", icon: Activity, val: config.opticArraySync, unit: "%", key: "opticArraySync" as const, min: 50, max: 100, fmt: (v: number) => v.toString(), displayMin: "50% (DIVERGED)", displayMax: "100% (ALIGNED)" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="flex items-center gap-1"><Icon className="w-3.5 h-3.5" /> {s.label}</span>
                  <span className="font-bold">{s.fmt(s.val)}{s.unit}</span>
                </div>
                <input type="range" min={s.min} max={s.max}
                  value={typeof s.val === "number" ? s.val : parseInt(s.val as string)}
                  onChange={(e) => {
                    const raw = parseInt(e.target.value);
                    const val = s.key === "hydraulicPressure" ? parseFloat((raw / 10).toFixed(2)) : raw;
                    update(s.key, val as any);
                  }}
                  className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface" />
                <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
                  <span>{s.displayMin}</span><span>{s.displayMax}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6 notched-card p-5 bg-surface border border-on-surface/10">
          <span className="font-mono text-[10px] font-bold text-on-surface/60 uppercase tracking-widest border-b border-on-surface/10 pb-2 block">
            Safety & Thermal Constraints
          </span>

          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> Core Target Temperature</span>
              <span className="font-bold">{config.coreTemperature}°C</span>
            </div>
            <input type="range" min="20" max="80" value={config.coreTemperature}
              onChange={(e) => update("coreTemperature", parseInt(e.target.value))}
              className="w-full h-1 bg-on-surface/10 rounded-lg appearance-none cursor-pointer accent-on-surface" />
            <div className="flex justify-between font-mono text-[8px] text-on-surface/40">
              <span>20°C (COOL)</span><span>80°C (WARM)</span>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-800/10 rounded notched-card border-none">
              <div className="space-y-1 flex-grow pr-4">
                <span className="font-mono text-[10px] font-bold text-rose-900 uppercase tracking-wider block">Automated Overclock Lockout</span>
                <p className="font-sans text-[10px] text-on-surface-variant leading-tight">
                  Forcibly lock the Gilded Guardian into hyper-velocity clock speeds.
                </p>
              </div>
              <button type="button" onClick={() => update("overclockActive", !config.overclockActive)}
                className={`px-4 py-2 border rounded font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer ${
                  config.overclockActive ? "bg-rose-700 text-surface" : "bg-surface text-on-surface border-on-surface/20"
                }`}>
                {config.overclockActive ? "LOCKED ACTIVE" : "STANDBY"}
              </button>
            </div>

            <div className="p-3.5 bg-primary-container/10 border border-on-surface/5 text-[10px] font-mono leading-relaxed space-y-1 rounded text-on-surface-variant">
              <div className="font-bold uppercase text-on-surface flex items-center gap-1 text-[9px]">
                <ShieldCheck className="w-3 h-3 text-emerald-800" /> Synchronization Loop Active
              </div>
              <span>Changes made here will instantly re-calibrate the Gilded Guardian state variables.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
