import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { PortalUser, UserStats } from "../types";

interface AuthContextType {
  user: PortalUser | null;
  stats: UserStats | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Token invalid");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setStats(data.stats || null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("ieeesoc_token");
    if (token) {
      fetchProfile(token).then((ok) => {
        if (!ok) sessionStorage.removeItem("ieeesoc_token");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Login failed");
    sessionStorage.setItem("ieeesoc_token", data.token);
    setUser(data.user);
    setStats(null);
    await fetchProfile(data.token);
  }, [fetchProfile]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("ieeesoc_token");
    setUser(null);
    setStats(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = sessionStorage.getItem("ieeesoc_token");
    if (token) await fetchProfile(token);
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
