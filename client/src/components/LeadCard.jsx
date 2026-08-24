import { useNavigate } from "react-router-dom";
import { Building2, MessageSquare, Phone, Tag } from "lucide-react";
import { stageColors } from "../data/dummyLeads";

function initials(name="") { return name.split(" ").filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "?"; }

export default function LeadCard({ lead, onDragStart, isDragging }) {
  const navigate = useNavigate();
  const colors = stageColors[lead.stage] || stageColors.New;
  return <article draggable onDragStart={e=>onDragStart(e,lead.id)} onClick={()=>navigate(`/leads/${lead.id}`)} className={`kanban-card ${isDragging ? "dragging" : ""}`}>
    <div className="card-topline"><span className="priority-dot" style={{background: colors.border}}/><span className="card-source">{lead.source || "General"}</span></div>
    <h3>{lead.name}</h3>
    {lead.company && <div className="card-meta"><Building2 size={13}/><span>{lead.company}</span></div>}
    {lead.phone && <div className="card-meta"><Phone size={13}/><span>{lead.phone}</span></div>}
    <div className="card-footer">
      <div className="card-indicators">
        {lead.source && <span><Tag size={12}/>{lead.source}</span>}
        <span><MessageSquare size={12}/>Activity</span>
      </div>
      <div className="avatar" title={lead.assignedTo || "Unassigned"}>{initials(lead.assignedTo)}</div>
    </div>
  </article>;
}
