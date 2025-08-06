import { useState } from "react";
import { reviveProject } from "../api/revive";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../contexts/AuthContext";

export function ReviveProjectModal({ projectId, onClose, onRevived }) {
  const [notes, setNotes] = useState("");
  const [newProjectLink, setNewProjectLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await reviveProject(projectId, notes, newProjectLink, token);
      setLoading(false);
      onRevived();
      onClose();
    } catch (err) {
      setLoading(false);
      setError("Failed to revive project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How will you revive this project?"
        required
      />
      <Input
        value={newProjectLink}
        onChange={(e) => setNewProjectLink(e.target.value)}
        placeholder="Link to your version (optional)"
      />
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
          {loading ? "Reviving..." : "Revive & Submit"}
        </Button>
      </div>
    </form>
  );
}
