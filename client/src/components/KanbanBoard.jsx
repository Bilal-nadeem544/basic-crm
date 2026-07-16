import { useState } from "react";
import LeadCard from "./LeadCard";
import { stages, stageColors } from "../data/dummyLeads";
import { useLeads } from "../context/LeadsContext";

export default function KanbanBoard({ leads }) {
  const { updateLeadStage } = useLeads();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const handleDragStart = (e, id) => setDraggedId(id);

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDrop = async (e, stage) => {
    e.preventDefault();
    if (draggedId) {
      await updateLeadStage(draggedId, stage);
    }
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        const colors = stageColors[stage];
        const isOver = dragOverStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            className={`min-w-[260px] w-[260px] rounded-xl p-3 transition-colors ${
              isOver ? "bg-[#E5E7EB]" : "bg-[#EDEEF1]"
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.border }} />
                <h3 className="font-semibold text-sm text-[#111827]">{stage}</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">{stageLeads.length}</span>
            </div>

            <div className="min-h-[100px]">
              {stageLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} isDragging={draggedId === lead.id} />
              ))}
              {stageLeads.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  No leads
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}