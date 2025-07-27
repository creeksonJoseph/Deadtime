import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  if (!project || typeof project !== "object") {
    console.warn("ProjectCard received invalid project prop:", project);
    return null;
  }

  const {
    id,
    title = "Untitled",
    description = "No description provided.",
    tags = [],
    owner = "anonymous",
  } = project;

  return (
    <div className="bg-black border border-[#34e0a1] rounded-xl p-5 shadow-lg hover:shadow-[#34e0a1] transition duration-200">
      <h2 className="text-[#34e0a1] text-xl font-bold mb-1">{title}</h2>
      <p className="text-white text-sm mb-3 line-clamp-3">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-sm bg-[#34e0a1] text-black px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-300">by {owner}</span>
        <Link
          to={`/project/${id}`}
          className="text-[#34e0a1] text-sm underline hover:text-[#2cc185]"
        >
          View
        </Link>
      </div>
    </div>
  );
}
