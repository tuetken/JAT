import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";
import Topbar from "../components/Topbar";

function MainLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-dark text-white transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 flex flex-col w-64 shrink-0 transition-[max-width] duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "max-w-xs" : "max-w-0"
        }`}
      >
        <div
          className={`p-6 flex flex-col ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          style={{
            transition: sidebarOpen
              ? "opacity 250ms cubic-bezier(0.8, 0, 1, 1) 80ms"
              : "opacity 60ms ease-out",
          }}
        >
          <h2 className="text-2xl font-bold mb-8 text-blue-400">
            Job Application Tracker
          </h2>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
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
