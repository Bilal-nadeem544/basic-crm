import { LayoutGrid, Users, ListChecks, BarChart3, Settings, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/ingenious-logo.png";

const navItems = [
  { to: "/", label: "Pipeline", icon: LayoutGrid },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/team", label: "My Team", icon: UsersRound },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-[#1F2937] flex flex-col p-4">
      <div className="mb-8 px-2 flex items-center gap-2">
        <img src={logo} alt="Ingenious Concepts" className="w-7 h-7 object-contain" />
        <h1 className="font-display text-lg font-bold text-white">Ingenious CRM</h1>
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