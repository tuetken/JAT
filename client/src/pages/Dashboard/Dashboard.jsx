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
  const [chartData, setChartData] = useState([]);
  const [notifiedIds, setNotifiedIds] = useState([]);
  const [editingApp, setEditingApp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { logout } = useAuth();

  // Reminder Notifications + Fetch Applications

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
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

  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }

    // Check and trigger reminders

    const checkReminders = () => {
      const today = new Date().toISOString().split("T")[0];
      applications.forEach((app) => {
        if (app.reminder) {
          const reminderDate = new Date(app.reminder)
            .toISOString()
            .split("T")[0];
          if (
            reminderDate === today &&
            !notifiedIds.includes(app._id)
          ) {
            triggerNotification(app);
            setNotifiedIds((prev) => [...prev, app._id]);
          }
        }
      });
    };

    const triggerNotification = (app) => {
      if (Notification.permission === "granted") {
        new Notification("📅 Reminder", {
          body: `Reminder for ${app.company}: ${app.position}`,
          icon: "/favicon.ico",
        });
      }
    };

    if (applications.length > 0) checkReminders();
    const hourlyInterval = setInterval(
      checkReminders,
      1000 * 60 * 60
    );
    return () => clearInterval(hourlyInterval);
  }, [applications, notifiedIds]);

  // Chart Data

  useEffect(() => {
    if (applications.length === 0) {
      setChartData([]);
      return;
    }

    const statusCounts = applications.reduce((acc, app) => {
      if (!app.status) return acc;
      const normalized = app.status.toLowerCase().trim();
      acc[normalized] = (acc[normalized] || 0) + 1;
      return acc;
    }, {});

    const labelMap = {
      "waiting for response": "Waiting For Response",
      interview: "Interview",
      "offer received": "Offer Received",
      accepted: "Accepted",
      denied: "Denied",
    };

    const data = Object.keys(statusCounts).map(
      (status) => ({
        name: labelMap[status] || status,
        value: Number(statusCounts[status]),
      })
    );

    setChartData(data);
  }, [applications]);

  // CRUD

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "waiting for response",
    notes: "",
    reminder: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/applications", {
        company: formData.company,
        position: formData.position,
        status: formData.status,
        notes: formData.notes,
        reminder: formData.reminder
          ? new Date(formData.reminder + "T00:00:00")
          : null,
      });
      setApplications((prev) => [...prev, res.data]);
      resetForm();
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/applications/${editingApp._id}`,
        {
          ...formData,
          reminder: formData.reminder
            ? new Date(formData.reminder + "T00:00:00")
            : null,
        }
      );
      setApplications((prev) =>
        prev.map((a) =>
          a._id === editingApp._id ? res.data : a
        )
      );
      resetForm();
      setEditingApp(null);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: "waiting for response",
      notes: "",
      reminder: "",
    });
    setShowForm(false);
  };

  // Logout

  const handleLogout = async () => {
    await logout();
  };

  // Render

  const COLORS = {
    "Waiting For Response": "#3B82F6",
    Interview: "#10B981",
    "Offer Received": "#F59E0B",
    Accepted: "#84CC16",
    Denied: "#EF4444",
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

          {chartData.map(({ name, value }) => (
            <div
              key={name}
              className="flex-1 min-w-[150px] bg-brand-surface p-6 rounded-lg shadow text-center"
            >
              <h3 className="text-gray-400 text-sm uppercase mb-2">
                {name}
              </h3>
              <p className="text-3xl font-bold text-brand-accent">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Add / Edit Form */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Application"}
        </button>
      </div>

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
              className="w-full p-2 rounded text-white bg-gray-700"
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
              className="w-full p-2 rounded text-white bg-gray-700"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded text-white bg-gray-700"
              required
            >
              <option value="">Select Status</option>
              <option value="waiting for response">
                Waiting for Response
              </option>
              <option value="interview">Interview</option>
              <option value="offer received">
                Offer Received
              </option>
              <option value="accepted">Accepted</option>
              <option value="denied">Denied</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 rounded text-white bg-gray-700"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Reminder Date
            </label>
            <input
              type="date"
              value={formData.reminder || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reminder: e.target.value,
                })
              }
              className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
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
                <th className="p-2">Reminder</th>
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
                  <td className="p-2">
                    {app.reminder
                      ? new Date(
                          app.reminder
                        ).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete ${app.company}?`
                          )
                        )
                          return;
                        try {
                          await api.delete(
                            `/applications/${app._id}`
                          );
                          setApplications((prev) =>
                            prev.filter(
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
                          reminder: app.reminder
                            ? new Date(app.reminder)
                                .toISOString()
                                .split("T")[0]
                            : "",
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
      <div className="bg-gray-800 p-4 rounded-lg shadow w-full max-w-sm min-h-[350px] overflow-visible flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-4">
          Applications by Status
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius="80%"
                label
                isAnimationActive={true}
                animationDuration={800}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 italic">
            No data yet
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
