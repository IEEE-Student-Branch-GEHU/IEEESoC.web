import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { apiGet, apiPut } from "../lib/api";
import { Save, RefreshCw } from "lucide-react";

interface BotConfig {
  hydraulicPressure: number;
  laserIntensity: number;
  opticArraySync: number;
  coreTemperature: number;
  overclockActive: boolean;
}

const DEFAULT: BotConfig = {
  hydraulicPressure: 70, laserIntensity: 72,
  opticArraySync: 84, coreTemperature: 42, overclockActive: false,
};

export default function BotConfig() {
  const { token } = useAuth();
  const [config, setConfig] = useState<BotConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiGet("/api/admin/bot-config", token);
      if (data.config) setConfig(data.config);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true); setMsg("");
    try {
      await apiPut("/api/admin/bot-config", token, config);
      setMsg("Configuration saved successfully.");
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const Slider = ({ label, unit, value, min, max, onChange }: {
    label: string; unit: string; value: number; min: number; max: number; onChange: (v: number) => void;
  }) => (
    <div className="p-4 bg-surface-container border border-on-surface/10 rounded space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] text-on-surface/50 uppercase">{label}</span>
        <span className="font-serif text-xl font-bold text-on-surface">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} className="w-full h-1 bg-on-surface/10 rounded appearance-none cursor-pointer accent-on-surface" />
      <div className="flex justify-between font-mono text-[9px] text-on-surface/30">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-on-surface">Bot Configuration</h1>
          <p className="font-mono text-[10px] text-on-surface/50 uppercase tracking-widest mt-1">Gilded Guardian Parameters</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-on-surface/10 rounded font-mono text-[10px] uppercase text-on-surface/60 hover:text-on-surface cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Reload
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] font-bold uppercase rounded hover:bg-neutral-800 cursor-pointer disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-3 rounded font-mono text-xs ${msg.startsWith("Error") ? "bg-rose-900/20 border border-rose-800/30 text-rose-300" : "bg-emerald-900/20 border border-emerald-800/30 text-emerald-300"}`}>
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Slider label="Hydraulic Pressure" unit=" MPa" value={config.hydraulicPressure} min={0} max={100} onChange={v => setConfig({ ...config, hydraulicPressure: v })} />
        <Slider label="Laser Intensity" unit="%" value={config.laserIntensity} min={0} max={100} onChange={v => setConfig({ ...config, laserIntensity: v })} />
        <Slider label="Optic Array Sync" unit="%" value={config.opticArraySync} min={0} max={100} onChange={v => setConfig({ ...config, opticArraySync: v })} />
        <Slider label="Core Temperature" unit="°C" value={config.coreTemperature} min={20} max={120} onChange={v => setConfig({ ...config, coreTemperature: v })} />
      </div>

      <div className="p-4 bg-surface-container border border-on-surface/10 rounded">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-on-surface/50 uppercase">Overclock Mode</span>
          <button
            onClick={() => setConfig({ ...config, overclockActive: !config.overclockActive })}
            className={`px-4 py-2 font-mono text-[10px] uppercase rounded transition-colors cursor-pointer ${
              config.overclockActive
                ? "bg-rose-700 text-white"
                : "bg-surface border border-on-surface/10 text-on-surface/60 hover:text-on-surface"
            }`}
          >
            {config.overclockActive ? "ACTIVE" : "STANDBY"}
          </button>
        </div>
      </div>
    </div>
  );
}
