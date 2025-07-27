import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../App";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const generateUsername = (name) =>
    name.toLowerCase().replace(/\s+/g, "") || `user${Date.now()}`;

  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password, // For demo only! Do NOT store plain passwords in production
      username: generateUsername(form.name),
      authProvider: "local",
    };

    fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create user");
        return res.json();
      })
      .then((createdUser) => {
        console.log("User created:", createdUser);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to create user. Try again.");
      });
  };

  const handleGoogleSignup = () => {
    console.log("Google sign up clicked - implement OAuth later");
  };

  const handleGithubSignup = () => {
    console.log("GitHub sign up clicked - implement OAuth later");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#34e0a1] p-4 font-sans">
      <div className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#34e0a1]">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-3 rounded bg-black text-[#34e0a1] placeholder-[#34e0a177] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
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
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 bg-white text-black p-3 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>
          <button
            onClick={handleGithubSignup}
            className="flex items-center justify-center gap-3 bg-[#0d1117] text-white p-3 rounded hover:bg-[#1b1f23] transition"
          >
            <FaGithub size={20} />
            Sign up with GitHub
          </button>
        </div>

        <p className="text-sm mt-6 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-[#34e0a1]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
