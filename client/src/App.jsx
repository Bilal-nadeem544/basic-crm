import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import MyTasks from "./pages/MyTasks";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LeadsProvider } from "./context/LeadsContext";
import { TasksProvider } from "./context/TasksContext";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { UsersProvider } from "./context/UsersContext";

function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>;
  if (!user) return <Login />;

  return (
    <UsersProvider>
      <LeadsProvider>
        <TasksProvider>
          <ActivitiesProvider>
            <div className="flex bg-[#F3F4F6] min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Pipeline />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/tasks" element={<MyTasks />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </ActivitiesProvider>
        </TasksProvider>
      </LeadsProvider>
    </UsersProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}