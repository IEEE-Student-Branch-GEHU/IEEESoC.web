import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  User, ShieldCheck, Mail, Github, Award, GitPullRequest, GitMerge,
  Edit2, Lock, LogOut, Loader2, Save, X, Search, Linkedin
} from "lucide-react";
import type { PortalUser } from "../types";
import LanyardCard from "./LanyardCard";

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function ProfileView({ onAddLogMessage }: Props) {
  const { user, stats, logout, refreshProfile } = useAuth();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Edit Info Form state
  const [name, setName] = useState(user?.name || "");
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || "");
  const [linkedinUsername, setLinkedinUsername] = useState(user?.linkedinUsername || "");
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setGithubUsername(user.githubUsername || "");
      setLinkedinUsername(user.linkedinUsername || "");
    }
  }, [user?.name, user?.githubUsername, user?.linkedinUsername]);

  // Password Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Contributor Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PortalUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-container pt-28 pb-20 px-4 md:px-margin-desktop flex items-center justify-center">
        <div className="notched-card bg-surface border border-on-surface/10 p-8 max-w-md w-full text-center">
          <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading archivist vault profiles...</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onAddLogMessage("Name cannot be empty", "warning");
      return;
    }
    setIsSavingInfo(true);
    try {
      const token = sessionStorage.getItem("ieeesoc_token");
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, githubUsername, linkedinUsername }),
      });
      const data = await res.json();
      if (data.success) {
        onAddLogMessage("Archivist profile updated successfully", "success");
        await refreshProfile();
        setIsEditingInfo(false);
      } else {
        onAddLogMessage(data.error || "Profile update failed", "critical");
      }
    } catch {
      onAddLogMessage("Network error during profile update", "critical");
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      onAddLogMessage("Password cannot be empty", "warning");
      return;
    }
    if (password !== confirmPassword) {
      onAddLogMessage("Passwords do not match", "warning");
      return;
    }
    setIsSavingPass(true);
    try {
      const token = sessionStorage.getItem("ieeesoc_token");
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onAddLogMessage("Password modified successfully. Secure gateway updated.", "success");
        setIsChangingPass(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        onAddLogMessage(data.error || "Password update failed", "critical");
      }
    } catch {
      onAddLogMessage("Network error during security update", "critical");
    } finally {
      setIsSavingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    onAddLogMessage("Session terminated. Access credentials cleared.", "info");
  };

  return (
    <div className="min-h-screen bg-primary-container pt-28 pb-20 px-4 md:px-margin-desktop">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* PROFILE HEADER CARD */}
            <div className="notched-card bg-surface border border-on-surface/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-container-high border border-on-surface/20 flex items-center justify-center overflow-hidden shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-on-surface/60" />
            )}
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
              <h2 className="font-serif text-3xl font-bold text-on-surface truncate">{user.name}</h2>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                user.role === "admin" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-primary-container text-on-surface border border-on-surface/10"
              }`}>
                {user.role}
              </span>
            </div>
            <p className="font-mono text-xs text-on-surface-variant/80 flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
              {user.githubUsername && (
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Github className="w-3.5 h-3.5" /> @{user.githubUsername}
                </a>
              )}
              {user.linkedinUsername && (
                <a
                  href={user.linkedinUsername.startsWith("http") ? user.linkedinUsername : `https://linkedin.com/in/${user.linkedinUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" /> @{user.linkedinUsername}
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-on-surface/15 hover:border-on-surface/30 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPass(!isChangingPass)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-on-surface/15 hover:border-on-surface/30 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Security
            </button>
          </div>
        </div>

        {/* FORMS COLLAPSIBLE SECTION */}
        {isEditingInfo && (
          <div className="notched-card bg-surface border border-on-surface/20 p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-on-surface/5">
              <h3 className="font-serif text-lg font-bold text-on-surface">Edit Profile Details</h3>
              <button onClick={() => setIsEditingInfo(false)} className="text-on-surface/50 hover:text-on-surface"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">LinkedIn Username / URL</label>
                <input
                  type="text"
                  value={linkedinUsername}
                  onChange={(e) => setLinkedinUsername(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingInfo}
                className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSavingInfo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Details
              </button>
            </form>
          </div>
        )}

        {isChangingPass && (
          <div className="notched-card bg-surface border border-on-surface/20 p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-on-surface/5">
              <h3 className="font-serif text-lg font-bold text-on-surface">Update Security Credentials</h3>
              <button onClick={() => setIsChangingPass(false)} className="text-on-surface/50 hover:text-on-surface"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingPass}
                className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSavingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Change Password
              </button>
            </form>
          </div>
        )}

        {/* STATISTICS GRID */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
            <Award className="w-5 h-5 text-on-surface-variant" /> Telemetry & Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="notched-card bg-surface border border-on-surface/10 p-5 shadow-xs flex flex-col justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/80">Archivist Score</span>
              <span className="font-serif text-3xl font-bold text-on-surface mt-2">{stats?.score || 0}</span>
            </div>
            <div className="notched-card bg-surface border border-on-surface/10 p-5 shadow-xs flex flex-col justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/80">Merged Chronicles</span>
              <span className="font-serif text-3xl font-bold text-emerald-700 mt-2">{stats?.mergedPRs || 0}</span>
            </div>
            <div className="notched-card bg-surface border border-on-surface/10 p-5 shadow-xs flex flex-col justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/80">Open Chronicles</span>
              <span className="font-serif text-3xl font-bold text-amber-700 mt-2">{stats?.openPRs || 0}</span>
            </div>
            <div className="notched-card bg-surface border border-on-surface/10 p-5 shadow-xs flex flex-col justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/80">Total Activity</span>
              <span className="font-serif text-3xl font-bold text-on-surface mt-2">
                {(stats?.mergedPRs || 0) + (stats?.openPRs || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* CONTRIBUTOR DIRECTORY SEARCH */}
        <div className="notched-card bg-surface border border-on-surface/10 p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-on-surface/5">
            <Search className="w-5 h-5 text-on-surface-variant" />
            <h3 className="font-serif text-xl font-bold text-on-surface">Contributor Directory</h3>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/55" />
            <input
              type="text"
              placeholder="Search archivist registry by name, email, or GitHub username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
            />
          </div>

          {isSearching && (
            <p className="font-mono text-xs text-on-surface-variant animate-pulse py-2">Searching archivist logs...</p>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 bg-surface-container-low/60 border border-on-surface/5 rounded-lg hover:border-on-surface/15 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-on-surface/10 flex items-center justify-center overflow-hidden shrink-0">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold uppercase text-on-surface-variant">
                        {u.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif font-bold text-on-surface text-sm truncate">{u.name}</div>
                    <div className="font-mono text-[9px] text-on-surface-variant/70 truncate">{u.email}</div>
                    <div className="font-mono text-[8px] uppercase tracking-wider text-on-surface-variant/50 truncate">
                      {u.role} {u.githubUsername && `· @${u.githubUsername}`} {u.linkedinUsername && `· in/${u.linkedinUsername}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
            <p className="font-mono text-xs text-on-surface-variant/60 py-2">No matching archivists found in the registry.</p>
          )}
        </div>

        {/* SECURITY & LOGOUT ZONE */}
        <div className="pt-6 border-t border-on-surface/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-on-surface-variant/60 font-mono text-[10px] uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Vault Compartment Secure
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 rounded-lg text-rose-800 font-mono text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Disconnect & Clear Session
          </button>
        </div>

      </div>

      {/* LANYARD CARD SHOWCASE (Right, 1/3 width on desktop) */}
      <div className="space-y-3">
        <LanyardCard
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          githubUsername={user.githubUsername}
          score={stats?.score}
        />
      </div>
    </div>
  </div>
</div>
);
}
