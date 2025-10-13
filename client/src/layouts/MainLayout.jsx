import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";

function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-dark text-white">
      {/* ======================== SIDEBAR ======================== */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
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

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-6"
        >
          Log Out
        </button>
      </aside>

      {/* ======================== MAIN AREA ======================== */}
      <div className="flex-1 flex flex-col items-center">
        {/* ---------- Topbar ---------- */}
        <div className="w-full bg-gray-800 py-4 shadow-md">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <Topbar />
          </div>
        </div>

        {/* ---------- Main Page Content ---------- */}
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
