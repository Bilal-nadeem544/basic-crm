import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { useLeads } from "../context/LeadsContext";
import { stageColors } from "../data/dummyLeads";

export default function Team() {
  const { users } = useUsers();
  const { leads } = useLeads();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#111827]">My Team</h2>
        <p className="text-sm text-gray-500">{users.length} team members</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {users.map((member) => {
          const memberLeads = leads.filter((l) => l.assignedToId === member.id);
          return (
            <div key={member.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold">
                  {member.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#111827]">{member.name}</h3>
                    {member.role === "admin" && (
                      <span className="text-[10px] uppercase tracking-wide bg-[#2563EB]/10 text-[#2563EB] px-1.5 py-0.5 rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <span className="ml-auto text-xs bg-[#F3F4F6] text-gray-500 px-2 py-1 rounded-full font-medium">
                  {memberLeads.length} leads
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {memberLeads.length === 0 && (
                  <p className="text-xs text-gray-400">No leads assigned.</p>
                )}
                {memberLeads.map((lead) => {
                  const colors = stageColors[lead.stage];
                  return (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                    >
                      <span className="text-sm text-[#111827]">{lead.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {lead.stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}