import { useEffect, useState } from "react";
import { createGhostNote, getNotesForProject } from "../api/ghostnotes";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function NotesSection({ projectId }) {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notes for all users
  useEffect(() => {
    getNotesForProject(projectId, token)
      .then(setNotes)
      .catch(() => {});
  }, [projectId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createGhostNote({ projectId, note, isAnonymous }, token);
      setNote("");
      setIsAnonymous(false);
      setLoading(false);
      // Refetch notes after posting
      getNotesForProject(projectId, token).then(setNotes);
    } catch {
      setLoading(false);
      setError("Failed to post note.");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-zasline text-xl text-[#34e0a1] mb-2">Leave a Note</h3>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Leave a note for this project..."
          required
        />
        <label className="flex items-center gap-2 text-slate-400">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Post anonymously
        </label>
        {error && <div className="text-red-400 neon-glow">{error}</div>}
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#34e0a1] text-[#141d38] neon-glow"
        >
          {loading ? "Posting..." : "Post Note"}
        </Button>
      </form>
      {notes.length > 0 ? (
        <div>
          <h4 className="text-slate-400 mb-4">Project Notes ({notes.length})</h4>
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n._id} className="glass rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {n.isAnonymous === true ? "Anonymous" : (n.userId?.username || "Gravekeeper")}
                    </span>
                    {n.isAnonymous === true && (
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">
                        🕶️ Anonymous
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300">{n.note}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-slate-500 text-center py-4">
          No notes yet. Be the first to leave a note!
        </div>
      )}
    </div>
  );
}
