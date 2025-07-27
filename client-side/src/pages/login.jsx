import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/users";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(API_URL);
      const user = res.data.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        alert("Login successful 🔐✅");
        // You can also save to localStorage or redirect here
        // localStorage.setItem("user", JSON.stringify(user));
      } else {
        alert("Invalid email or password ❌");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong 😓");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#34e0a1] font-sans">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-[0_0_10px_#34e0a1] w-80">
        <h2 className="text-center text-2xl mb-6 font-semibold">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 border-2 border-[#34e0a1] rounded bg-transparent text-[#34e0a1] placeholder-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            placeholder="Enter your email"
          />
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-6 px-3 py-2 border-2 border-[#34e0a1] rounded bg-transparent text-[#34e0a1] placeholder-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full bg-[#34e0a1] text-black font-bold py-2 rounded hover:bg-[#2cc185] transition"
          >
            Login
          </button>
        </form>
        <a
          href="/signup"
          className="block text-center mt-4 underline text-[#34e0a1]"
        >
          Don&apos;t have an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
