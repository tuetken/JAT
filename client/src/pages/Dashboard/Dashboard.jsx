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
  const [editingApp, setEditingApp] = useState(null);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/applications/${editingApp._id}`,
        formData
      );
      setApplications(
        applications.map((app) =>
          app._id === editingApp._id ? res.data : app
        )
      );
      setEditingApp(null);
      setFormData({
        company: "",
        position: "",
        status: "applied",
        notes: "",
      });
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 text-white">
      {/* Summary */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Summary
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px] bg-brand-surface p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-400 text-sm uppercase mb-2">
              Total
            </h3>
            <p className="text-3xl font-bold text-brand-highlight">
              {applications.length}
            </p>
          </div>
          {Object.entries(statusCounts).map(
            ([status, count]) => (
              <div
                key={status}
                className="flex-1 min-w-[150px] bg-brand-surface p-6 rounded-lg shadow text-center"
              >
                <h3 className="text-gray-400 text-sm uppercase mb-2">
                  {status}
                </h3>
                <p className="text-3xl font-bold text-brand-accent">
                  {count}
                </p>
              </div>
            )
          )}
        </div>
      </section>

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
          onSubmit={
            editingApp ? handleUpdate : handleSubmit
          }
          className="bg-gray-800 p-6 rounded-lg shadow mb-6 w-full max-w-lg mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingApp
              ? "Edit Application"
              : "New Application"}
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
            className={`${
              editingApp
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded`}
          >
            {editingApp ? "Update" : "Save"}
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

                    <button
                      onClick={() => {
                        setEditingApp(app);
                        setFormData({
                          company: app.company,
                          position: app.position,
                          status: app.status,
                          notes: app.notes,
                        });
                        setShowForm(true);
                      }}
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
      <section className="flex flex-col lg:flex-row gap-8">
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
      </section>
    </div>
  );
}

export default Dashboard;
