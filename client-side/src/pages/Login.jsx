import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../App"; // Assumes you export your API URL from App.jsx

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Fetch user(s) by email from backend
    fetch(`${API}/users?email=${encodeURIComponent(form.email)}`)
      .then((res) => res.json())
      .then((users) => {
        if (users.length === 0) {
          setError("User not found");
          console.log("User not found");
          return;
        }

        const user = users[0];

        // NOTE: password checking here assumes the password field exists in your JSON; adjust accordingly.
        if ("password" in user && user.password === form.password) {
          console.log("Login successful:", user.username);
          setUser(user);
          navigate("/dashboard");
        } else {
          setError("Incorrect password");
          console.log("Incorrect password");
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setError("Failed to login. Please try again.");
      });
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked - integrate OAuth later");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked - integrate OAuth later");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#34e0a1] font-sans p-4">
      <div className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#34e0a1]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#34e0a1]">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-black text-[#34e0a1] placeholder-[#34e0a177] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 rounded bg-black text-[#34e0a1] placeholder-[#34e0a177] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
          {error && (
            <p className="text-red-600 text-sm mt-1 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#34e0a1] text-black font-bold py-3 rounded hover:bg-[#2cc185] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white text-black p-3 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-3 bg-[#0d1117] text-white p-3 rounded hover:bg-[#1b1f23] transition"
          >
            <FaGithub size={20} />
            Sign in with GitHub
          </button>
        </div>

        <p className="text-sm mt-6 text-center text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline hover:text-[#34e0a1]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
