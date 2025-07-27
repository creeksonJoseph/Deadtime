import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/";

const Signup = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}users`)
      .then((response) => setUsers(response.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // Check if email already exists
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      alert("Email already registered ⚠️");
      return;
    }

    const newUser = {
      id: users.length + 1,
      username: email.split("@")[0], // Simple username from email
      email,
      password,
    };

    try {
      await axios.post(`${API_URL}users`, newUser);
      alert("Signup successful 🎉");
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed 💔");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#34e0a1] font-sans">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-[0_0_10px_#34e0a1] w-80">
        <h2 className="text-center text-2xl mb-6 font-semibold">Sign Up</h2>
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
            className="w-full mb-4 px-3 py-2 border-2 border-[#34e0a1] rounded bg-transparent text-[#34e0a1] placeholder-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            placeholder="Enter your password"
          />
          <label className="block mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mb-6 px-3 py-2 border-2 border-[#34e0a1] rounded bg-transparent text-[#34e0a1] placeholder-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            placeholder="Confirm your password"
          />
          <button
            type="submit"
            className="w-full bg-[#34e0a1] text-black font-bold py-2 rounded hover:bg-[#2cc185] transition"
          >
            Sign Up
          </button>
        </form>
        <a
          href="/login"
          className="block text-center mt-4 underline text-[#34e0a1]"
        >
          Already have an account? Login
        </a>
      </div>
    </div>
  );
};

export default Signup;
