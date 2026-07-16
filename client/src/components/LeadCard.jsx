import { useNavigate } from "react-router-dom";
import { Building2, Phone } from "lucide-react";
import { stageColors } from "../data/dummyLeads";

export default function LeadCard({ lead, onDragStart, isDragging }) {
  const colors = stageColors[lead.stage];
  const navigate = useNavigate();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => navigate(`/leads/${lead.id}`)}
      className={`bg-white rounded-xl p-3 mb-3 shadow-sm border-l-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      }`}
      style={{ borderLeftColor: colors.border }}
    >
      <h4 className="font-semibold text-sm text-[#111827]">{lead.name}</h4>

      {lead.company && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Building2 size={12} />
          <span>{lead.company}</span>
        </div>
      )}

      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <Phone size={12} />
        <span>{lead.phone}</span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#DBEAFE] text-[#1E40AF]">
          {lead.source}
        </span>
        <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-[10px] flex items-center justify-center font-semibold">
          {lead.assignedTo?.[0] || "?"}
        </div>
      </div>
    </div>
  );
}