import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const API = "/api/admin";

interface Keeper {
  _id: string;
  name: string;
  role: string;
  chroniclesCount: number;
  reputationPoints: number;
  imageUrl: string;
  status: string;
}

const emptyForm = {
  name: "", role: "", chroniclesCount: 0, reputationPoints: 0, imageUrl: "", status: "active",
};

const STATUSES = ["active", "dormant", "synchronizing"];

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminBoardPanel({ onAddLogMessage }: Props) {
  const [keepers, setKeepers] = useState<Keeper[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Keeper | null>(null);
  const [form, setForm] = useState(emptyForm);

  const token = sessionStorage.getItem("ieeesoc_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchKeepers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/keepers`, { headers });
      const data = await res.json();
      if (data.success) setKeepers(data.keepers);
    } catch {
      onAddLogMessage("Failed to fetch keepers", "critical");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeepers(); }, [fetchKeepers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (k: Keeper) => {
    setEditing(k);
    setForm({ name: k.name, role: k.role, chroniclesCount: k.chroniclesCount, reputationPoints: k.reputationPoints, imageUrl: k.imageUrl, status: k.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editing ? `${API}/keepers/${editing._id}` : `${API}/keepers`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) { onAddLogMessage(data.error || "Failed to save keeper", "critical"); return; }
      onAddLogMessage(`Keeper ${editing ? "updated" : "created"}: ${form.name}`, "success");
      setShowModal(false);
      fetchKeepers();
    } catch {
      onAddLogMessage("Failed to save keeper", "critical");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete keeper "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/keepers/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!data.success) { onAddLogMessage("Failed to delete keeper", "critical"); return; }
      onAddLogMessage(`Keeper deleted: ${name}`, "warning");
      fetchKeepers();
    } catch {
      onAddLogMessage("Failed to delete keeper", "critical");
    }
  };

  const filtered = keepers.filter((k) =>
    [k.name, k.role, k.status].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-on-surface">Honor Board</h2>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Keeper
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search keepers..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all" />
      </div>

      {loading ? (
        <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading keepers...</p>
      ) : filtered.length === 0 ? (
        <p className="font-mono text-xs text-on-surface-variant/60">No keepers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-on-surface/10 text-on-surface-variant text-[10px] uppercase tracking-wider">
                <th className="text-left py-2 pr-2">Name</th>
                <th className="text-left py-2 pr-2 hidden md:table-cell">Role</th>
                <th className="text-right py-2 pr-2 hidden sm:table-cell">Chronicles</th>
                <th className="text-right py-2 pr-2 hidden sm:table-cell">Reputation</th>
                <th className="text-left py-2 pr-2">Status</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr key={k._id} className="border-b border-on-surface/5 hover:bg-surface-container-low/50 transition-all">
                  <td className="py-2.5 pr-2 font-semibold text-on-surface">{k.name}</td>
                  <td className="py-2.5 pr-2 hidden md:table-cell text-on-surface-variant">{k.role}</td>
                  <td className="py-2.5 pr-2 hidden sm:table-cell text-right">{k.chroniclesCount.toLocaleString()}</td>
                  <td className="py-2.5 pr-2 hidden sm:table-cell text-right">{k.reputationPoints.toLocaleString()}</td>
                  <td className="py-2.5 pr-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      k.status === "active" ? "bg-emerald-100 text-emerald-800" :
                      k.status === "dormant" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}>{k.status}</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(k)} className="p-1.5 hover:bg-surface-container-high rounded cursor-pointer transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(k._id, k.name)} className="p-1.5 hover:bg-rose-50 hover:text-rose-700 rounded cursor-pointer transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <h3 className="font-serif text-lg font-bold text-on-surface">{editing ? "Edit Keeper" : "New Keeper"}</h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Role</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Chronicles</label>
                    <input type="number" value={form.chroniclesCount} onChange={(e) => setForm({ ...form, chroniclesCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Reputation</label>
                    <input type="number" value={form.reputationPoints} onChange={(e) => setForm({ ...form, reputationPoints: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Image URL</label>
                  <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 cursor-pointer">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
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
