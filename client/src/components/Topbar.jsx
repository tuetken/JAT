import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Topbar() {
  const { user } = useAuth();
  const location = useLocation();

  // Derive page title from current route
  const getTitle = () => {
    if (location.pathname.includes("dashboard"))
      return "Dashboard";
    if (location.pathname.includes("reminders"))
      return "Reminders";
    return "Job Application Tracker";
  };

  return (
    <header className="w-full bg-gray-800 py-4 px-6 flex items-center justify-between shadow">
      <h1 className="text-2xl font-semibold text-blue-400">
        {getTitle()}
      </h1>

      <div className="flex items-center space-x-3">
        <p className="text-gray-300">
          Signed in as:{" "}
          <span className="text-white">{user?.email}</span>
        </p>
      </div>
    </header>
  );
}

export default Topbar;
