import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { apiGet, apiHealthCheck } from "../lib/api";
import {
  Activity, Users, Archive, CheckCircle, XCircle, Clock, RefreshCw
} from "lucide-react";

interface Status {
  website: { ok: boolean; status: number; latency: number } | null;
  bot: { ok: boolean; status: number; latency: number } | null;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [status, setStatus] = useState<Status>({ website: null, bot: null });
  const [stats, setStats] = useState({ artifacts: 0, keepers: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const [web, bot] = await Promise.allSettled([
        apiHealthCheck(),
        fetch("https://purvansh01-ieee-soc-bot.hf.space/api/leaderboard?limit=1")
          .then(async (r) => {
            const start = performance.now();
            await r.json();
            return { ok: r.ok, status: r.status, latency: Math.round(performance.now() - start) };
          }),
      ]);
      setStatus({
        website: web.status === "fulfilled" ? web.value : { ok: false, status: 0, latency: 0 },
        bot: bot.status === "fulfilled" ? bot.value : { ok: false, status: 0, latency: 0 },
      });
    } catch {
      setStatus({ website: { ok: false, status: 0, latency: 0 }, bot: { ok: false, status: 0, latency: 0 } });
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const [artRes, keepRes, userRes] = await Promise.allSettled([
        apiGet("/api/admin/artifacts", token),
        apiGet("/api/admin/keepers", token),
        apiGet("/api/admin/users", token),
      ]);
      setStats({
        artifacts: artRes.status === "fulfilled" ? (artRes.value.artifacts?.length || 0) : 0,
        keepers: keepRes.status === "fulfilled" ? (keepRes.value.keepers?.length || 0) : 0,
        users: userRes.status === "fulfilled" ? (userRes.value.users?.length || 0) : 0,
      });
    } catch {}
  };

  useEffect(() => {
    checkHealth();
    fetchStats();
  }, [token]);

  const StatusCard = ({ label, data }: { label: string; data: Status["website"] }) => (
    <div className="p-5 bg-surface-container border border-on-surface/10 rounded">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-on-surface/50 uppercase tracking-widest">{label}</span>
        {data ? (
          data.ok ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />
        ) : (
          <Clock className="w-4 h-4 text-on-surface/30 animate-pulse" />
        )}
      </div>
      <div className="font-serif text-2xl font-bold text-on-surface">
        {data ? (data.ok ? "Online" : "Offline") : "Checking..."}
      </div>
      <div className="font-mono text-[10px] text-on-surface/40 mt-1">
        {data ? `HTTP ${data.status} • ${data.latency}ms` : "—"}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-on-surface">Dashboard</h1>
          <p className="font-mono text-[10px] text-on-surface/50 uppercase tracking-widest mt-1">System Overview</p>
        </div>
        <button
          onClick={() => { checkHealth(); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-on-surface/10 rounded font-mono text-[10px] uppercase text-on-surface/60 hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusCard label="Website (Render)" data={status.website} />
        <StatusCard label="Bot (HuggingFace)" data={status.bot} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-surface-container border border-on-surface/10 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Archive className="w-4 h-4 text-on-surface/40" />
            <span className="font-mono text-[10px] text-on-surface/50 uppercase">Artifacts</span>
          </div>
          <div className="font-serif text-3xl font-bold text-on-surface">{stats.artifacts}</div>
        </div>
        <div className="p-5 bg-surface-container border border-on-surface/10 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-on-surface/40" />
            <span className="font-mono text-[10px] text-on-surface/50 uppercase">Keepers</span>
          </div>
          <div className="font-serif text-3xl font-bold text-on-surface">{stats.keepers}</div>
        </div>
        <div className="p-5 bg-surface-container border border-on-surface/10 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-on-surface/40" />
            <span className="font-mono text-[10px] text-on-surface/50 uppercase">Users</span>
          </div>
          <div className="font-serif text-3xl font-bold text-on-surface">{stats.users}</div>
        </div>
      </div>
    </div>
  );
}
