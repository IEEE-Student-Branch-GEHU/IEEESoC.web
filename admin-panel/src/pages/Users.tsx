import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

interface User {
  id: string; name: string; email: string; role: string;
  githubUsername?: string; avatarUrl?: string; createdAt?: string;
}

export default function Users() {
  const { token } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "contributor", githubUsername: "" });

  const load = async () => {
    if (!token) return;
    try {
      const data = await apiGet(`/api/admin/users?q=${search}`, token);
      setItems(data.users || []);
    } catch {}
  };

  useEffect(() => { load(); }, [token, search]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        const update: any = { name: form.name, role: form.role, githubUsername: form.githubUsername };
        if (form.password) update.password = form.password;
        await apiPut(`/api/admin/users/${editing.id}`, token, update);
      } else {
        await apiPost("/api/admin/users", token, form);
      }
      setShowForm(false); setEditing(null); setForm({ name: "", email: "", password: "", role: "contributor", githubUsername: "" }); load();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?") || !token) return;
    try { await apiDelete(`/api/admin/users/${id}`, token); load(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-on-surface">Users</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", email: "", password: "", role: "contributor", githubUsername: "" }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] font-bold uppercase rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add User
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface" />
      </div>

      <div className="bg-surface-container border border-on-surface/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-on-surface/10 font-mono text-[10px] uppercase text-on-surface/50">
            <th className="text-left p-4">Name</th><th className="text-left p-4">Email</th>
            <th className="text-left p-4">Role</th><th className="text-left p-4">GitHub</th>
            <th className="text-right p-4">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(user => (
              <tr key={user.id} className="border-b border-on-surface/5 hover:bg-surface-container-high/50 transition-colors">
                <td className="p-4 font-sans text-on-surface">{user.name}</td>
                <td className="p-4 font-mono text-xs text-on-surface/60">{user.email}</td>
                <td className="p-4"><span className={`px-2 py-0.5 font-mono text-[9px] uppercase rounded ${user.role === "admin" ? "bg-primary-container text-on-surface" : "bg-surface text-on-surface/60 border border-on-surface/10"}`}>{user.role}</span></td>
                <td className="p-4 font-mono text-xs text-on-surface/60">{user.githubUsername || "—"}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setEditing(user); setForm({ name: user.name, email: user.email, password: "", role: user.role, githubUsername: user.githubUsername || "" }); setShowForm(true); }} className="p-1.5 hover:bg-surface-container rounded cursor-pointer text-on-surface/50 hover:text-on-surface"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-rose-900/20 rounded cursor-pointer text-on-surface/50 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-on-surface/40 font-mono text-xs">No users found</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-on-surface/10 rounded w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-on-surface">{editing ? "Edit" : "New"} User</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface/50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <input placeholder="Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <input type="email" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!!editing} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface disabled:opacity-50" />
              <input type="password" placeholder={editing ? "New password (leave blank to keep)" : "Password *"} required={!editing} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <input placeholder="GitHub username" value={form.githubUsername} onChange={e => setForm({ ...form, githubUsername: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface">
                <option value="contributor">Contributor</option><option value="admin">Admin</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-on-surface/10 rounded font-mono text-[10px] uppercase cursor-pointer hover:bg-surface-container">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-on-surface text-surface font-mono text-[10px] font-bold uppercase rounded hover:bg-neutral-800 cursor-pointer">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
