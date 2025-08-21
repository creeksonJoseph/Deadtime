import { Download, Share2, Skull } from "lucide-react";
import { Button } from "./ui/button";

export function TombstoneCard({ project, onDownload, onShare }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "code": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "business": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "content": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Tombstone Card */}
      <div 
        id="tombstone-card"
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-full rounded-b-lg p-8 border-4 border-slate-600 shadow-2xl relative"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Skull Icon */}
        <div className="text-center mb-6">
          <Skull className="w-16 h-16 mx-auto text-[#34e0a1] mb-4" />
          <div className="w-20 h-1 bg-slate-600 mx-auto"></div>
        </div>

        {/* Project Info */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {project.title}
          </h2>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm border ${getTypeColor(project.type)}`}>
            {project.type?.toUpperCase() || 'PROJECT'}
          </div>

          <div className="space-y-2 text-slate-300">
            <p className="text-sm">
              Born: {formatDate(project.dateStarted)}
            </p>
            <p className="text-sm">
              Died: {formatDate(project.createdAt)}
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 mt-6">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "{project.description?.substring(0, 100)}..."
            </p>
          </div>

          <div className="text-xs text-slate-400 mt-6">
            R.I.P. - May it find new life
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => onDownload?.()}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={() => onShare?.()}
          className="flex-1 bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38]"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}