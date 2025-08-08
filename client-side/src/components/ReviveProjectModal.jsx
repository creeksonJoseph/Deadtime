import { useState } from "react";
import { reviveProject } from "../api/revive";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../contexts/AuthContext";
import { X, Heart, ExternalLink } from "lucide-react";

export function ReviveProjectModal({ projectId, onClose, onRevived }) {
  const [notes, setNotes] = useState("");
  const [newProjectLink, setNewProjectLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token, refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Please describe how you'll revive this project");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const result = await reviveProject(projectId, notes, newProjectLink, token);
      await refreshUser(); // Update user stats immediately
      setLoading(false);
      onRevived(result.card);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to revive project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#141d38] rounded-2xl border border-slate-600/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#34e0a1]/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#34e0a1]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Revive Project</h2>
              <p className="text-sm text-slate-400">Give this project a second chance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Revival Plan *
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe how you plan to revive this project. What will you do differently? What's your vision for bringing it back to life?"
              className="min-h-[120px] bg-slate-800/40 border-slate-600/40 text-slate-200 placeholder:text-slate-500 rounded-xl resize-none focus:border-[#34e0a1]/50 focus:ring-[#34e0a1]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Project Link (Optional)
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={newProjectLink}
                onChange={(e) => setNewProjectLink(e.target.value)}
                placeholder="https://github.com/yourusername/revived-project"
                className="pl-10 bg-slate-800/40 border-slate-600/40 text-slate-200 placeholder:text-slate-500 rounded-xl focus:border-[#34e0a1]/50 focus:ring-[#34e0a1]/20"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Share a link to your version, fork, or continuation of this project
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="outline"
              className="flex-1 border-slate-600/40 text-slate-300 hover:bg-slate-800/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !notes.trim()}
              className="flex-1 bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 font-semibold disabled:opacity-50"
            >
              {loading ? "Reviving..." : "Revive Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
