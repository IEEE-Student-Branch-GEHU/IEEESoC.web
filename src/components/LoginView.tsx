import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { LogIn, X, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface LoginViewProps {
  onClose?: () => void;
  onSuccess?: () => void;
  returnTo?: string;
}

export default function LoginView({ onClose, onSuccess, returnTo }: LoginViewProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="notched-card bg-surface w-full max-w-md p-8 border border-on-surface relative shadow-2xl"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-on-surface/5 transition-colors cursor-pointer text-on-surface"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-on-surface" />
          <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-on-surface/50">
            Vault Authentication Gateway
          </span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-on-surface mb-6">
          Sign into the Lyceum
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="archivist@lyceum.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] font-bold text-on-surface/60 uppercase block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-on-surface cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-on-surface hover:bg-neutral-800 transition-colors text-surface font-mono text-xs font-bold uppercase tracking-wide cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? "Authenticating..." : "Enter the Sanctum"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
