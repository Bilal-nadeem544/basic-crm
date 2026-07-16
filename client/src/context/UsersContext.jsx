import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await client.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, loading, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used inside UsersProvider");
  return context;
}