import React, { useEffect, useState } from "react";
import { API } from "../App";
import ProjectCard from "../pages/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function Graveyard() {
  const [deadProjects, setDeadProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/projects?status=RIP`)
      .then((res) => res.json())
      .then((data) => setDeadProjects(data))
      .catch((err) => console.error("Failed to fetch RIP projects", err));
  }, []);

  const handleView = (id) => navigate(`/project/${id}`);
  const handleEdit = (id) => navigate(`/edit/${id}`);
  const handleDelete = (id) => {
    fetch(`${API}/projects/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setDeadProjects((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => console.error("Failed to delete project", err));
  };

  const handleShare = (project) => {
    const shareText = `Check out this fallen project: ${project.title}`;
    navigator.clipboard.writeText(shareText);
    alert("Graveyard link copied to clipboard ☠️");
  };

  return (
    <section className="min-h-screen bg-[#141d38] text-[#fcdb32] p-6">
      <h2 className="text-3xl font-bold mb-4">🪦 The Graveyard</h2>

      {deadProjects.length === 0 ? (
        <p className="text-lg text-white">No RIP projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deadProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => handleView(project.id)}
              onEdit={() => handleEdit(project.id)}
              onDelete={() => handleDelete(project.id)}
              onShare={() => handleShare(project)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
