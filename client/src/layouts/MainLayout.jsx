import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react"; // sidebar toggle icon
import Topbar from "../components/Topbar";

function MainLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-brand-dark text-white transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 p-6 flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div
          className={`${
            sidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <h2 className="text-2xl font-bold mb-8 text-blue-400">
            Job Application Tracker
          </h2>

          <nav className="flex flex-col space-y-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300 hover:text-white"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/reminders"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300 hover:text-white"
              }
            >
              Reminders
            </NavLink>
          </nav>
        </div>

        {sidebarOpen && (
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-6"
          >
            Log Out
          </button>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-0"
        }`}
      >
        {/* Topbar */}
        <div className="w-full bg-gray-800 py-4 shadow-md flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-blue-400 transition"
          >
            <Menu size={26} />
          </button>
          <Topbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 w-full flex justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="w-full max-w-6xl px-6 py-8 flex flex-col gap-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
