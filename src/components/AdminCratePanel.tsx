import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const API = "/api/admin";
const CATEGORIES = ["Architectural", "Mythological", "Technical", "Relic"] as const;

interface Artifact {
  _id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  loadIndex: number;
  purityIndex: number;
  cyberMeshLevel: number;
  archivist: string;
  dateCreated: string;
}

const emptyForm = {
  code: "", name: "", description: "", category: "Technical" as string,
  imageUrl: "", loadIndex: 50, purityIndex: 75, cyberMeshLevel: 5,
  archivist: "", dateCreated: new Date().toISOString().split("T")[0],
};

interface Props {
  onAddLogMessage: (msg: string, type: "info" | "warning" | "success" | "critical") => void;
}

export default function AdminCratePanel({ onAddLogMessage }: Props) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Artifact | null>(null);
  const [form, setForm] = useState(emptyForm);

  const getHeaders = () => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    const token = sessionStorage.getItem("ieeesoc_token");
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  const fetchArtifacts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/artifacts`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setArtifacts(data.artifacts);
    } catch {
      onAddLogMessage("Failed to fetch artifacts", "critical");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArtifacts(); }, [fetchArtifacts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (a: Artifact) => {
    setEditing(a);
    setForm({
      code: a.code, name: a.name, description: a.description, category: a.category,
      imageUrl: a.imageUrl, loadIndex: a.loadIndex, purityIndex: a.purityIndex,
      cyberMeshLevel: a.cyberMeshLevel, archivist: a.archivist, dateCreated: a.dateCreated,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editing ? `${API}/artifacts/${editing._id}` : `${API}/artifacts`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) {
        onAddLogMessage(data.error || "Failed to save artifact", "critical");
        return;
      }
      onAddLogMessage(`Artifact ${editing ? "updated" : "created"}: ${form.name}`, "success");
      setShowModal(false);
      fetchArtifacts();
    } catch {
      onAddLogMessage("Failed to save artifact", "critical");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete artifact "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/artifacts/${id}`, { method: "DELETE", headers: getHeaders() });
      const data = await res.json();
      if (!data.success) {
        onAddLogMessage("Failed to delete artifact", "critical");
        return;
      }
      onAddLogMessage(`Artifact deleted: ${name}`, "warning");
      fetchArtifacts();
    } catch {
      onAddLogMessage("Failed to delete artifact", "critical");
    }
  };

  const filtered = artifacts.filter((a) =>
    [a.name, a.code, a.category, a.archivist].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-on-surface">Crate Manager</h2>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-on-surface text-surface font-mono text-[10px] uppercase tracking-widest cursor-pointer rounded-lg hover:opacity-90 transition-all font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Artifact
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artifacts..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all"
        />
      </div>

      {loading ? (
        <p className="font-mono text-xs text-on-surface-variant animate-pulse">Loading artifacts...</p>
      ) : filtered.length === 0 ? (
        <p className="font-mono text-xs text-on-surface-variant/60">No artifacts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-on-surface/10 text-on-surface-variant text-[10px] uppercase tracking-wider">
                <th className="text-left py-2 pr-2">Code</th>
                <th className="text-left py-2 pr-2">Name</th>
                <th className="text-left py-2 pr-2 hidden md:table-cell">Category</th>
                <th className="text-left py-2 pr-2 hidden lg:table-cell">Archivist</th>
                <th className="text-right py-2 pr-2 hidden sm:table-cell">Load</th>
                <th className="text-right py-2 pr-2 hidden sm:table-cell">Purity</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-b border-on-surface/5 hover:bg-surface-container-low/50 transition-all">
                  <td className="py-2.5 pr-2 text-on-surface-variant">{a.code}</td>
                  <td className="py-2.5 pr-2 font-semibold text-on-surface">{a.name}</td>
                  <td className="py-2.5 pr-2 hidden md:table-cell text-on-surface-variant">{a.category}</td>
                  <td className="py-2.5 pr-2 hidden lg:table-cell text-on-surface-variant">{a.archivist}</td>
                  <td className="py-2.5 pr-2 hidden sm:table-cell text-right">{a.loadIndex}%</td>
                  <td className="py-2.5 pr-2 hidden sm:table-cell text-right">{a.purityIndex}%</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-surface-container-high rounded cursor-pointer transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(a._id, a.name)} className="p-1.5 hover:bg-rose-50 hover:text-rose-700 rounded cursor-pointer transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
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
              className="notched-card bg-surface border border-on-surface max-w-xl w-full p-6 relative space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-on-surface hover:opacity-75 cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="font-serif text-lg font-bold text-on-surface">{editing ? "Edit Artifact" : "New Artifact"}</h3>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <div className="col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all resize-none h-20" />
                </div>
                <Select label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[...CATEGORIES]} />
                <Field label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
                <Field label="Archivist" value={form.archivist} onChange={(v) => setForm({ ...form, archivist: v })} />
                <Field label="Date Created" value={form.dateCreated} onChange={(v) => setForm({ ...form, dateCreated: v })} />
                <SliderField label="Load Index" value={form.loadIndex} min={10} max={100} onChange={(v) => setForm({ ...form, loadIndex: v })} />
                <SliderField label="Purity Index" value={form.purityIndex} min={50} max={100} onChange={(v) => setForm({ ...form, purityIndex: v })} />
                <SliderField label="Cyber Mesh Level" value={form.cyberMeshLevel} min={1} max={10} onChange={(v) => setForm({ ...form, cyberMeshLevel: v })} />
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-surface-container border border-on-surface/10 rounded-lg font-mono text-xs text-on-surface outline-none focus:border-on-surface/30 transition-all cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{label}: {value}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-on-surface cursor-pointer" />
    </div>
  );
}
