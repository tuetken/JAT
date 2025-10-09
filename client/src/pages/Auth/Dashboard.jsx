import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome To Your Dashboard
      </h1>
      <p className="mb-4">Logged In As: {user?.email}</p>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>

      <div className="mt-10 text-left">
        <h2 className="text-xl mb-2">Your Applications</h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <ul>
            {applications.map((app) => (
              <li key={app._id}>
                <strong>{app.company}</strong> —{" "}
                {app.position} ({app.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
