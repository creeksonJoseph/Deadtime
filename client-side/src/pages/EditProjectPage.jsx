import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../App";

export default function EditProjectPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setLoading(false);
      });
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    fetch(`${API}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        navigate(`/project/${id}`);
      })
      .catch((err) => {
        console.error("Update failed:", err);
        setSaving(false);
      });
  }

  if (loading) {
    return (
      <div className="p-6 text-[#34e0a1] text-center bg-black min-h-screen flex items-center justify-center font-sans">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!user || user.username !== project?.owner) {
    return (
      <div className="p-6 text-[#34e0a1] text-center bg-black min-h-screen flex items-center justify-center font-sans">
        <p>You’re not authorized to edit this project 👮‍♂️</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#34e0a1] p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={handleChange}
              required
              className="w-full p-2 bg-[#111] text-[#34e0a1] rounded border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={project.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-2 bg-[#111] text-[#34e0a1] rounded border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">GitHub Link</label>
            <input
              type="url"
              name="github"
              value={project.github}
              onChange={handleChange}
              className="w-full p-2 bg-[#111] text-[#34e0a1] rounded border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            />
          </div>
          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={Array.isArray(project.tags) ? project.tags.join(", ") : ""}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "tags",
                    value: e.target.value.split(",").map((t) => t.trim()),
                  },
                })
              }
              className="w-full p-2 bg-[#111] text-[#34e0a1] rounded border border-[#34e0a1] focus:outline-none focus:ring-2 focus:ring-[#34e0a1]"
            />
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(`/project/${id}`)}
              className="bg-gray-800 text-[#34e0a1] px-4 py-2 rounded hover:opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#34e0a1] text-black px-4 py-2 rounded font-semibold hover:bg-[#2cc185]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
