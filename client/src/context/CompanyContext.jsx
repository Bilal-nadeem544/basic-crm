import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState({ name: "Ingenious CRM", logo: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await client.get("/company");
      setCompany(res.data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (data) => {
    const res = await client.put("/company", data);
    setCompany(res.data.settings);
    return res.data.settings;
  };

  return (
    <CompanyContext.Provider value={{ company, loading, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany must be used inside CompanyProvider");
  return context;
}