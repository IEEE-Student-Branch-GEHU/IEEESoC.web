import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const API = "/api/admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  githubUsername?: string;
  avatarUrl?: string;
  createdAt?: string;
}

const emptyForm = { name: "", email: "", password: "", role: "contributor" as string, githubUsername: "" };

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminUsersPanel({ onAddLogMessage }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);

  const token = sessionStorage.getItem("ieeesoc_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchUsers = useCallback(async () => {
    try {
      const params = search.length >= 2 ? `?q=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API}/users${params}`, { headers });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch {
      onAddLogMessage("Failed to fetch users", "critical");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, githubUsername: u.githubUsername || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const body: any = { name: form.name, role: form.role, githubUsername: form.githubUsername };
        if (form.password) body.password = form.password;
        const res = await fetch(`${API}/users/${editing.id}`, { method: "PUT", headers, body: JSON.stringify(body) });
        const data = await res.json();
        if (!data.success) { onAddLogMessage(data.error || "Failed to update user", "critical"); return; }
        onAddLogMessage(`User updated: ${form.name}`, "success");
      } else {
        const res = await fetch(`${API}/users`, { method: "POST", headers, body: JSON.stringify(form) });
        const data = await res.json();
        if (!data.success) { onAddLogMessage(data.error || "Failed to create user", "critical"); return; }
        onAddLogMessage(`User created: ${form.name}`, "success");
      }
      setShowModal(false);
      fetchUsers();
    } catch {
      onAddLogMessage("Failed to save user", "critical");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!data.success) { onAddLogMessage("Failed to delete user", "critical"); return; }
      onAddLogMessage(`User deleted: ${name}`, "warning");
      fetchUsers();
    } catch {
      onAddLogMessage("Failed to delete user", "critical");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-on-surface">User Manager</h2>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all font-bold">
          <Plus className="w-3.5 h-3.5" /> Add User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, or GitHub..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all" />
      </div>

      {loading ? (
        <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="font-mono text-xs text-on-surface-variant/60">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-on-surface/10 text-on-surface-variant text-[10px] uppercase tracking-wider">
                <th className="text-left py-2 pr-2">Name</th>
                <th className="text-left py-2 pr-2 hidden sm:table-cell">Email</th>
                <th className="text-left py-2 pr-2">Role</th>
                <th className="text-left py-2 pr-2 hidden md:table-cell">GitHub</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-on-surface/5 hover:bg-surface-container-low/50 transition-all">
                  <td className="py-2.5 pr-2 font-semibold text-on-surface">{u.name}</td>
                  <td className="py-2.5 pr-2 hidden sm:table-cell text-on-surface-variant">{u.email}</td>
                  <td className="py-2.5 pr-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-surface-container-high text-on-surface-variant"
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-2.5 pr-2 hidden md:table-cell text-on-surface-variant">{u.githubUsername || "-"}</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-surface-container-high rounded cursor-pointer transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 hover:bg-rose-50 hover:text-rose-700 rounded cursor-pointer transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="notched-card bg-surface border border-on-surface max-w-md w-full p-6 relative space-y-4 shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-on-surface hover:opacity-75 cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="font-serif text-lg font-bold text-on-surface">{editing ? "Edit User" : "New User"}</h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editing}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 disabled:opacity-50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Password {editing && "(leave blank to keep current)"}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password"
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 cursor-pointer">
                    <option value="contributor">Contributor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">GitHub Username</label>
                  <input type="text" value={form.githubUsername} onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface cursor-pointer">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase font-bold cursor-pointer rounded-lg hover:opacity-90 transition-all">
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
