import { useState, useEffect } from "react";
import { Save, RotateCw } from "lucide-react";

const API = "/api/admin";

interface BotConfig {
  _id?: string;
  hydraulicPressure: number;
  laserIntensity: number;
  opticArraySync: number;
  coreTemperature: number;
  overclockActive: boolean;
}

const DEFAULTS: BotConfig = {
  hydraulicPressure: 75,
  laserIntensity: 60,
  opticArraySync: 85,
  coreTemperature: 42,
  overclockActive: false,
};

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminBotPanel({ onAddLogMessage }: Props) {
  const [config, setConfig] = useState<BotConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = sessionStorage.getItem("ieeesoc_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API}/bot-config`, { headers });
      const data = await res.json();
      if (data.success && data.config) {
        const { _id, createdAt, updatedAt, ...rest } = data.config;
        setConfig(rest);
      }
    } catch {
      onAddLogMessage("Failed to fetch bot config", "critical");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/bot-config`, { method: "PUT", headers, body: JSON.stringify(config) });
      const data = await res.json();
      if (!data.success) { onAddLogMessage("Failed to save bot config", "critical"); return; }
      onAddLogMessage("Bot configuration updated", "success");
    } catch {
      onAddLogMessage("Failed to save bot config", "critical");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading bot config...</p>;
  }

  const sliders = [
    { key: "hydraulicPressure", label: "Hydraulic Pressure", min: 0, max: 150, unit: "MPa" },
    { key: "laserIntensity", label: "Laser Intensity", min: 0, max: 100, unit: "%" },
    { key: "opticArraySync", label: "Optic Array Sync", min: 0, max: 100, unit: "%" },
    { key: "coreTemperature", label: "Core Temperature", min: 20, max: 100, unit: "°C" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-on-surface">Bot Configuration</h2>
        <div className="flex gap-2">
          <button onClick={fetchConfig} className="flex items-center gap-1.5 px-3 py-2 border border-on-surface/10 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest cursor-pointer rounded-lg hover:text-on-surface transition-all">
            <RotateCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all font-bold disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="notched-card bg-surface border border-on-surface/10 p-6 space-y-5">
        {sliders.map(({ key, label, min, max, unit }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</label>
              <span className="font-mono text-sm font-bold text-on-surface">{config[key as keyof BotConfig]} <span className="text-[10px] text-on-surface-variant font-normal">{unit}</span></span>
            </div>
            <input
              type="range" min={min} max={max}
              value={config[key as keyof BotConfig] as number}
              onChange={(e) => setConfig({ ...config, [key]: Number(e.target.value) })}
              className="w-full accent-on-surface cursor-pointer"
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-on-surface/5">
          <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Overclock Active</label>
          <button
            onClick={() => setConfig({ ...config, overclockActive: !config.overclockActive })}
            className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
              config.overclockActive ? "bg-rose-500" : "bg-surface-container-high"
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
              config.overclockActive ? "left-6" : "left-0.5"
            }`} />
          </button>
        </div>
      </div>

      <p className="font-mono text-[10px] text-on-surface-variant/60">
        Changes take effect immediately after saving. The bot simulator will use these values on next tick.
      </p>
    </div>
  );
}
