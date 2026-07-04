import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

interface Keeper {
  _id: string; name: string; role: string; chroniclesCount: number;
  reputationPoints: number; imageUrl: string; status: string;
}

const EMPTY: Omit<Keeper, "_id"> = {
  name: "", role: "", chroniclesCount: 0, reputationPoints: 0,
  imageUrl: "", status: "active",
};

export default function Keepers() {
  const { token } = useAuth();
  const [items, setItems] = useState<Keeper[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Keeper | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    if (!token) return;
    try {
      const data = await apiGet("/api/admin/keepers", token);
      setItems(data.keepers || []);
    } catch {}
  };

  useEffect(() => { load(); }, [token]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        await apiPut(`/api/admin/keepers/${editing._id}`, token, form);
      } else {
        await apiPost("/api/admin/keepers", token, form);
      }
      setShowForm(false); setEditing(null); setForm(EMPTY); load();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this keeper?") || !token) return;
    try { await apiDelete(`/api/admin/keepers/${id}`, token); load(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-on-surface">Leaderboard Keepers</h1>
        <button onClick={() => { setEditing(null); setForm(EMPTY); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] font-bold uppercase rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Keeper
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
        <input type="text" placeholder="Search keepers..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface" />
      </div>

      <div className="bg-surface-container border border-on-surface/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-on-surface/10 font-mono text-[10px] uppercase text-on-surface/50">
            <th className="text-left p-4">Rank</th><th className="text-left p-4">Name</th>
            <th className="text-left p-4">Role</th><th className="text-right p-4">Chronicles</th>
            <th className="text-right p-4">Reputation</th><th className="text-right p-4">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item._id} className="border-b border-on-surface/5 hover:bg-surface-container-high/50 transition-colors">
                <td className="p-4 font-serif font-bold text-on-surface">{i + 1}</td>
                <td className="p-4 font-sans text-on-surface">{item.name}</td>
                <td className="p-4 font-mono text-xs text-on-surface/60">{item.role}</td>
                <td className="p-4 text-right font-mono text-xs text-on-surface">{item.chroniclesCount.toLocaleString()}</td>
                <td className="p-4 text-right font-mono text-xs text-on-surface">{item.reputationPoints.toLocaleString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setEditing(item); setForm({ ...item }); setShowForm(true); }} className="p-1.5 hover:bg-surface-container rounded cursor-pointer text-on-surface/50 hover:text-on-surface"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-rose-900/20 rounded cursor-pointer text-on-surface/50 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-on-surface/40 font-mono text-xs">No keepers found</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-on-surface/10 rounded w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-on-surface">{editing ? "Edit" : "New"} Keeper</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface/50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <input placeholder="Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <input placeholder="Role *" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Chronicles" value={form.chroniclesCount} onChange={e => setForm({ ...form, chroniclesCount: +e.target.value })} className="px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                <input type="number" placeholder="Reputation" value={form.reputationPoints} onChange={e => setForm({ ...form, reputationPoints: +e.target.value })} className="px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
              </div>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface">
                <option value="active">Active</option><option value="dormant">Dormant</option><option value="synchronizing">Synchronizing</option>
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
