import { createContext, useContext, useState, useEffect } from "react";
import client, { setAccessToken, setOnUnauthorized } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => setUser(null));
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const res = await client.post("/auth/refresh");
      setAccessToken(res.data.accessToken);
      const meRes = await client.get("/auth/me");
      setUser(meRes.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await client.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const signup = async (name, email, password) => {
    const res = await client.post("/auth/signup", { name, email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await client.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}