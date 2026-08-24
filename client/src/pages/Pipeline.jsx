import { useMemo, useState } from "react";
import { Filter, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import AddLeadModal from "../components/AddLeadModal";
import { useLeads } from "../context/LeadsContext";
import { useUsers } from "../context/UsersContext";
import { useAuth } from "../context/AuthContext";
import { stages } from "../data/dummyLeads";

export default function Pipeline(){
 const {leads,loading}=useLeads(); const {users}=useUsers(); const {user}=useAuth(); const isAdmin=user?.role==="admin"; const [showModal,setShowModal]=useState(false); const [search,setSearch]=useState(""); const [member,setMember]=useState("All"); const [stage,setStage]=useState("All");
 const filtered=useMemo(()=>leads.filter(l=>{const q=search.toLowerCase();const text=`${l.name} ${l.company||""} ${l.source||""}`.toLowerCase();return (!q||text.includes(q))&&(member==="All"||String(l.assignedToId)===member)&&(stage==="All"||l.stage===stage)}),[leads,search,member,stage]);
 const total=leads.length; const active=leads.filter(l=>!['Won','Lost'].includes(l.stage)).length;
 return <div className="workspace-page board-page">
   <header className="page-header board-header"><div><div className="breadcrumb">Workspace / Boards</div><div className="title-row"><h1>Project Workspace</h1><span className="live-pill"><span/> Live data</span></div><p>Turn your CRM pipeline into a focused, visual workflow.</p></div>{isAdmin && <button className="primary-button" onClick={()=>setShowModal(true)}><Plus size={17}/> Add card</button>}</header>
   <div className="board-toolbar"><div className="board-stats"><span><strong>{total}</strong> cards</span><span><strong>{active}</strong> active</span></div><div className="toolbar-controls"><label className="search-box"><Search size={16}/><input placeholder="Search cards…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch("")}><X size={13}/></button>}</label><select value={stage} onChange={e=>setStage(e.target.value)}><option value="All">All lists</option>{stages.map(s=><option key={s}>{s}</option>)}</select><select value={member} onChange={e=>setMember(e.target.value)}><option value="All">All members</option>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select><button className="secondary-button"><SlidersHorizontal size={15}/> Filters</button></div></div>
   {loading?<div className="skeleton-board">{[1,2,3,4,5].map(x=><div className="skeleton-list" key={x}><div/><div/><div/></div>)}</div>:<KanbanBoard leads={filtered} onAddCard={()=>setShowModal(true)}/>} 
   <div className="board-note"><Filter size={14}/> Lists map directly to the existing CRM pipeline stages. No backend data model was changed.</div>
   {showModal&&isAdmin&&<AddLeadModal onClose={()=>setShowModal(false)}/>} 
 </div>
}