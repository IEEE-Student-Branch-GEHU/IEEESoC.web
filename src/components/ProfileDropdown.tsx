import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import {
  User, LogOut, Search, Award, GitPullRequest, 
  Sparkles, ShieldCheck, ExternalLink
} from "lucide-react";
import type { PortalUser } from "../types";
import { ARTIFACT_IMAGES } from "../data";

interface ProfileDropdownProps {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function ProfileDropdown({ onAddLogMessage }: ProfileDropdownProps) {
  const { user, stats, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PortalUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = sessionStorage.getItem("ieeesoc_token");
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setSearchResults(data.users);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    onAddLogMessage("Session terminated. Access credentials cleared.", "info");
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-on-surface/10 hover:border-on-surface/30 transition-all cursor-pointer bg-surface/50"
      >
        <div className="w-7 h-7 rounded-full bg-surface-container-high border border-on-surface/20 flex items-center justify-center overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-3.5 h-3.5 text-on-surface/60" />
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface hidden sm:block">
          {user.name.split(" ")[0]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-surface border border-on-surface/10 notched-card shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface-container-high border border-on-surface/20 flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-on-surface/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-on-surface truncate">{user.name}</h3>
                  <p className="font-mono text-[10px] text-on-surface/50 truncate">{user.email}</p>
                  <span className={`inline-block mt-0.5 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 ${
                    isAdmin ? "bg-amber-100 text-amber-800" : "bg-primary-container text-on-surface"
                  }`}>
                    {isAdmin ? "Admin" : "Contributor"}
                  </span>
                </div>
              </div>

              {stats && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low border border-on-surface/5 rounded">
                  <div className="text-center">
                    <div className="font-serif text-lg font-bold text-on-surface">{stats.score}</div>
                    <span className="font-mono text-[8px] uppercase text-on-surface/40 tracking-wider">Points</span>
                  </div>
                  <div className="text-center">
                    <div className="font-serif text-lg font-bold text-emerald-700">{stats.mergedPRs}</div>
                    <span className="font-mono text-[8px] uppercase text-on-surface/40 tracking-wider">Merged PRs</span>
                  </div>
                  <div className="text-center">
                    <div className="font-serif text-lg font-bold text-on-surface">{stats.openPRs}</div>
                    <span className="font-mono text-[8px] uppercase text-on-surface/40 tracking-wider">Open PRs</span>
                  </div>
                </div>
              )}

              {user.githubUsername && (
                <div className="font-mono text-[10px] text-on-surface/50 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  GitHub: @{user.githubUsername}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface/40" />
                <input
                  type="text"
                  placeholder="Search contributors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-[11px] text-on-surface"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 border border-on-surface/5 rounded p-1">
                  {searchResults.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-container-high rounded cursor-pointer transition-colors text-[11px]"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                        u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-surface-container-high text-on-surface"
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-on-surface truncate">{u.name}</div>
                        <div className="font-mono text-[9px] text-on-surface/40 truncate">{u.role} {u.githubUsername && `· @${u.githubUsername}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-on-surface/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-rose-50 rounded transition-colors text-rose-800 font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect & Clear Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
