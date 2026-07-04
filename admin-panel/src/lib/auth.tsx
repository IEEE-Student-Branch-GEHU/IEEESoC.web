import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiLogin } from "./api";

interface AuthContextType {
  token: string | null;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_panel_token"));
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_panel_user");
    if (saved && token) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    setUser({ email: data.user.email, role: data.user.role });
    localStorage.setItem("admin_panel_token", data.token);
    localStorage.setItem("admin_panel_user", JSON.stringify({ email: data.user.email, role: data.user.role }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_panel_token");
    localStorage.removeItem("admin_panel_user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
