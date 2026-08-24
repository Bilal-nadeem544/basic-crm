import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Mail, Building2, Check, CheckCircle2, Pencil, Trash2, RotateCcw } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { useTasks } from "../context/TasksContext";
import { useActivities } from "../context/ActivitiesContext";
import { useAuth } from "../context/AuthContext";
import EditLeadModal from "../components/EditLeadModal";
import { stageColors } from "../data/dummyLeads";

const activityIcons = { Call: "📞", Email: "✉️", Meeting: "🤝", Note: "📝" };
const activityTypes = ["Call", "Email", "Meeting", "Note"];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads } = useLeads();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { tasks, completeTask, reopenTask, addTask, updateTask, deleteTask } = useTasks();
  const { activitiesByLead, fetchActivities, addActivity, updateActivity, deleteActivity } = useActivities();

  const leadId = Number(id);
  const lead = leads.find((l) => l.id === leadId);

  useEffect(() => {
    if (lead) fetchActivities(leadId);
  }, [leadId, lead]);

  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] = useState("Note");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivityText, setEditActivityText] = useState("");

  const [showEditLead, setShowEditLead] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", dueDate: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskForm, setEditTaskForm] = useState({ title: "", dueDate: "" });

  const leadTasks = tasks.filter((t) => t.leadId === leadId);
  const leadActivities = activitiesByLead[leadId] || [];

  if (!lead) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Lead not found.{" "}
        <button onClick={() => navigate("/leads")} className="text-[#2563EB] underline">
          Back to Leads
        </button>
      </div>
    );
  }

  const colors = stageColors[lead.stage];

  const submitNewActivity = async () => {
    if (!newNote.trim()) return;
    await addActivity(leadId, { type: newNoteType, summary: newNote });
    setNewNote("");
  };

  const startEditActivity = (a) => {
    setEditingActivityId(a.id);
    setEditActivityText(a.summary);
  };

  const saveEditActivity = async (aid) => {
    await updateActivity(leadId, aid, { summary: editActivityText });
    setEditingActivityId(null);
  };

  const submitNewTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.dueDate) return;
    await addTask({ leadId, title: taskForm.title.trim(), dueDate: taskForm.dueDate });
    setTaskForm({ title: "", dueDate: "" });
    setShowTaskForm(false);
  };

  const startEditTask = (t) => {
    setEditingTaskId(t.id);
    setEditTaskForm({ title: t.title, dueDate: t.dueDate.slice(0, 16) });
  };

  const saveEditTask = async (tid) => {
    await updateTask(tid, editTaskForm);
    setEditingTaskId(null);
  };

  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#111827] mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#111827]">{lead.name}</h2>
            {lead.company && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Building2 size={14} /> {lead.company}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: colors.bg, color: colors.text }}>
              {lead.stage}
            </span>
            {isAdmin && (
              <button
                onClick={() => setShowEditLead(true)}
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-[#F3F4F6] hover:text-[#2563EB]"
                title="Edit lead"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><Mail size={14} /> {lead.email || "—"}</div>
          <div className="flex items-center gap-1"><Phone size={14} /> {lead.phone || "—"}</div>
          <div className="text-xs text-gray-400">Assigned: {lead.assignedTo}</div>
        </div>

        {lead.stage === "Won" && (
          <button className="mt-4 flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle2 size={16} /> Convert to Customer
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="font-semibold text-sm text-[#111827] mb-4">Activity Timeline</h3>

          <div className="flex gap-2 mb-4">
            <select value={newNoteType} onChange={(e) => setNewNoteType(e.target.value)}
              className="px-2 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none">
              {activityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="text"
              placeholder="Add an entry..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNewActivity()}
              className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
            />
            <button onClick={submitNewActivity} className="bg-[#2563EB] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#1D4ED8]">
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leadActivities.length === 0 && <p className="text-xs text-gray-400">No activity yet.</p>}
            {leadActivities.map((a) => (
              <div key={a.id} className="flex gap-3 text-sm group">
                <span>{activityIcons[a.type]}</span>
                <div className="flex-1">
                  {editingActivityId === a.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editActivityText}
                        onChange={(e) => setEditActivityText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEditActivity(a.id)}
                        className="flex-1 px-2 py-1 rounded border border-[#E5E7EB] text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEditActivity(a.id)} className="text-xs text-[#2563EB] font-medium">Save</button>
                      <button onClick={() => setEditingActivityId(null)} className="text-xs text-gray-400">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#111827]">{a.summary}</p>
                      <p className="text-xs text-gray-400">{a.loggedBy?.name || "You"} &middot; {new Date(a.date).toLocaleString()}</p>
                    </>
                  )}
                </div>
                {editingActivityId !== a.id && (
                  <div className="hidden group-hover:flex items-start gap-1">
                    <button onClick={() => startEditActivity(a)} className="text-gray-400 hover:text-[#2563EB]">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteActivity(leadId, a.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#111827]">Follow-up Tasks</h3>
            <button onClick={() => setShowTaskForm((v) => !v)} className="text-xs font-medium text-[#2563EB] hover:underline">
              {showTaskForm ? "Cancel" : "+ Add Task"}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={submitNewTask} className="mb-4 p-3 rounded-lg bg-[#F3F4F6] space-y-2">
              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full px-2 py-1.5 rounded border border-[#E5E7EB] text-sm focus:outline-none"
                required
              />
              <input
                type="datetime-local"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-2 py-1.5 rounded border border-[#E5E7EB] text-sm focus:outline-none"
                required
              />
              <button type="submit" className="w-full bg-[#2563EB] text-white text-sm py-1.5 rounded-lg hover:bg-[#1D4ED8]">
                Save Task
              </button>
            </form>
          )}

          <div className="space-y-2">
            {leadTasks.length === 0 && !showTaskForm && <p className="text-xs text-gray-400">No tasks yet.</p>}
            {leadTasks.map((t) => (
              <div key={t.id} className={`px-3 py-2 rounded-lg border group ${t.status === "Completed" ? "bg-gray-50 border-gray-100" : "border-[#E5E7EB]"}`}>
                {editingTaskId === t.id ? (
                  <div className="space-y-2">
                    <input
                      value={editTaskForm.title}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-[#E5E7EB] text-sm focus:outline-none"
                    />
                    <input
                      type="datetime-local"
                      value={editTaskForm.dueDate}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, dueDate: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-[#E5E7EB] text-xs focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEditTask(t.id)} className="text-xs text-[#2563EB] font-medium">Save</button>
                      <button onClick={() => setEditingTaskId(null)} className="text-xs text-gray-400">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${t.status === "Completed" ? "line-through text-gray-400" : "text-[#111827]"}`}>{t.title}</p>
                      <p className="text-xs text-gray-400">Due {new Date(t.dueDate).toLocaleDateString()} &middot; {t.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button onClick={() => startEditTask(t)} className="text-gray-400 hover:text-[#2563EB]">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {t.status === "Completed" ? (
                        <button onClick={() => reopenTask(t.id)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-100" title="Reopen">
                          <RotateCcw size={12} />
                        </button>
                      ) : (
                        <button onClick={() => completeTask(t.id)} className="w-6 h-6 rounded-full border border-[#2563EB] flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors">
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditLead && isAdmin && <EditLeadModal lead={lead} onClose={() => setShowEditLead(false)} onDeleted={() => navigate("/leads")} />}
    </div>
  );
}