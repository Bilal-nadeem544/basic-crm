import { createContext, useContext, useState } from "react";
import { dummyTasks } from "../data/dummyLeads";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(dummyTasks);

  const completeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Completed" } : t))
    );
  };

  const reopenTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Pending" } : t))
    );
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now(), status: "Pending" }]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, completeTask, reopenTask, addTask, updateTask, deleteTask }}
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