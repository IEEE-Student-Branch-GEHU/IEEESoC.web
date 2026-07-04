import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

interface Artifact {
  _id: string; code: string; name: string; description: string;
  category: string; imageUrl: string; loadIndex: number;
  purityIndex: number; cyberMeshLevel: number; archivist: string;
  dateCreated: string;
}

const EMPTY: Omit<Artifact, "_id"> = {
  code: "", name: "", description: "", category: "Technical",
  imageUrl: "", loadIndex: 50, purityIndex: 80, cyberMeshLevel: 5,
  archivist: "", dateCreated: new Date().toISOString().split("T")[0],
};

export default function Artifacts() {
  const { token } = useAuth();
  const [items, setItems] = useState<Artifact[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Artifact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    if (!token) return;
    try {
      const data = await apiGet("/api/admin/artifacts", token);
      setItems(data.artifacts || []);
    } catch {}
  };

  useEffect(() => { load(); }, [token]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        await apiPut(`/api/admin/artifacts/${editing._id}`, token, form);
      } else {
        await apiPost("/api/admin/artifacts", token, form);
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artifact?") || !token) return;
    try {
      await apiDelete(`/api/admin/artifacts/${id}`, token);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEdit = (item: Artifact) => {
    setEditing(item);
    setForm({ ...item });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-on-surface">Project Crate</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] font-bold uppercase rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Artifact
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
        <input
          type="text" placeholder="Search artifacts..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-sm text-on-surface"
        />
      </div>

      <div className="bg-surface-container border border-on-surface/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-on-surface/10 font-mono text-[10px] uppercase text-on-surface/50">
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Archivist</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id} className="border-b border-on-surface/5 hover:bg-surface-container-high/50 transition-colors">
                <td className="p-4 font-mono text-xs text-on-surface/60">{item.code}</td>
                <td className="p-4 font-sans text-on-surface">{item.name}</td>
                <td className="p-4"><span className="px-2 py-0.5 bg-surface text-on-surface/60 border border-on-surface/10 font-mono text-[9px] uppercase">{item.category}</span></td>
                <td className="p-4 font-mono text-xs text-on-surface/60">{item.archivist}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-surface-container rounded transition-colors cursor-pointer text-on-surface/50 hover:text-on-surface"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-rose-900/20 rounded transition-colors cursor-pointer text-on-surface/50 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-on-surface/40 font-mono text-xs">No artifacts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-on-surface/10 rounded w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-on-surface">{editing ? "Edit" : "New"} Artifact</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface/50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Code *" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-mono text-xs text-on-surface" />
                <input placeholder="Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              </div>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface">
                <option>Technical</option><option>Architectural</option><option>Mythological</option><option>Relic</option>
              </select>
              <input placeholder="Archivist" value={form.archivist} onChange={e => setForm({ ...form, archivist: e.target.value })} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded focus:border-on-surface focus:outline-none font-sans text-xs text-on-surface" />
              <div className="grid grid-cols-3 gap-3">
                <div><label className="font-mono text-[9px] text-on-surface/50 uppercase">Load {form.loadIndex}%</label><input type="range" min="0" max="100" value={form.loadIndex} onChange={e => setForm({ ...form, loadIndex: +e.target.value })} className="w-full" /></div>
                <div><label className="font-mono text-[9px] text-on-surface/50 uppercase">Purity {form.purityIndex}%</label><input type="range" min="0" max="100" value={form.purityIndex} onChange={e => setForm({ ...form, purityIndex: +e.target.value })} className="w-full" /></div>
                <div><label className="font-mono text-[9px] text-on-surface/50 uppercase">Mesh {form.cyberMeshLevel}/10</label><input type="range" min="1" max="10" value={form.cyberMeshLevel} onChange={e => setForm({ ...form, cyberMeshLevel: +e.target.value })} className="w-full" /></div>
              </div>
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
