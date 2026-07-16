import { useState } from "react";
import { X } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { useUsers } from "../context/UsersContext";

const sources = ["Website", "Referral", "Cold Call", "Other"];

export default function AddLeadModal({ onClose }) {
  const { addLead } = useLeads();
  const { users } = useUsers();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", source: "Website", assignedToId: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    try {
      await addLead({
        ...form,
        company: form.company.trim() || null,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : undefined,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add lead");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-[#111827]">Add Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              placeholder="Lead's name" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Company</label>
            <input name="company" value={form.company} onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              placeholder="Company name (optional)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                placeholder="03XX-XXXXXXX" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Source</label>
              <select name="source" value={form.source} onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none">
                {sources.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Assign To</label>
              <select name="assignedToId" value={form.assignedToId} onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none">
                <option value="">Me (default)</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50">
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}