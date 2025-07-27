import React from "react";
import ProjectCard from "./ProjectCard";

const Dashboard = ({
  username,
  projects,
  onAddProject,
  onView,
  onEdit,
  onDelete,
  onShare,
}) => {
  return (
    <div className="min-h-screen bg-black text-[#34e0a1] p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Welcome back, {username}</h1>
        <button
          onClick={onAddProject}
          className="bg-[#34e0a1] text-black px-4 py-2 rounded hover:bg-[#2cc185] transition"
          aria-label="Add a Dead Project"
        >
          + Add a Dead Project ☠️
        </button>
      </header>

      {(projects ?? []).length === 0 ? (
        <p className="text-center text-lg mt-12">No projects submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => onView(project.id)}
              onEdit={() => onEdit(project.id)}
              onDelete={() => onDelete(project.id)}
              onShare={() => onShare(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
