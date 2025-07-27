import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

export default function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    github: "",
    type: "Code",
    reason: "",
    dateStarted: "",
    abandonedAt: new Date().toISOString().slice(0, 10), // today's date in YYYY-MM-DD
    isPublic: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      owner: "Anonymous", // TODO: replace with auth user
    };

    fetch(`${API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    })
      .then((res) => res.json())
      .then(() => navigate("/dashboard"))
      .catch((err) => console.error("Failed to add project:", err));
  };

  return (
    <div className="min-h-screen bg-black text-[#34e0a1] p-6 font-sans">
      <h1 className="text-3xl font-bold text-[#34e0a1] mb-6">
        Add New Project
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl mx-auto bg-[#111] p-6 rounded-lg shadow-lg border border-[#34e0a1]"
      >
        <div>
          <label className="block mb-1">Project Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
        </div>

        <div>
          <label className="block mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          >
            <option>Code</option>
            <option>Business</option>
            <option>Content</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1] h-32"
          />
        </div>

        <div>
          <label className="block mb-1">Reason for Abandonment</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1] h-24"
            placeholder="Optional but funny 😭"
          />
        </div>

        <div>
          <label className="block mb-1">Date Started</label>
          <input
            type="date"
            name="dateStarted"
            value={formData.dateStarted}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
        </div>

        <div>
          <label className="block mb-1">GitHub / YouTube / External Link</label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/your/project or YouTube link"
            className="w-full px-4 py-2 rounded bg-black text-[#34e0a1] border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="accent-[#34e0a1]"
          />
          <label htmlFor="isPublic">Make project public (browseable)</label>
        </div>

        <button
          type="submit"
          className="bg-[#34e0a1] text-black px-6 py-2 rounded hover:bg-[#2cc185] transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}
