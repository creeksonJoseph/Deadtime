import { ProjectCard } from "../components/ProjectCard";
import { Skull } from "lucide-react";

export function FavouritesPage({ projects, token, onOpenProject, onDelete, currentUserId, sidebarOpen }) {
  return (
    <div className={`min-h-screen py-8 px-4 pb-24 transition-all duration-300 ${sidebarOpen ? 'md:ml-28' : 'md:ml-0'}`}>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Skull className="w-8 h-8 text-[#fcdb32] animate-pulse" />
            <h1 className="text-4xl font-gothic text-[#fcdb32]">Favourites</h1>
            <Skull className="w-8 h-8 text-[#fcdb32] animate-pulse" />
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Your starred projects for quick access.
          </p>
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                token={token}
                onClick={() => onOpenProject(project)}
                showPostedBy={true}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Skull className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Favourites Yet</h3>
            <p className="text-slate-400 mb-4">
              Star projects to add them to your favourites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
