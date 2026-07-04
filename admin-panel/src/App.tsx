import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Artifacts from "./pages/Artifacts";
import Keepers from "./pages/Keepers";
import Users from "./pages/Users";
import BotConfig from "./pages/BotConfig";

function ProtectedLayout() {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><div className="font-mono text-sm text-on-surface/40 animate-pulse">Loading...</div></div>;
  if (!token) return <Navigate to="/login" replace />;
  return <Layout><Outlet /></Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/artifacts" element={<Artifacts />} />
            <Route path="/keepers" element={<Keepers />} />
            <Route path="/users" element={<Users />} />
            <Route path="/bot-config" element={<BotConfig />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
