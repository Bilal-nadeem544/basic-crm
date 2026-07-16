import { createContext, useContext, useState } from "react";
import client from "../api/client";

const ActivitiesContext = createContext(null);

export function ActivitiesProvider({ children }) {
  const [activitiesByLead, setActivitiesByLead] = useState({});

  const fetchActivities = async (leadId) => {
    const res = await client.get(`/crm/leads/${leadId}/activities`);
    setActivitiesByLead((prev) => ({ ...prev, [leadId]: res.data.activities }));
  };

  const addActivity = async (leadId, data) => {
    const res = await client.post(`/crm/leads/${leadId}/activities`, data);
    setActivitiesByLead((prev) => ({
      ...prev,
      [leadId]: [res.data.activity, ...(prev[leadId] || [])],
    }));
  };

  const updateActivity = async (leadId, id, updates) => {
    const res = await client.put(`/crm/leads/${leadId}/activities/${id}`, updates);
    setActivitiesByLead((prev) => ({
      ...prev,
      [leadId]: (prev[leadId] || []).map((a) => (a.id === id ? res.data.activity : a)),
    }));
  };

  const deleteActivity = async (leadId, id) => {
    await client.delete(`/crm/leads/${leadId}/activities/${id}`);
    setActivitiesByLead((prev) => ({
      ...prev,
      [leadId]: (prev[leadId] || []).filter((a) => a.id !== id),
    }));
  };

  return (
    <ActivitiesContext.Provider
      value={{ activitiesByLead, fetchActivities, addActivity, updateActivity, deleteActivity }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (!context) throw new Error("useActivities must be used inside ActivitiesProvider");
  return context;
}