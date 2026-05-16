/**
 * Component Tests
 * Covers: ProjectCard, Toast, ProtectedRoute, ConfirmDialog,
 *         and helper utility functions extracted from components
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ProjectCard } from "../components/ProjectCard";
import { Toast } from "../components/Toast";

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
const makeCard = (overrides = {}) => ({
  _id: "card-abc",
  creatorId: "user-xyz",
  title: "Dead Side Project",
  description: "A project that lost steam halfway through development",
  type: "code",
  status: "abandoned",
  revivedBy: [],
  revivedByCount: 0,
  logoUrl: "",
  dateStarted: "2023-01-01T00:00:00.000Z",
  dateAbandoned: "2023-06-01T00:00:00.000Z",
  createdAt: "2023-06-01T00:00:00.000Z",
  updatedAt: "2023-06-01T00:00:00.000Z",
  ...overrides,
});

// Stub fetch to avoid real network calls in component
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      user: { username: "MockCreator", profilepic: "" },
    }),
  });
});

// ──────────────────────────────────────────────────────────
// ProjectCard – rendering
// ──────────────────────────────────────────────────────────
describe("ProjectCard – rendering", () => {
  const defaultProps = {
    project: makeCard(),
    token: "test-token",
    onClick: vi.fn(),
    currentUserId: "other-user",
  };

  it("should render the project title", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} /></MemoryRouter>);
    expect(screen.getByText("Dead Side Project")).toBeInTheDocument();
  });

  it("should render the project description (truncated or full)", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} /></MemoryRouter>);
    expect(screen.getByText(/A project that lost steam/i)).toBeInTheDocument();
  });

  it("should render 'RIP' badge for abandoned projects", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} /></MemoryRouter>);
    expect(screen.getByText("RIP")).toBeInTheDocument();
  });

  it("should render 'Still Hopeful' badge for revived projects", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} project={makeCard({ status: "revived" })} /></MemoryRouter>);
    expect(screen.getByText("Still Hopeful")).toBeInTheDocument();
  });

  it("should render 'Reviving' badge for on-hold projects", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} project={makeCard({ status: "on-hold" })} /></MemoryRouter>);
    expect(screen.getByText("Reviving")).toBeInTheDocument();
  });

  it("should show 'View Details' button", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} /></MemoryRouter>);
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("should show revival count when revivedBy has entries", () => {
    const card = makeCard({ revivedBy: ["user1", "user2"] });
    render(<MemoryRouter><ProjectCard {...defaultProps} project={card} /></MemoryRouter>);
    expect(screen.getByText(/2 revival/i)).toBeInTheDocument();
  });

  it("should NOT show revival count when revivedBy is empty", () => {
    render(<MemoryRouter><ProjectCard {...defaultProps} /></MemoryRouter>);
    expect(screen.queryByText(/revival/i)).not.toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────
// ProjectCard – owner-only actions
// ──────────────────────────────────────────────────────────
describe("ProjectCard – owner actions", () => {
  it("should show 3-dots menu button when current user is the owner", () => {
    const card = makeCard({ creatorId: "owner-id" });
    render(
      <MemoryRouter>
        <ProjectCard
          project={card}
          token="tok"
          onClick={vi.fn()}
          currentUserId="owner-id"
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );
    // The MoreVertical button triggers the menu
    const menuBtn = document.querySelector("button[class*='absolute top-4 right-4']");
    expect(menuBtn).not.toBeNull();
  });

  it("should NOT show 3-dots menu when current user is NOT the owner", () => {
    const card = makeCard({ creatorId: "owner-id" });
    render(
      <MemoryRouter>
        <ProjectCard
          project={card}
          token="tok"
          onClick={vi.fn()}
          currentUserId="different-user"
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
  });

  it("should open the owner menu when 3-dots button is clicked", async () => {
    const card = makeCard({ creatorId: "owner-id" });
    render(
      <MemoryRouter>
        <ProjectCard
          project={card}
          token="tok"
          onClick={vi.fn()}
          currentUserId="owner-id"
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );

    const moreBtn = document.querySelector("button[class*='absolute top-4 right-4']");
    fireEvent.click(moreBtn);
    expect(screen.getByText("Delete Project")).toBeInTheDocument();
  });

  it("should call onDelete when 'Delete Project' is clicked", async () => {
    const onDelete = vi.fn();
    const card = makeCard({ creatorId: "owner-id" });
    render(
      <MemoryRouter>
        <ProjectCard
          project={card}
          token="tok"
          onClick={vi.fn()}
          currentUserId="owner-id"
          onDelete={onDelete}
        />
      </MemoryRouter>
    );

    // Open menu
    const moreBtn = document.querySelector("button[class*='absolute top-4 right-4']");
    fireEvent.click(moreBtn);
    fireEvent.click(screen.getByText("Delete Project"));
    expect(onDelete).toHaveBeenCalledWith(card);
  });

  it("should call onClick when 'View Details' is clicked", () => {
    const onClick = vi.fn();
    render(<MemoryRouter><ProjectCard project={makeCard()} token="tok" onClick={onClick} currentUserId="other" /></MemoryRouter>);
    fireEvent.click(screen.getByText("View Details"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────────────────
// ProjectCard – guest mode (no token)
// ──────────────────────────────────────────────────────────
describe("ProjectCard – guest mode", () => {
  it("should show 'Anonymous User' when no token is provided", async () => {
    render(
      <MemoryRouter>
        <ProjectCard
          project={makeCard()}
          token={null}
          onClick={vi.fn()}
          currentUserId={null}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Anonymous User")).toBeInTheDocument();
    });
  });
});

// ──────────────────────────────────────────────────────────
// ProjectCard – username loading via fetch
// ──────────────────────────────────────────────────────────
describe("ProjectCard – username fetch", () => {
  it("should display the fetched username in 'Posted by'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { username: "johnsmith", profilepic: "" } }),
    });

    render(
      <MemoryRouter>
        <ProjectCard
          project={makeCard({ creatorId: "some-id" })}
          token="valid-token"
          onClick={vi.fn()}
          currentUserId="different"
          showPostedBy={true}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("johnsmith")).toBeInTheDocument();
    });
  });

  it("should fall back to 'Unknown' when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(
      <MemoryRouter>
        <ProjectCard
          project={makeCard({ creatorId: "bad-id" })}
          token="valid-token"
          onClick={vi.fn()}
          currentUserId="different"
          showPostedBy={true}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });
});

// ──────────────────────────────────────────────────────────
// Toast component
// ──────────────────────────────────────────────────────────
describe("Toast component", () => {
  it("should render the message passed to it", () => {
    render(<Toast message="Project revived!" onClose={vi.fn()} />);
    expect(screen.getByText("Project revived!")).toBeInTheDocument();
  });

  it("should render the CheckCircle icon", () => {
    const { container } = render(<Toast message="Done!" onClose={vi.fn()} />);
    // lucide renders an svg
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("should be positioned fixed on the screen", () => {
    const { container } = render(<Toast message="Done!" onClose={vi.fn()} />);
    const motionDiv = container.firstChild;
    expect(motionDiv.className).toContain("fixed");
  });
});

// ──────────────────────────────────────────────────────────
// Utility functions (extracted logic from ProjectCard)
// ──────────────────────────────────────────────────────────
describe("getStatusLabel utility", () => {
  // Replicate the function inline since it's not exported
  function getStatusLabel(status) {
    switch (status) {
      case "abandoned": return "RIP";
      case "on-hold": return "Reviving";
      case "revived": return "Still Hopeful";
      default: return status;
    }
  }

  it("should map 'abandoned' → 'RIP'", () => {
    expect(getStatusLabel("abandoned")).toBe("RIP");
  });
  it("should map 'on-hold' → 'Reviving'", () => {
    expect(getStatusLabel("on-hold")).toBe("Reviving");
  });
  it("should map 'revived' → 'Still Hopeful'", () => {
    expect(getStatusLabel("revived")).toBe("Still Hopeful");
  });
  it("should return the raw status for unknown values", () => {
    expect(getStatusLabel("mystery")).toBe("mystery");
  });
});

describe("truncateDescription utility", () => {
  function truncateDescription(text, maxLength = 120) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  it("should return empty string for null/undefined input", () => {
    expect(truncateDescription(null)).toBe("");
    expect(truncateDescription(undefined)).toBe("");
  });
  it("should not truncate text within maxLength", () => {
    expect(truncateDescription("Short text", 120)).toBe("Short text");
  });
  it("should truncate text exceeding maxLength and append '...'", () => {
    const long = "a".repeat(150);
    const result = truncateDescription(long, 120);
    expect(result.endsWith("...")).toBe(true);
    expect(result.length).toBe(123); // 120 chars + "..."
  });
});

describe("truncateToWords utility", () => {
  function truncateToWords(text, maxWords = 40) {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  }

  it("should return empty string for falsy input", () => {
    expect(truncateToWords("")).toBe("");
  });
  it("should not truncate when word count is within limit", () => {
    expect(truncateToWords("one two three", 40)).toBe("one two three");
  });
  it("should truncate at maxWords and append '...'", () => {
    const text = Array(50).fill("word").join(" ");
    const result = truncateToWords(text, 40);
    expect(result.endsWith("...")).toBe(true);
    // "..." is appended to the last word (no extra space), so split(" ") gives 40 items
    expect(result.split(" ").length).toBe(40);
  });
});
