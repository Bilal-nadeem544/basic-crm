import { useState, useRef } from "react";
import { LayoutGrid, ListChecks, BarChart3, Settings, UsersRound, CalendarDays, Bell, Users, Pencil, Check, X, Menu, ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import fallbackLogo from "../assets/ingenious-logo.png";

const navGroups = [
  { title: "Workspace", items: [
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/boards", label: "Boards", icon: LayoutGrid },
    { to: "/tasks", label: "My Tasks", icon: ListChecks },
  ]},
  { title: "Manage", items: [
    { to: "/team", label: "Team", icon: UsersRound },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/leads", label: "All Leads", icon: Users },
  ]},
  { title: "Account", items: [{ to: "/settings", label: "Settings", icon: Settings }] },
];

export default function Sidebar() {
  const { company, updateCompany } = useCompany();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState(company?.name || "");
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const displayLogo = logoPreview || company?.logo || fallbackLogo;

  const saveCompany = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      await updateCompany({ name: nameInput.trim(), ...(logoPreview ? { logo: logoPreview } : {}) });
      setEditing(false); setLogoPreview(null);
    } finally { setSaving(false); }
  };
  const startEdit = () => { setNameInput(company?.name || ""); setLogoPreview(null); setEditing(true); };
  const closeMobile = () => setMobileOpen(false);

  return <>
    <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
    {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-mark"><img src={displayLogo} alt="" /></div>
        {!collapsed && <div className="brand-copy"><span className="eyebrow">Workspace</span><strong>{company?.name || "Ingenious CRM"}</strong></div>}
        <button className="collapse-button" onClick={() => setCollapsed(v => !v)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronLeft size={16}/> : <ChevronLeft size={16}/>}</button>
      </div>

      {!collapsed && <div className="company-edit-row">
        {editing ? <>
          <input value={nameInput} onChange={e => setNameInput(e.target.value)} className="sidebar-name-input" />
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => { const f=e.target.files?.[0]; if(f){const r=new FileReader();r.onload=()=>setLogoPreview(r.result);r.readAsDataURL(f)}}}/>
          <button onClick={() => fileInputRef.current?.click()} className="mini-icon"><Pencil size={13}/></button>
          <button onClick={saveCompany} disabled={saving} className="mini-icon success"><Check size={13}/></button>
          <button onClick={() => setEditing(false)} className="mini-icon"><X size={13}/></button>
        </> : <button onClick={startEdit} className="edit-brand"><Pencil size={11}/> Edit workspace</button>}
      </div>}

      <nav className="sidebar-nav">
        {navGroups.map(group => <div className="nav-group" key={group.title}>
          {!collapsed && <div className="nav-group-title">{group.title}</div>}
          {group.items.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === "/boards"} onClick={closeMobile} title={collapsed ? label : undefined} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18}/>{!collapsed && <span>{label}</span>}
          </NavLink>)}
        </div>)}
      </nav>
      <div className="sidebar-footer">{!collapsed && <span>CRM → Project Workspace</span>}</div>
    </aside>
  </>;
}
