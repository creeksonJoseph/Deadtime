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

  // Only fetch if user is admin (due to backend restriction)
  useEffect(() => {
    if (user.role === "admin") {
      getNotesForProject(projectId, token)
        .then(setNotes)
        .catch(() => {});
    }
  }, [projectId, token, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createGhostNote({ projectId, note, isAnonymous }, token);
      setNote("");
      setIsAnonymous(false);
      setLoading(false);
      // Optionally refetch notes if admin
      if (user.role === "admin") {
        getNotesForProject(projectId, token).then(setNotes);
      }
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
      {user.role === "admin" && (
        <div>
          <h4 className="text-slate-400 mb-2">All Notes</h4>
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n._id} className="glass rounded-lg p-3">
                <span className="text-slate-300">{n.note}</span>
                {n.isAnonymous && (
                  <span className="ml-2 text-xs text-slate-500">
                    (anonymous)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
