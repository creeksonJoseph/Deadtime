import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../App";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-center text-[#34e0a1] mt-20">Loading...</p>;
  }

  if (!project) {
    return (
      <p className="text-center text-red-600 mt-20">
        Project not found or failed to load.
      </p>
    );
  }

  const {
    title,
    description,
    tags = [],
    userId,
    createdAt,
    reason,
    github,
  } = project;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <button
        onClick={() => navigate("/graveyard")}
        className="mb-6 text-[#34e0a1] underline hover:opacity-80"
      >
        ← Back to Graveyard
      </button>

      <div className="bg-[#111] rounded-lg p-6 border border-[#34e0a1] shadow-lg max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[#34e0a1] mb-2">{title}</h1>
        <p className="text-sm text-gray-300 mb-2">
          by User #{userId} • {new Date(createdAt).toLocaleDateString()}
        </p>

        <p className="mb-4">{description}</p>

        {reason && (
          <p className="italic text-[#fcdb32] mb-4">Reason it died: {reason}</p>
        )}

        {github && (
          <p className="mb-4">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#34e0a1] underline hover:text-[#2cc185]"
            >
              View on GitHub / External Link
            </a>
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-[#34e0a1] text-black px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => alert("Adopt modal coming soon")}
          className="bg-[#34e0a1] text-black px-6 py-3 rounded hover:bg-[#2cc185] transition"
        >
          Adopt Project
        </button>
      </div>
    </div>
  );
}
