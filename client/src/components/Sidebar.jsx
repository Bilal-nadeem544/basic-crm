import { useState, useRef } from "react";
import { LayoutGrid, Users, ListChecks, BarChart3, Settings, UsersRound, Pencil, Check, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import fallbackLogo from "../assets/ingenious-logo.png";

const navItems = [
  { to: "/", label: "Pipeline", icon: LayoutGrid },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/team", label: "My Team", icon: UsersRound },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { company, updateCompany } = useCompany();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState(company?.name || "");
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const startEditing = () => {
    setNameInput(company?.name || "");
    setLogoPreview(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setLogoPreview(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      const payload = { name: nameInput.trim() };
      if (logoPreview) payload.logo = logoPreview;
      await updateCompany(payload);
      setEditing(false);
      setLogoPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const displayLogo = logoPreview || company?.logo || fallbackLogo;

  return (
    <aside className="w-56 h-screen bg-[#1F2937] flex flex-col p-4">
      <div className="mb-8 px-2 flex flex-col items-center gap-2 relative group">
        <div className="relative">
          <img src={displayLogo} alt={company?.name || "Company logo"} className="w-16 h-16 object-contain rounded" />
          {editing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-[#2563EB] rounded-full p-1 text-white hover:bg-blue-700"
              title="Logo change karo"
            >
              <Pencil size={10} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {editing ? (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full text-center text-sm font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            placeholder="Company name"
          />
        ) : (
          <h1 className="font-display text-base font-bold text-white text-center">{company?.name || "Ingenious CRM"}</h1>
        )}

        {editing ? (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 text-xs font-medium bg-[#2563EB] text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Check size={12} />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF] hover:text-white px-2 py-1 disabled:opacity-50"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={startEditing}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-white"
          >
            <Pencil size={10} />
            Edit
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2563EB] text-white"
                  : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}