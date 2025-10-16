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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [notifiedIds, setNotifiedIds] = useState([]);
  const [editingApp, setEditingApp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth();

  const generateReport = () => {
    // 1️⃣ Create report title and timestamp
    const reportTitle = "Job Application Report";
    const timestamp = new Date().toLocaleString();

    // 2️⃣ Build the header row
    const headers = [
      "Company",
      "Position",
      "Status",
      "Notes",
      "Reminder Date",
      "Date Created",
    ];

    // 3️⃣ Map data into rows
    const rows = applications.map((app) => [
      app.company,
      app.position,
      app.status,
      app.notes || "",
      app.reminder
        ? new Date(app.reminder).toLocaleDateString()
        : "—",
      new Date(app.createdAt).toLocaleString(),
    ]);

    // 4️⃣ Combine into CSV format
    const csvContent = [
      [reportTitle],
      [`Generated: ${timestamp}`],
      [],
      headers,
      ...rows,
    ]
      .map((e) => e.join(","))
      .join("\n");

    // 5️⃣ Trigger file download
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      "job_application_report.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CRUD State ---
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "waiting for response",
    notes: "",
    reminder: "",
    reminderMessage: "",
  });

  useEffect(() => {
    document.title = "Job Application Tracker";
  }, []);

  // --- Fetch Applications ---
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

  // --- Reminders and Notifications ---
  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }

    const triggerNotification = (app) => {
      if (Notification.permission !== "granted") return;

      const message =
        app.reminderMessage &&
        app.reminderMessage.trim().length > 0
          ? `Reminder for ${app.company} — ${app.position}:\n${app.reminderMessage}`
          : `Reminder for ${app.company} — ${app.position}`;

      new Notification("📅 Reminder", {
        body: message,
      });
    };

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

    if (applications.length > 0) checkReminders();
    const hourlyInterval = setInterval(
      checkReminders,
      1000 * 60 * 60
    );
    return () => clearInterval(hourlyInterval);
  }, [applications, notifiedIds]);

  // --- Handle Form Input ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Handle Create ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        company: formData.company,
        position: formData.position,
        status: formData.status,
        notes: formData.notes,
        reminder: formData.reminder
          ? new Date(formData.reminder + "T00:00:00")
          : null,
        reminderMessage: formData.reminderMessage || "",
      };

      console.log("Payload being sent →", payload);
      const res = await api.post("/applications", payload);

      setApplications((prev) => [...prev, res.data]);

      setFormData({
        company: "",
        position: "",
        status: "waiting for response",
        notes: "",
        reminder: "",
        reminderMessage: "",
      });
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  // --- Handle Update ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating application →", formData);
      const res = await api.put(
        `/applications/${editingApp._id}`,
        {
          company: formData.company,
          position: formData.position,
          status: formData.status,
          notes: formData.notes,
          reminder: formData.reminder
            ? new Date(formData.reminder + "T00:00:00")
            : null,
          reminderMessage: formData.reminderMessage || "",
        }
      );

      setApplications((prev) =>
        prev.map((a) =>
          a._id === editingApp._id ? res.data : a
        )
      );

      setEditingApp(null);
      resetForm();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  // --- Reset Form ---
  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: "waiting for response",
      notes: "",
      reminder: "",
      reminderMessage: "",
    });
    setShowForm(false);
  };

  // --- Logout ---
  const handleLogout = async () => {
    await logout();
  };

  // --- Color Palette for Charts ---
  const COLORS = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // orange
    "#84CC16", // lime
    "#EF4444", // red
  ];

  // --- Derive Status Counts ---
  const statusCounts = applications.reduce((acc, app) => {
    if (!app.status) return acc;
    const normalized = app.status.toLowerCase().trim();
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});

  // --- Applications by Status (Pie Chart) ---
  const labelMap = {
    "waiting for response": "Waiting For Response",
    interview: "Interview",
    "offer received": "Offer Received",
    accepted: "Accepted",
    denied: "Denied",
  };

  const chartData = Object.keys(statusCounts).map(
    (status) => ({
      name: labelMap[status] || status,
      value: Number(statusCounts[status]),
    })
  );

  // --- Applications Over Time (Line Chart) ---
  const appsByMonthMap = applications.reduce((acc, app) => {
    if (!app.createdAt) return acc;
    const date = new Date(app.createdAt);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const appsOverTime = Object.entries(appsByMonthMap).map(
    ([month, count]) => ({
      month,
      count,
    })
  );

  // --- Success Funnel (Bar Chart) ---
  const funnelData = [
    { stage: "Applied", count: applications.length },
    {
      stage: "Interview",
      count: statusCounts["interview"] || 0,
    },
    {
      stage: "Offer Received",
      count: statusCounts["offer received"] || 0,
    },
    {
      stage: "Accepted",
      count: statusCounts["accepted"] || 0,
    },
    { stage: "Denied", count: statusCounts["denied"] || 0 },
  ];

  const filteredApplications = applications.filter((app) =>
    app.company
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

          <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Reminder Message
            </label>
            <textarea
              name="reminderMessage"
              value={formData.reminderMessage}
              onChange={handleChange}
              placeholder="e.g. Follow up with recruiter..."
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

        <button
          onClick={generateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all"
        >
          Generate Report
        </button>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

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
                <th className="p-2">Reminder Message</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
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
                  <td className="p-2 italic text-gray-300">
                    {app.reminderMessage || "—"}
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
                          reminderMessage:
                            app.reminderMessage || "",
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

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Applications by Status */}
        <div className="bg-gray-800 p-4 rounded-lg shadow min-h-[350px] overflow-visible flex flex-col items-center justify-center">
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
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#E5E7EB",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 italic">
              No data yet
            </p>
          )}
        </div>

        {/* Applications Over Time */}
        <div className="bg-gray-800 p-4 rounded-lg shadow min-h-[350px] overflow-visible flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4">
            Applications Over Time
          </h2>
          {appsOverTime && appsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appsOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis
                  allowDecimals={false}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#E5E7EB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 italic">
              No application history yet
            </p>
          )}
        </div>

        {/* Success Funnel */}
        <div className="bg-gray-800 p-4 rounded-lg shadow min-h-[350px] overflow-visible flex flex-col items-center justify-center lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Success Funnel
          </h2>
          {funnelData && funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />
                <XAxis dataKey="stage" stroke="#9CA3AF" />
                <YAxis
                  allowDecimals={false}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#E5E7EB",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  barSize={50}
                  radius={[10, 10, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 italic">
              No funnel data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
