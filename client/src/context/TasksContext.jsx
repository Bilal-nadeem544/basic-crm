import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const TasksContext = createContext(null);

function normalizeTask(t) {
  return { ...t, assignedTo: t.assignedTo?.name || "Unassigned" };
}

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await client.get("/crm/tasks");
      setTasks(res.data.tasks.map(normalizeTask));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    const res = await client.put(`/crm/tasks/${taskId}`, { status: "Completed" });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? normalizeTask(res.data.task) : t)));
  };

  const reopenTask = async (taskId) => {
    const res = await client.put(`/crm/tasks/${taskId}`, { status: "Pending" });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? normalizeTask(res.data.task) : t)));
  };

  const addTask = async (task) => {
    const res = await client.post("/crm/tasks", task);
    setTasks((prev) => [...prev, normalizeTask(res.data.task)]);
  };

  const updateTask = async (id, updates) => {
    const res = await client.put(`/crm/tasks/${id}`, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? normalizeTask(res.data.task) : t)));
  };

  const deleteTask = async (id) => {
    await client.delete(`/crm/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TasksContext.Provider
      value={{ tasks, loading, setTasks, completeTask, reopenTask, addTask, updateTask, deleteTask, fetchTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used inside TasksProvider");
  return context;
}