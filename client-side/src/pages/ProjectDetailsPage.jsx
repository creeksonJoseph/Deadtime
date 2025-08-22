"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Heart,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { NetworkError, InlineNetworkError } from "../components/NetworkError";
import { useAuth } from "../contexts/AuthContext";
import { useOffline } from "../contexts/OfflineContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getGhostCardById } from "../api/ghostcards";
import {
  getNotesForProject,
  createGhostNote,
  deleteGhostNote,
} from "../api/ghostnotes";
import { ReviveProjectModal } from "../components/ReviveProjectModal";
import { Textarea } from "../components/ui/textarea";

export function ProjectDetailsPage({
  onDelete,
  onProjectRevived,
  sidebarOpen,
}) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isOnline } = useOffline();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState("");
  const [showRevive, setShowRevive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const commentSectionRef = useRef(null);

  const isOwner = project?.creatorId === user?.id;

  useEffect(() => {
    if (projectId && token) {
      getGhostCardById(projectId, token)
        .then(setProject)
        .catch((err) => {
          if (!navigator.onLine) {
            setError("You're offline. Please check your internet connection.");
          } else {
            setError("Failed to load project. Please try again.");
          }
        });
    }
  }, [projectId, token]);

  useEffect(() => {
    if (project?._id) {
      getNotesForProject(project._id, token)
        .then(setNotes)
        .catch((err) => {
          if (!navigator.onLine) {
            setError("You're offline. Comments will load when you're back online.");
          } else if (err.message === "Failed to fetch notes") {
            setError("You do not have permission to view comments for this project.");
          } else {
            setError("Failed to load comments. Please try again.");
          }
        });
    }
  }, [project, token]);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
      setIsLowEndDevice(isLowEnd);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCommentSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (commentSectionRef.current) {
      observer.observe(commentSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const handlePostNote = useCallback(async () => {
    if (!newNote.trim()) return;
    if (!isOnline) {
      setError("You're offline. Please check your internet connection.");
      return;
    }
    setLoadingNote(true);
    setError(""); // Clear previous errors
    try {
      await createGhostNote(
        { projectId: project._id, note: newNote, isAnonymous },
        token
      );
      const updatedNotes = await getNotesForProject(project._id, token);
      setNotes(updatedNotes);
      setNewNote("");
    } catch (err) {
      if (!navigator.onLine) {
        setError("You're offline. Your comment will be posted when you're back online.");
      } else {
        setError("Failed to post comment. Please try again.");
      }
    } finally {
      setLoadingNote(false);
    }
  }, [newNote, project._id, isAnonymous, token, isOnline]);

  const handleDeleteNote = async (noteId) => {
    if (!navigator.onLine) {
      setError("You're offline. Please check your internet connection.");
      return;
    }
    try {
      await deleteGhostNote(noteId, token);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      if (!navigator.onLine) {
        setError("You're offline. Please try again when you're back online.");
      } else {
        setError("Failed to delete comment. Please try again.");
      }
    }
  };

  const canDeleteNote = (note) => {
    if (user?.role === "admin") return true;
    if (project.creatorId === user?.id) return true;
    if (!note.userId && !note.isAnonymous) return true;
    if (!note.isAnonymous && note.userId?._id === user?.id) return true;
    return false;
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141d38]">
        <div className="text-center max-w-md mx-auto px-4">
          {error ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Connection Issue</h3>
                <p className="text-slate-300 mb-4">{error}</p>
                <Button
                  onClick={() => {
                    setError("");
                    if (projectId && token) {
                      getGhostCardById(projectId, token)
                        .then(setProject)
                        .catch((err) => {
                          if (!navigator.onLine) {
                            setError("You're offline. Please check your internet connection.");
                          } else {
                            setError("Failed to load project. Please try again.");
                          }
                        });
                    }
                  }}
                  className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] px-6 py-2 rounded-lg font-semibold"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#34e0a1] border-b-[#141d38] mx-auto mb-4" />
              <p className="text-slate-300">Loading project...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isMobile ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden"} bg-[#141d38] ${sidebarOpen ? "md:ml-28" : "md:ml-0"} ${isLowEndDevice ? 'will-change-auto' : ''}`}
    >
      {/* Sticky Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-50 w-12 h-12 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50 backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6 text-slate-300 hover:text-[#34e0a1] transition-colors" />
      </button>

      <div className="w-full max-w-[98%] mx-auto h-full flex flex-col pt-16">
        {/* Header with menu */}
        {isOwner && (
          <div className="absolute top-20 right-4 z-50">
            <div className="relative">
              <button
                className="bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2 transition-all border border-slate-600/40"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreVertical className="w-5 h-5 text-slate-300" />
              </button>
              {menuOpen && (
                <div className="absolute top-12 right-0 z-50 bg-[#141d38] border border-slate-700/40 rounded-xl shadow-lg py-2 w-40">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete && onDelete(project);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Split Layout - Desktop / Single Scroll - Mobile */}
        <div
          className={`flex-1 flex ${isMobile ? "flex-col overflow-visible" : "flex-row overflow-hidden"}`}
        >
          {/* Project Details */}
          <div
            className={`flex-1 ${isMobile ? "" : "md:w-1/2 overflow-y-auto"}`}
          >
            {/* Hero Images */}
            {project.images && project.images.length > 0 ? (
              <div className="w-full">
                {project.images.length === 1 ? (
                  <div className="w-full h-64 overflow-hidden bg-slate-800">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt="Project showcase"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm">Image unavailable</div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 flex gap-1">
                    {project.images.slice(0, 3).map((img, idx) => (
                      <div
                        key={idx}
                        className={`overflow-hidden ${project.images.length === 2 ? "w-1/2" : "w-1/3"}`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Project image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : project.logoUrl ? (
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={project.logoUrl || "/placeholder.svg"}
                  className="w-full h-full object-cover"
                  alt={project.title}
                />
              </div>
            ) : null}

            <div className="p-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {project.logoUrl &&
                        project.images &&
                        project.images.length > 0 && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-600/30 flex-shrink-0">
                            <img
                              src={project.logoUrl || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-roboto font-bold text-white mb-2 leading-tight">
                          {project.title}
                        </h1>
                        <div className="space-y-0.5">
                          <p className="text-slate-400 text-sm">
                            Started: {formatDate(project.dateStarted)}
                          </p>
                          {project.dateAbandoned && (
                            <p className="text-red-400 text-sm">
                              Abandoned: {formatDate(project.dateAbandoned)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(project.status)} px-3 py-1 rounded-lg border text-sm font-medium`}
                  >
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">
                  About This Project
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {project.description}
                </p>
              </div>

              {/* Abandonment Reason */}
              {project.abandonmentReason && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">
                    Cause of Death
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {project.abandonmentReason}
                  </p>
                </div>
              )}

              {/* Resources */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Resources</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.externalLink && (
                      <a
                        href={project.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-[#34e0a1]/50 transition-all text-sm"
                      >
                        <ExternalLink className="w-4 h-4 text-[#34e0a1]" />
                        <span className="text-slate-300">View Project</span>
                      </a>
                    )}
                    {project.pitchDeckUrl && (
                      <a
                        href={project.pitchDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-[#34e0a1]/50 transition-all text-sm"
                      >
                        <FileText className="w-4 h-4 text-[#34e0a1]" />
                        <span className="text-slate-300">Pitch Deck</span>
                      </a>
                    )}
                  </div>
                  {project.elevatorPitch && (
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-[#fcdb32]" />
                        <span className="text-slate-300 font-medium text-sm">
                          Elevator Pitch
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {project.elevatorPitch}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-700/50 pt-6">
                <div className="flex flex-wrap gap-3">
                  {isOwner && (
                    <Button
                      onClick={() => navigate(`/edit-project/${project._id}`)}
                      className="bg-transparent border-2 border-[#fcdb32] text-[#fcdb32] hover:bg-[#fcdb32] hover:text-[#141d38] px-6 py-2 rounded-xl transition-all duration-200 font-semibold text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                  )}
                  {!isOwner && project.creatorId !== user?.id && (
                    <Button
                      className="bg-[#fcdb32] text-[#141d38] hover:bg-[#fcdb32]/90 px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-[#fcdb32]/20 text-sm"
                      onClick={() => setShowRevive(true)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Revive Project
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Community Discussion */}
          <div
            className={`flex-1 ${isMobile ? "flex flex-col h-96" : "md:w-1/2 border-l border-slate-700/50 flex flex-col"}`}
          >
            {/* Discussion Header */}
            <div
              ref={commentSectionRef}
              className={`p-4 border-b border-slate-700/50 ${isMobile ? "border-l-0" : ""} flex-shrink-0`}
            >
              <h3 className="text-lg font-bold text-white">
                Community Discussion
              </h3>
            </div>

            {/* Comment Input - Always visible after header on mobile */}
            {isMobile && (
              <div className="border-b border-slate-700/50 p-4 bg-[#141d38] flex-shrink-0">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mb-3 bg-slate-800/50 border-slate-600/30 text-white placeholder-slate-400 text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-[#34e0a1]"
                    />
                    Anonymous
                  </label>
                  <Button
                    onClick={handlePostNote}
                    disabled={!newNote.trim() || loadingNote || !isOnline}
                    className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loadingNote ? "Posting..." : !isOnline ? "Offline" : "Post"}
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List - Scrollable */}
            <div
              className={`${isMobile ? "flex-1 overflow-y-auto" : "flex-1 overflow-y-auto"} p-4 space-y-3`}
            >
              {error && (
                <InlineNetworkError error={error} />
              )}

              {notes.length > 0 ? (
                notes.slice(0, isLowEndDevice ? 10 : notes.length).map((note) => (
                  <div
                    key={note._id}
                    className={`${isLowEndDevice ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/30 border-slate-700/30'} rounded-lg p-3 border`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">
                          {note.isAnonymous
                            ? "Anonymous"
                            : note.userId?.username || "Unknown"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      {canDeleteNote(note) && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setCommentMenuOpen(
                                commentMenuOpen === note._id ? null : note._id
                              )
                            }
                            className={`text-slate-400 hover:text-white ${isLowEndDevice ? '' : 'transition-colors'}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {commentMenuOpen === note._id && (
                            <div className="absolute top-6 right-0 z-50 bg-[#141d38] border border-slate-700/40 rounded-lg shadow-lg py-1 w-32">
                              <button
                                onClick={() => {
                                  handleDeleteNote(note._id);
                                  setCommentMenuOpen(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-all text-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {note.note}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
              {isLowEndDevice && notes.length > 10 && (
                <p className="text-slate-500 text-center text-xs mt-4">
                  Showing 10 of {notes.length} comments
                </p>
              )}
            </div>

            {/* Comment Input - Desktop Bottom Only */}
            {!isMobile && (
              <div className="flex-shrink-0 border-t border-slate-700/50 p-4 bg-[#141d38]">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mb-3 bg-slate-800/50 border-slate-600/30 text-white placeholder-slate-400 text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-[#34e0a1]"
                    />
                    Anonymous
                  </label>
                  <Button
                    onClick={handlePostNote}
                    disabled={!newNote.trim() || loadingNote || !isOnline}
                    className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loadingNote ? "Posting..." : !isOnline ? "Offline" : "Post"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revive Modal */}
        {showRevive && (
          <ReviveProjectModal
            projectId={project._id}
            onClose={() => setShowRevive(false)}
            onRevived={(updatedCard) => {
              if (updatedCard) {
                setProject(updatedCard);
              }
              if (onProjectRevived) onProjectRevived();
            }}
          />
        )}
      </div>
    </div>
  );
}
