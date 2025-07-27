import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../App";

export default function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Fetch projects by userId from backend
    fetch(`${API}/projects?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-[#34e0a1] bg-black min-h-screen flex items-center justify-center p-10 font-sans">
        <p className="text-lg font-medium">
          Please log in to access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#34e0a1] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Welcome back, {user.username} 👋
        </h1>

        <div className="bg-[#111] p-4 rounded-lg shadow mb-6 border border-[#34e0a1]">
          <h2 className="text-2xl font-semibold mb-2">Your Stats</h2>
          <ul>
            <li>Total Projects: {projects.length}</li>
            <li>
              Last Upload:{" "}
              {projects.length > 0
                ? new Date(projects.at(-1).createdAt).toLocaleDateString()
                : "N/A"}
            </li>
          </ul>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <button
            onClick={() => navigate("/submit")}
            className="bg-[#34e0a1] text-black px-4 py-2 rounded hover:bg-[#2cc185] transition"
          >
            + Submit New Dead Project
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects yet. Start by adding one!</p>
        ) : (
          <div className="grid gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#111] p-4 rounded-lg shadow-md border border-[#34e0a1] hover:shadow-[#34e0a1] transition"
              >
                <h3 className="text-xl font-bold">{proj.title}</h3>
                <p className="text-sm text-white mb-2 line-clamp-3">
                  {proj.description ?? "No description"}
                </p>
                <Link
                  to={`/project/${proj.id}`}
                  className="underline text-[#34e0a1] hover:text-[#2cc185]"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/graveyard"
            className="underline text-[#34e0a1] hover:text-[#2cc185]"
          >
            Explore the Graveyard (Browse Public Projects)
          </Link>
        </div>
      </div>
    </div>
  );
}
