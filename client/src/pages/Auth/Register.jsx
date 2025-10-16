// src/pages/Auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
