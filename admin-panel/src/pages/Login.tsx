import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Shield } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-sm p-8 bg-surface-container border border-on-surface/10 rounded">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-serif text-2xl font-bold text-on-surface">Admin Monitor</h1>
          <p className="font-mono text-[10px] text-on-surface/50 uppercase tracking-widest mt-1">IEEESoC Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-900/20 border border-rose-800/30 text-rose-300 text-xs font-mono rounded">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface"
              placeholder="admin@ieeesoc.com"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-on-surface text-surface font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
