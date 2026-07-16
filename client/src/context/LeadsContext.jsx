import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const LeadsContext = createContext(null);

function normalizeLead(l) {
  return { ...l, assignedToId: l.assignedToId, assignedTo: l.assignedTo?.name || "Unassigned" };
}

export function LeadsProvider({ children }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await client.get("/crm/leads");
      setLeads(res.data.leads.map(normalizeLead));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (data) => {
    const res = await client.post("/crm/leads", data);
    setLeads((prev) => [normalizeLead(res.data.lead), ...prev]);
  };

  const updateLead = async (id, updates) => {
    const res = await client.put(`/crm/leads/${id}`, updates);
    setLeads((prev) => prev.map((l) => (l.id === id ? normalizeLead(res.data.lead) : l)));
  };

  const updateLeadStage = async (id, stage) => {
    const res = await client.put(`/crm/leads/${id}/stage`, { stage });
    setLeads((prev) => prev.map((l) => (l.id === id ? normalizeLead(res.data.lead) : l)));
  };

  const deleteLead = async (id) => {
    await client.delete(`/crm/leads/${id}`);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <LeadsContext.Provider
      value={{ leads, loading, addLead, updateLead, updateLeadStage, deleteLead, fetchLeads }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) throw new Error("useLeads must be used inside LeadsProvider");
  return context;
}