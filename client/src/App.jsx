import { useAuth } from "./context/AuthContext";

function App() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        Welcome To Your Dashboard
      </h1>
      <p className="mb-4">Logged In As: {user?.email}</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
}

export default App;
