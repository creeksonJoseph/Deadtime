import { useEffect, useState } from "react";
import { X, ExternalLink, Edit, Heart, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getGhostCardById } from "../api/ghostcards";
import { getNotesForProject, createGhostNote } from "../api/ghostnotes";
import { useAuth } from "../contexts/AuthContext";
import { ReviveProjectModal } from "./ReviveProjectModal";
import { Textarea } from "./ui/textarea";

export function ProjectModal({
  project,
  projectId,
  onClose,
  onEdit,
  isOwner = false,
}) {
  const [visible, setVisible] = useState(false);
  const [loadedProject, setLoadedProject] = useState(project);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState("");
  const [showRevive, setShowRevive] = useState(false);

  const { token } = useAuth();
  const projectToUse = loadedProject || project;

  // Animate in
  useEffect(() => setVisible(true), []);

  // Fetch project if ID passed
  useEffect(() => {
    if (!project && projectId) {
      getGhostCardById(projectId, token).then(setLoadedProject);
    }
  }, [project, projectId, token]);

  // Fetch notes
  useEffect(() => {
    if (projectToUse?._id) {
      console.log("📥 Fetching notes for project:", projectToUse._id);
      getNotesForProject(projectToUse._id, token)
        .then((fetchedNotes) => {
          console.log("✅ Notes fetched:", fetchedNotes);
          setNotes(fetchedNotes);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch notes:", err);
        });
    }
  }, [projectToUse, token]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const getStatusColor = (status) => {
    switch (status) {
      case "abandoned":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "on-hold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "revived":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handlePostNote = async () => {
    if (!newNote.trim()) return;
    setLoadingNote(true);
    try {
      const note = await createGhostNote(
        { projectId: projectToUse._id, note: newNote, isAnonymous },
        token
      );
      setNotes((prev) => [note, ...prev]);
      setNewNote("");
      setIsAnonymous(false);
    } catch {
      setError("Failed to post comment.");
    } finally {
      setLoadingNote(false);
    }
  };

  if (!projectToUse) return <div className="p-8">Loading...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#141d38] rounded-2xl overflow-hidden shadow-xl neon-glow transition-all duration-200 transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 glass rounded-full p-2 hover:glass-strong transition-all duration-300"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {projectToUse.logoUrl && (
              <img
                src={projectToUse.logoUrl}
                alt={projectToUse.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {projectToUse.title}
              </h2>
              <p className="text-slate-400 text-sm">
                Started: {formatDate(projectToUse.dateStarted)}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(projectToUse.status)}>
            {projectToUse.status}
          </Badge>
        </div>

        {/* Cover Image */}
        {projectToUse.images && projectToUse.images.length > 0 ? (
          <div className="w-full overflow-x-auto flex gap-2 py-2 px-2">
            {projectToUse.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Project image ${idx + 1}`}
                className="h-40 w-auto rounded-lg object-cover shadow-md border-2 border-[#34e0a1]/20"
                style={{ minWidth: 160 }}
              />
            ))}
          </div>
        ) : projectToUse.logoUrl ? (
          <div className="w-full h-52 sm:h-64 overflow-hidden">
            <img
              src={projectToUse.logoUrl}
              className="w-full h-full object-cover"
              alt={projectToUse.title}
            />
          </div>
        ) : null}

        {/* Scrollable Project Info & Comments */}
        <div className="flex-1 overflow-y-auto">
          {/* Project Info */}
          <div className="p-6 space-y-4">
            <p className="text-slate-300 leading-relaxed">
              {projectToUse.description}
            </p>

            {projectToUse.abandonmentReason && (
              <div className="glass rounded-lg p-4 text-slate-300 text-sm">
                <strong>Abandonment Reason:</strong>{" "}
                {projectToUse.abandonmentReason}
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {projectToUse.externalLink && (
                <a
                  href={projectToUse.externalLink}
                  target="_blank"
                  className="text-[#34e0a1] hover:underline text-sm"
                >
                  <ExternalLink className="w-4 h-4 inline-block mr-1" />
                  View External Link
                </a>
              )}
              {projectToUse.pitchDeckUrl && (
                <a
                  href={projectToUse.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#34e0a1] hover:underline text-sm flex items-center gap-1"
                  title="Opens in new tab / Downloads"
                  download
                >
                  <FileText className="w-4 h-4 inline-block mr-1" />
                  View Pitch Deck
                  <span className="ml-1 text-xs">
                    {projectToUse.pitchDeckUrl.endsWith(".pdf")
                      ? "PDF"
                      : "Download"}
                  </span>
                </a>
              )}
            </div>

            {/* Owner Actions */}
            <div className="flex gap-3 pt-2">
              {isOwner && (
                <Button
                  onClick={() => {
                    onClose();
                    onEdit(projectToUse);
                  }}
                  variant="outline"
                  className="border-[#34e0a1] text-[#34e0a1] hover:bg-[#34e0a1]/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
              )}
              {!isOwner && projectToUse.status === "abandoned" && (
                <Button
                  className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
                  onClick={() => setShowRevive(true)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Revive Project
                </Button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-700 bg-[#0e1529] p-6 space-y-4">
            <h3 className="text-lg text-slate-200 font-semibold">Comments</h3>

            {/* New Comment */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Leave a comment..."
                className="flex-1"
              />
              <Button
                onClick={handlePostNote}
                disabled={loadingNote}
                className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
              >
                {loadingNote ? "Posting..." : "Post"}
              </Button>
            </div>
            {error && (
              <div className="text-red-400 neon-glow mt-2">{error}</div>
            )}

            {/* Notes list */}
            {notes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                💬 No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n._id}
                    className={`glass rounded-lg p-3 text-slate-300 text-sm ${
                      n.system ? "border-l-4 border-[#34e0a1]" : ""
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">
                        {n.system
                          ? "System"
                          : n.isAnonymous
                            ? "Anonymous"
                            : n.user?.name || "Unknown"}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                    <p>{n.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revive Modal */}
      {showRevive && (
        <ReviveProjectModal
          projectId={projectToUse._id}
          onClose={() => setShowRevive(false)}
          onRevived={() => {}}
        />
      )}
    </div>
  );
}
