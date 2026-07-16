import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { AlertCircle, Clock, TrendingUp, Users, Target } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { useTasks } from "../context/TasksContext";
import { stages, stageColors } from "../data/dummyLeads";

const sourceColors = ["#2563EB", "#6B7280", "#16A34A", "#D97706"];

export default function Dashboard() {
  const { leads } = useLeads();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const total = leads.length;
  const won = leads.filter((l) => l.stage === "Won").length;
  const conversionRate = total ? ((won / total) * 100).toFixed(1) : 0;
  const openLeads = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length;

  const stageData = stages.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.stage === s).length,
    fill: stageColors[s].border,
  }));

  const sourceMap = {};
  leads.forEach((l) => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1; });
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  const now = new Date();
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const overdueTasks = pendingTasks.filter((t) => new Date(t.dueDate) < now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const upcomingTasks = pendingTasks.filter((t) => new Date(t.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#111827]">Dashboard</h2>
        <p className="text-sm text-gray-500">CRM overview and pipeline performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Leads" value={total} color="#2563EB" />
        <StatCard icon={Target} label="Open Leads" value={openLeads} color="#6B7280" />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${conversionRate}%`} color="#16A34A" />
        <StatCard icon={Clock} label="Pending Tasks" value={pendingTasks.length} color="#D97706" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="font-semibold text-sm text-[#111827] mb-4">Leads by Stage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stageData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="font-semibold text-sm text-[#111827] mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={sourceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {sourceData.map((_, i) => <Cell key={i} fill={sourceColors[i % sourceColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-red-500" />
            <h3 className="font-semibold text-sm text-[#111827]">Overdue Follow-ups</h3>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{overdueTasks.length}</span>
          </div>
          <TaskList tasks={overdueTasks} leads={leads} navigate={navigate} empty="No overdue tasks." />
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[#2563EB]" />
            <h3 className="font-semibold text-sm text-[#111827]">Upcoming Follow-ups</h3>
          </div>
          <TaskList tasks={upcomingTasks} leads={leads} navigate={navigate} empty="No upcoming tasks." />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A` }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

function TaskList({ tasks, leads, navigate, empty }) {
  if (tasks.length === 0) return <p className="text-xs text-gray-400">{empty}</p>;
  return (
    <div className="space-y-2">
      {tasks.map((t) => {
        const lead = leads.find((l) => l.id === t.leadId);
        return (
          <div
            key={t.id}
            onClick={() => lead && navigate(`/leads/${lead.id}`)}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
          >
            <div>
              <p className="text-sm text-[#111827]">{t.title}</p>
              <p className="text-xs text-gray-400">{lead?.name || "Unknown lead"}</p>
            </div>
            <span className="text-xs text-gray-400">{new Date(t.dueDate).toLocaleDateString()}</span>
          </div>
        );
      })}
    </div>
  );
}