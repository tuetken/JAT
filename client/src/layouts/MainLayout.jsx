import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar"; // ✅ Import new component

function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-blue-400">
            JAT
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
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-6"
        >
          Log Out
        </button>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Topbar /> {/* ✅ Added here */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
