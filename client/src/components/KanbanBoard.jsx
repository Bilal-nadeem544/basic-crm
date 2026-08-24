import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import LeadCard from "./LeadCard";
import { stages, stageColors } from "../data/dummyLeads";
import { useLeads } from "../context/LeadsContext";

export default function KanbanBoard({ leads, onAddCard }) {
  const { updateLeadStage } = useLeads();
  const [draggedId,setDraggedId]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [saving,setSaving]=useState(false);
  const drop = async (e,stage)=>{e.preventDefault();if(!draggedId)return;setSaving(true);try{await updateLeadStage(draggedId,stage)}finally{setSaving(false);setDraggedId(null);setDragOver(null)}};
  return <div className="board-scroll"><div className="kanban-board">
    {stages.map(stage=>{const cards=leads.filter(l=>l.stage===stage);const c=stageColors[stage];return <section key={stage} className={`kanban-list ${dragOver===stage?"drop-active":""}`} onDragOver={e=>{e.preventDefault();setDragOver(stage)}} onDragLeave={()=>setDragOver(null)} onDrop={e=>drop(e,stage)}>
      <header className="list-header"><div><span className="list-dot" style={{background:c.border}}/><h2>{stage}</h2><span className="count">{cards.length}</span></div><button className="ghost-icon"><MoreHorizontal size={17}/></button></header>
      <div className="list-cards">{cards.map(card=><LeadCard key={card.id} lead={card} onDragStart={(e,id)=>{e.stopPropagation();setDraggedId(id)}} isDragging={draggedId===card.id}/>)}
      {cards.length===0 && <div className="empty-list">Drop a card here</div>}</div>
      <button className="add-card-button" onClick={onAddCard}><Plus size={16}/> Add card</button>
    </section>})}
    {saving && <div className="board-saving">Saving position…</div>}
  </div></div>;
}
