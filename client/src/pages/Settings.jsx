import { useState } from "react";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#111827]">Settings</h2>
        <p className="text-sm text-gray-500">Your account details</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-semibold">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.role || "staff"}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-[#E5E7EB] pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm text-[#111827] font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <Mail size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm text-[#111827] font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <Shield size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm text-[#111827] font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] mt-6 pt-6">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}