import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import AddLeadModal from "../components/AddLeadModal";
import { useLeads } from "../context/LeadsContext";

export default function Pipeline() {
  const { leads, loading } = useLeads();
  const [showModal, setShowModal] = useState(false);

  const total = leads.length;
  const won = leads.filter((l) => l.stage === "Won").length;
  const conversionRate = total ? ((won / total) * 100).toFixed(1) : 0;

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-[#111827]">Pipeline</h2>
          <p className="text-sm text-gray-500">{total} leads &middot; {conversionRate}% conversion rate</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
        >
          + Add Lead
        </button>
      </div>

      <KanbanBoard leads={leads} />

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}