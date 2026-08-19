import { useNavigate } from "react-router-dom";
import { Check, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTasks } from "../context/TasksContext";
import { useLeads } from "../context/LeadsContext";

function getTaskGroup(dueDate, status) {
  if (status === "Completed") return "Completed";
  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (dueDay < today) return "Overdue";
  if (dueDay.getTime() === today.getTime()) return "Today";
  return "Upcoming";
}

const groupOrder = ["Overdue", "Today", "Upcoming", "Completed"];
const groupStyles = {
  Overdue: { icon: AlertCircle, color: "#DC2626", bg: "#FEE2E2" },
  Today: { icon: Clock, color: "#2563EB", bg: "#DBEAFE" },
  Upcoming: { icon: Clock, color: "#6B7280", bg: "#F3F4F6" },
  Completed: { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7" },
};

export default function MyTasks() {
  const { tasks, completeTask } = useTasks();
  const { leads } = useLeads();
  const navigate = useNavigate();

  const grouped = groupOrder.reduce((acc, g) => {
    acc[g] = tasks.filter((t) => getTaskGroup(t.dueDate, t.status) === g)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return acc;
  }, {});

  const pendingCount = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#111827]">My Tasks</h2>
        <p className="text-sm text-gray-500">{pendingCount} pending follow-ups</p>
      </div>

      {groupOrder.map((group) => {
        if (grouped[group].length === 0) return null;
        const { icon: Icon, color, bg } = groupStyles[group];

        return (
          <div key={group} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} color={color} />
              <h3 className="text-sm font-semibold text-[#111827]">{group}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: bg, color }}>
                {grouped[group].length}
              </span>
            </div>

            <div className="space-y-2">
              {grouped[group].map((task) => {
                const lead = leads.find((l) => l.id === task.leadId);
                return (
                  <div key={task.id} className="flex items-center justify-between bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
                    <div>
                      <p className={`text-sm font-medium ${task.status === "Completed" ? "line-through text-gray-400" : "text-[#111827]"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        {lead && (
                          <button onClick={() => navigate(`/leads/${lead.id}`)} className="text-[#2563EB] hover:underline">
                            {lead.name}
                          </button>
                        )}
                        <span>&middot;</span>
                        <span>
                          Due {new Date(task.dueDate).toLocaleDateString()}{" "}
                          {new Date(task.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span>&middot;</span>
                        <span>{task.assignedTo}</span>
                      </div>
                    </div>

                    {task.status !== "Completed" && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="w-7 h-7 rounded-full border border-[#2563EB] flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks yet.</p>}
    </div>
  );
}