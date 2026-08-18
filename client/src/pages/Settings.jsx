import { useState } from "react";
import { User, Mail, Shield, LogOut, Pencil, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const startEditing = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name aur email khali nahi ho sakte");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update fail ho gaya");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#111827]">Settings</h2>
        <p className="text-sm text-gray-500">Your account details</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-semibold">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-[#111827]">{user?.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role || "staff"}</p>
            </div>
          </div>

          {!editing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:text-blue-700"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="space-y-4 border-t border-[#E5E7EB] pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
              <User size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Full Name</p>
              {editing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full text-sm text-[#111827] font-medium border border-[#E5E7EB] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              ) : (
                <p className="text-sm text-[#111827] font-medium">{user?.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
              <Mail size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Email</p>
              {editing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full text-sm text-[#111827] font-medium border border-[#E5E7EB] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              ) : (
                <p className="text-sm text-[#111827] font-medium">{user?.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
              <Shield size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm text-[#111827] font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium bg-[#2563EB] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Check size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        )}

        <div className="border-t border-[#E5E7EB] mt-6 pt-6">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}