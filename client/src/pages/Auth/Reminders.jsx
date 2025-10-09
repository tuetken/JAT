import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    notes: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await api.get("/reminders");
        setReminders(res.data);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };
    fetchReminders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/reminders", formData);
      setReminders([...reminders, res.data]);
      setFormData({ title: "", dueDate: "", notes: "" });
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await api.put(`/reminders/${id}`, {
        completed: !completed,
      });
      setReminders(
        reminders.map((r) =>
          r._id === id ? { ...r, completed: !completed } : r
        )
      );
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Reminders</h1>
      <p className="mb-6">Logged In As: {user?.email}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow mb-8 w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add Reminder
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Reminder Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 rounded text-black"
        />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 rounded text-black"
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save Reminder
        </button>
      </form>

      {/* List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Reminders
        </h2>
        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul>
            {reminders.map((r) => (
              <li key={r._id} className="mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`text-lg ${
                        r.completed ? "line-through" : ""
                      }`}
                    >
                      {r.title} —{" "}
                      {new Date(
                        r.dueDate
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {r.notes}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        toggleComplete(r._id, r.completed)
                      }
                      className={`${
                        r.completed
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-3 py-1 rounded mr-2`}
                    >
                      {r.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => deleteReminder(r._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reminders;
