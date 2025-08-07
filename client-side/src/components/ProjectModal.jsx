import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Edit,
  Heart,
  FileText,
  MoreVertical,
  Trash2,
  Share2,
  Download,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getGhostCardById } from "../api/ghostcards";
import { getNotesForProject, createGhostNote } from "../api/ghostnotes";
import { ReviveProjectModal } from "./ReviveProjectModal";
import { TombstoneCard } from "./TombstoneCard";
import { Textarea } from "./ui/textarea";

export function ProjectModal({
  project,
  projectId,
  token,
  onClose,
  onEdit,
  isOwner = false,
  onDelete,
}) {
  const [visible, setVisible] = useState(false);
  const [loadedProject, setLoadedProject] = useState(project);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState("");
  const [showRevive, setShowRevive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTombstone, setShowTombstone] = useState(false);

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
      getNotesForProject(projectToUse._id, token)
        .then(async (fetchedNotes) => {
          // Fetch user data for notes that don't have user info
          const notesWithUsers = await Promise.all(
            fetchedNotes.map(async (note) => {
              if (!note.isAnonymous && !note.system && (!note.user || !note.user.username)) {
                try {
                  const userRes = await fetch(`https://deadtime.onrender.com/api/users/${note.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  if (userRes.ok) {
                    const userData = await userRes.json();
                    return { ...note, user: userData.user };
                  }
                } catch (err) {
                  console.error('Failed to fetch user for note:', err);
                }
              }
              return note;
            })
          );
          setNotes(notesWithUsers);
        })
        .catch((err) => {
          if (err.message === "Failed to fetch notes") {
            setError(
              "You do not have permission to view comments for this project."
            );
          } else {
            setError("Failed to fetch comments.");
          }
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "abandoned":
        return "RIP";
      case "on-hold":
        return "Reviving";
      case "revived":
        return "Still Hopeful";
      default:
        return status;
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

  if (!projectToUse)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#141d38] rounded-2xl p-8 border border-slate-600/30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#fcdb32] mx-auto"></div>
          <p className="text-slate-400 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-[#141d38] rounded-3xl overflow-hidden shadow-2xl border border-slate-600/20 transition-all duration-300 transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Fixed */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>

        {/* 3-dots menu in header */}
        {isOwner && (
          <>
            <button
              className="absolute top-6 right-20 z-50 bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 transition-all border border-slate-600/40"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical className="w-5 h-5 text-slate-300" />
            </button>
            {menuOpen && (
              <div className="absolute top-16 right-20 z-50 bg-[#141d38] border border-slate-700/40 rounded-xl shadow-lg py-2 w-40">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(projectToUse);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            )}
          </>
        )}

        {/* Scrollable Content - Everything scrolls together */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Images - At the very top but scrollable */}
          {projectToUse.images && projectToUse.images.length > 0 ? (
            <div className="w-full">
              {projectToUse.images.length === 1 ? (
                // Single image - full width
                <div className="w-full h-80 overflow-hidden">
                  <img
                    src={projectToUse.images[0]}
                    alt="Project showcase"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                // Multiple images - grid layout
                <div className="w-full h-80 flex gap-1">
                  {projectToUse.images.slice(0, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className={`overflow-hidden ${
                        projectToUse.images.length === 2 ? "w-1/2" : "w-1/3"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Project image ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : projectToUse.logoUrl ? (
            // Fallback to logo if no images
            <div className="w-full h-80 overflow-hidden">
              <img
                src={projectToUse.logoUrl}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt={projectToUse.title}
              />
            </div>
          ) : null}

          {/* Header Section */}
          <div className="p-8 pb-6">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  {projectToUse.logoUrl &&
                    projectToUse.images &&
                    projectToUse.images.length > 0 && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-600/30 flex-shrink-0">
                        <img
                          src={projectToUse.logoUrl}
                          alt={projectToUse.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                      {projectToUse.title}
                    </h2>
                    <p className="text-slate-400 text-base">
                      Started: {formatDate(projectToUse.dateStarted)}
                    </p>
                  </div>
                </div>
              </div>
              <Badge
                className={`${getStatusColor(projectToUse.status)} px-4 py-2 rounded-xl border text-base font-medium`}
              >
                {getStatusLabel(projectToUse.status)}
              </Badge>
            </div>
          </div>

          {/* Project Details */}
          <div className="px-8 pb-8 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                About this project
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {projectToUse.description}
              </p>
            </div>

            {/* Abandonment Reason */}
            {projectToUse.abandonmentReason && (
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/30">
                <h4 className="text-base font-semibold text-[#fcdb32] mb-3 uppercase tracking-wide">
                  Why it was abandoned
                </h4>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {projectToUse.abandonmentReason}
                </p>
              </div>
            )}

            {/* Links */}
            {(projectToUse.externalLink || projectToUse.pitchDeckUrl) && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide">
                  Resources
                </h4>
                <div className="flex flex-wrap gap-4">
                  {projectToUse.externalLink && (
                    <a
                      href={projectToUse.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-[#fcdb32] rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-[#fcdb32]/30 font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View External Link
                    </a>
                  )}
                  {projectToUse.pitchDeckUrl && (
                    <a
                      href={projectToUse.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-[#fcdb32] rounded-xl transition-all duration-200 border border-slate-600/30 hover:border-[#fcdb32]/30 font-medium"
                      download
                    >
                      <FileText className="w-5 h-5" />
                      Download Pitch Deck
                      <span className="text-sm bg-slate-700/60 px-3 py-1 rounded-lg">
                        {projectToUse.pitchDeckUrl.endsWith(".pdf")
                          ? "PDF"
                          : "File"}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {isOwner && (
                <Button
                  onClick={() => {
                    onClose();
                    onEdit(projectToUse);
                  }}
                  className="bg-transparent border-2 border-[#fcdb32] text-[#fcdb32] hover:bg-[#fcdb32] hover:text-[#141d38] px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-base"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Project
                </Button>
              )}
              {!isOwner && (
                <Button
                  className="bg-[#fcdb32] text-[#141d38] hover:bg-[#fcdb32]/90 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-[#fcdb32]/20 text-base"
                  onClick={() => setShowRevive(true)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Revive Project
                </Button>
              )}
              <Button
                onClick={() => setShowTombstone(true)}
                className="bg-transparent border-2 border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-base"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Generate RIP Card
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-700/50 bg-slate-900/30 p-8">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#fcdb32] rounded-full"></div>
              Comments
            </h3>

            {/* New Comment Form */}
            <div className="bg-slate-800/40 rounded-2xl p-8 mb-8 border border-slate-700/30">
              <div className="space-y-6">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  className="min-h-[120px] bg-slate-900/60 border-slate-600/40 text-slate-200 placeholder:text-slate-500 rounded-xl resize-none focus:border-[#fcdb32]/50 focus:ring-[#fcdb32]/20 text-base p-4"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-base text-slate-400">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-[#fcdb32] focus:ring-[#fcdb32]/20 w-4 h-4"
                    />
                    Post anonymously
                  </label>
                  <Button
                    onClick={handlePostNote}
                    disabled={loadingNote || !newNote.trim()}
                    className="bg-[#fcdb32] text-[#141d38] hover:bg-[#fcdb32]/90 px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 text-base"
                  >
                    {loadingNote ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl mb-8 text-base">
                {error}
              </div>
            )}

            {/* Comments List */}
            {notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-500 text-xl">No comments yet</p>
                <p className="text-slate-600 text-base mt-2">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className={`bg-slate-800/40 rounded-2xl p-6 border transition-all duration-200 hover:bg-slate-800/60 ${
                      note.system
                        ? "border-[#fcdb32]/30 bg-[#fcdb32]/5"
                        : "border-slate-700/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#fcdb32] to-[#fcdb32]/70 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#141d38] text-base font-semibold">
                            {note.system
                              ? "S"
                              : note.isAnonymous
                                ? "A"
                                : (note.user?.username || note.user?.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-base">
                            {note.system
                              ? "System"
                              : note.isAnonymous
                                ? "Anonymous User"
                                : note.user?.username || note.user?.name || "Unknown User"}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {formatDate(note.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-14 text-base">
                      {note.note}
                    </p>
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
          onRevived={(updatedCard) => {
            if (updatedCard) {
              setLoadedProject(updatedCard);
            }
          }}
        />
      )}

      {/* Tombstone Card Modal */}
      {showTombstone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowTombstone(false)}
          />
          <div className="relative bg-[#141d38] rounded-2xl p-8 border border-slate-600/30 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">RIP Card</h3>
              <button
                onClick={() => setShowTombstone(false)}
                className="w-8 h-8 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </div>
            <TombstoneCard 
              project={projectToUse}
              onDownload={async () => {
                try {
                  const html2canvas = (await import('html2canvas')).default;
                  const element = document.getElementById('tombstone-card');
                  if (element) {
                    const canvas = await html2canvas(element, {
                      backgroundColor: '#141d38',
                      scale: 2,
                      useCORS: true,
                      allowTaint: true,
                      foreignObjectRendering: true
                    });
                    const link = document.createElement('a');
                    link.download = `${projectToUse.title.replace(/[^a-z0-9]/gi, '_')}-rip-card.png`;
                    link.href = canvas.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                } catch (error) {
                  console.error('Failed to download tombstone card:', error);
                  alert('Download failed. Please try again.');
                }
              }}
              onShare={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: `RIP: ${projectToUse.title}`,
                      text: `Check out this abandoned project: ${projectToUse.title}`,
                      url: window.location.href
                    });
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                } catch (error) {
                  console.error('Share failed:', error);
                  // Fallback - just copy to clipboard
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  } catch (clipboardError) {
                    console.error('Clipboard failed:', clipboardError);
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
