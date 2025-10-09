import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log("Dashboard useEffect is running...");
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        console.log("Fetched applications:", res.data);
        setApplications(res.data);
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );
      }
    };
    fetchApplications();
  }, []);

  // --- Derive Stats ---
  const total = applications.length;
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(
    ([status, count]) => ({
      name:
        status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    })
  );

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#dc2626",
    "#9333ea",
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">
        Welcome To Your Dashboard
      </h1>
      <p className="mb-6">Logged In As: {user?.email}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-8"
      >
        Log Out
      </button>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">
            Total Applications
          </h2>
          <p className="text-3xl font-bold text-blue-400">
            {total}
          </p>
        </div>
        {Object.entries(statusCounts).map(
          ([status, count]) => (
            <div
              key={status}
              className="bg-gray-800 p-6 rounded-lg shadow text-center"
            >
              <h2 className="text-lg font-semibold mb-2 capitalize">
                {status}
              </h2>
              <p className="text-3xl font-bold text-green-400">
                {count}
              </p>
            </div>
          )
        )}
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Applications by Status
        </h2>
        {chartData.length === 0 ? (
          <p>No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
