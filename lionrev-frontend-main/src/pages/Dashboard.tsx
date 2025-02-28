import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { LeadsTable } from "../components/LeadsTable";
import type { Lead } from "../types/Lead";
import axios from "axios";

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_API_URL}/api/leads?id=${token}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leads");
        setLoading(false);
      }
    };

    fetchLeads();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        {/* Pass the logout function to Header */}
        <Header onLogout={handleLogout} />
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <LeadsTable
            leads={leads}
            columnVisibility={{
              fullName: true,
              email: true,
              phone: true,
              service: false,
              revenue: true,
              zip: true,
              createdDate: true,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
