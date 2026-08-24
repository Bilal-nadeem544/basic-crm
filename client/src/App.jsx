import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import MyTasks from "./pages/MyTasks";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LeadsProvider } from "./context/LeadsContext";
import { TasksProvider } from "./context/TasksContext";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { UsersProvider } from "./context/UsersContext";
import { CompanyProvider } from "./context/CompanyContext";

function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /> Loading workspace…</div>;
  if (!user) return <Login />;

  return (
    <CompanyProvider>
      <UsersProvider>
        <LeadsProvider>
          <TasksProvider>
            <ActivitiesProvider>
              <div className="app-shell">
                <Sidebar />
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/boards" replace />} />
                    <Route path="/boards" element={<Pipeline />} />
                    <Route path="/boards/:id" element={<Pipeline />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/tasks" element={<MyTasks />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/boards" replace />} />
                  </Routes>
                </main>
              </div>
            </ActivitiesProvider>
          </TasksProvider>
        </LeadsProvider>
      </UsersProvider>
    </CompanyProvider>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppLayout /></AuthProvider></BrowserRouter>;
}
