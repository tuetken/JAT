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

  // --- NEW STATE ---
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/applications", formData);
      setApplications([...applications, res.data]);
      setFormData({
        company: "",
        position: "",
        status: "applied",
        notes: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating application:", error);
    }
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

      {/* Add Application Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Application"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow mb-6 w-full max-w-lg mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4">
            New Application
          </h2>
          <div className="mb-3">
            <label className="block mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </form>
      )}

      {/* Applications List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">
          All Applications
        </h2>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Company</th>
                <th className="p-2">Position</th>
                <th className="p-2">Status</th>
                <th className="p-2">Notes</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-b border-gray-700"
                >
                  <td className="p-2">{app.company}</td>
                  <td className="p-2">{app.position}</td>
                  <td className="p-2 capitalize">
                    {app.status}
                  </td>
                  <td className="p-2">{app.notes}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={async () => {
                        const confirmDelete =
                          window.confirm(
                            `Delete ${app.company}?`
                          );
                        if (!confirmDelete) return;

                        try {
                          await api.delete(
                            `/applications/${app._id}`
                          );
                          setApplications(
                            applications.filter(
                              (a) => a._id !== app._id
                            )
                          );
                        } catch (error) {
                          console.error(
                            "Error deleting application:",
                            error
                          );
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                    >
                      Delete
                    </button>

                    {/* Edit button for later */}
                    <button
                      onClick={() =>
                        alert(
                          "Edit functionality coming soon!"
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
