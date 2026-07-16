import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { stages, stageColors } from "../data/dummyLeads";
import AddLeadModal from "../components/AddLeadModal";

export default function Leads() {
  const { leads } = useLeads();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const sources = ["All", "Website", "Referral", "Cold Call", "Other"];

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === "All" || lead.stage === stageFilter;
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-[#111827]">Leads</h2>
          <p className="text-sm text-gray-500">{filtered.length} of {leads.length} leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
        >
          + Add Lead
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
          />
        </div>

        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none cursor-pointer"
          >
            <option value="All">All Stages</option>
            {stages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none cursor-pointer"
          >
            {sources.map((s) => <option key={s} value={s}>{s === "All" ? "All Sources" : s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F3F4F6] text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const colors = stageColors[lead.stage];
              return (
                <tr
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="border-t border-[#F0F0F1] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[#111827]">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-500">{lead.company || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <div>{lead.email}</div>
                    <div className="text-xs text-gray-400">{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-[10px] flex items-center justify-center font-semibold">
                      {lead.assignedTo?.[0] || "?"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-400">No leads found.</div>
        )}
      </div>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}