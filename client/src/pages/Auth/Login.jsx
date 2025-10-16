import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Login Card */}
      <div className="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 text-center transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 tracking-wide">
          Job Tracker Login
        </h1>

        {error && (
          <div className="text-red-400 text-sm mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left text-sm mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-left text-sm mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-8">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
