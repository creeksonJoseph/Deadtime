import { useState } from "react";
import { createGhostNote } from "../api/ghostnotes";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function AddGhostnoteModal({ projectId, onClose, onSave, token }) {
  const [note, setNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!note.trim()) {
      setError("Note cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await createGhostNote({ projectId, note, isAnonymous }, token);
      setLoading(false);
      onSave && onSave();
      onClose();
    } catch (err) {
      setLoading(false);
      setError("Failed to post note.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="flex gap-2">
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#34e0a1] text-[#141d38] neon-glow"
        >
          {loading ? "Posting..." : "Post Note"}
        </Button>
      </div>
    </form>
  );
}
