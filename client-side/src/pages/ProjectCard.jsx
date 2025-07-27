import React from "react";

const statusColors = {
  RIP: "bg-red-600 text-red-100",
  Reviving: "bg-yellow-400 text-yellow-900",
  "Still Hopeful": "bg-green-600 text-green-100",
};

const ProjectCard = ({ project, onView, onEdit, onDelete, onShare }) => {
  // Defensive guard: return null if no project or invalid object
  if (!project || typeof project !== "object") {
    console.warn("ProjectCard received invalid project prop:", project);
    return null;
  }

  // Destructure with fallback defaults
  const { title = "Untitled Project", status = "Unknown", createdAt } = project;

  // Format created date safely
  let createdDateFormatted = "Unknown date";
  if (createdAt) {
    const date = new Date(createdAt);
    if (!isNaN(date)) {
      createdDateFormatted = date.toLocaleDateString();
    }
  }

  return (
    <div className="bg-[#111] rounded-lg shadow-lg p-6 flex flex-col justify-between border border-[#34e0a1]">
      <div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <span
          className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
            statusColors[status] || "bg-gray-600 text-white"
          }`}
        >
          {status}
        </span>
        <p className="text-sm mt-2 text-[#34e0a1]">
          Created: {createdDateFormatted}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {status === "RIP" && (
          <button
            onClick={onShare}
            className="text-[#34e0a1] hover:text-[#2cc185] border border-[#34e0a1] px-3 py-1 rounded"
            aria-label={`Share ${title}`}
          >
            Share
          </button>
        )}
        <button
          onClick={onView}
          className="text-[#34e0a1] hover:text-[#2cc185] border border-[#34e0a1] px-3 py-1 rounded"
          aria-label={`View ${title}`}
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="text-[#34e0a1] hover:text-[#2cc185] border border-[#34e0a1] px-3 py-1 rounded"
          aria-label={`Edit ${title}`}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 border border-red-600 px-3 py-1 rounded"
          aria-label={`Delete ${title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
