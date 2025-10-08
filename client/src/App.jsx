import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Job Application Tracker
      </h1>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default App;
