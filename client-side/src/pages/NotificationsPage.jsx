import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllRevivalLogs } from "../api/revivalLogs";
import { getCommentsForProject } from "../api/comments";
import { Heart, ExternalLink, X, Calendar, User, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotificationsPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [revivals, setRevivals] = useState([]);
  const [comments, setComments] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevival, setSelectedRevival] = useState(null);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch user's projects
        const projectsRes = await fetch("https://deadtime.onrender.com/api/ghostcards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allProjects = await projectsRes.json();
        const myProjects = allProjects.filter(p => p.creatorId === user?.id);
        setUserProjects(myProjects);

        // Fetch revivals
        const allRevivals = await getAllRevivalLogs(token);
        const myProjectRevivals = allRevivals.filter(revival => 
          revival.projectId?.creatorId === user?.id && 
          revival.userId?._id !== user?.id
        );
        setRevivals(myProjectRevivals);

        // Fetch comments on user's projects
        const allComments = [];
        for (const project of myProjects) {
          try {
            const projectComments = await getCommentsForProject(project._id, token);
            const othersComments = projectComments.filter(comment => {
              const isOtherUser = comment.userId?._id !== user?.id;
              const isNotAnonymous = !comment.isAnonymous;
              return isOtherUser && isNotAnonymous;
            });
            allComments.push(...othersComments.map(comment => ({
              ...comment,
              projectTitle: project.title,
              projectId: project._id
            })));
          } catch (error) {
            // ignore
          }
        }
        setComments(allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, user?.id]);

  const handleRevivalClick = (revival) => {
    setSelectedRevival(revival);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-[#34e0a1] animate-pulse" />
          <p className="text-slate-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 pb-24">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-400 hover:text-[#34e0a1] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-gothic text-[#34e0a1] mb-2">
            Notifications
          </h1>
          <p className="text-slate-400">
            See who has revived or commented on your projects
          </p>
        </div>

        {revivals.length === 0 && comments.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">No Notifications Yet</h3>
            <p className="text-slate-400">
              No one has revived or commented on your projects yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Revival Notifications */}
            {revivals.map((revival) => (
              <div
                key={`revival-${revival._id}`}
                className="glass rounded-lg p-6 hover:bg-slate-800/40 transition-all border border-slate-700/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#34e0a1]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#34e0a1]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">
                        {revival.userId?.username || "Unknown User"}
                      </span>
                      <span className="text-slate-400">revived</span>
                      <span className="font-semibold text-[#34e0a1]">
                        {revival.projectId?.title || "Unknown Project"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">
                      {revival.notes ? revival.notes.substring(0, 100) + "..." : "No notes provided"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(revival.revivedAt)}
                        </div>
                        {revival.newProjectLink && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            New version available
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleRevivalClick(revival)}
                        className="bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] text-xs px-3 py-1"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Comment Notifications */}
            {comments.map((comment) => (
              <div
                key={`comment-${comment._id}`}
                className="glass rounded-lg p-6 hover:bg-slate-800/40 transition-all cursor-pointer border border-slate-700/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">
                        {comment.userId?.username || "Unknown User"}
                      </span>
                      <span className="text-slate-400">commented on</span>
                      <span className="font-semibold text-blue-400">
                        {comment.projectTitle}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">
                      "{comment.note.substring(0, 100)}{comment.note.length > 100 ? '...' : ''}"
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Revival Details Modal */}
        {selectedRevival && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedRevival(null)}
            />
            <div className="relative bg-[#141d38] rounded-2xl p-8 border border-slate-600/30 shadow-2xl max-w-2xl w-full mx-4">
              <button
                onClick={() => setSelectedRevival(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#34e0a1]/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#34e0a1]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Project Revival</h2>
                      <p className="text-slate-400">Revival details and plans</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Project
                        </h4>
                        <p className="text-white font-semibold">
                          {selectedRevival.projectId?.title}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          {selectedRevival.projectId?.type} project
                        </p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Revived By
                        </h4>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#34e0a1]" />
                          <p className="text-white font-semibold">
                            {selectedRevival.userId?.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                        Revival Date
                      </h4>
                      <p className="text-white">{formatDate(selectedRevival.revivedAt)}</p>
                    </div>

                    {selectedRevival.notes && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          Revival Plans
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedRevival.notes}
                        </p>
                      </div>
                    )}

                    {selectedRevival.newProjectLink && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                          New Project Link
                        </h4>
                        <a
                          href={selectedRevival.newProjectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#34e0a1] hover:text-[#34e0a1]/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Revived Project
                        </a>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}