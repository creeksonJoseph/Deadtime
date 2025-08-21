import { useState, useEffect } from "react";
import { getGhostCards, deleteGhostCard } from "./api/ghostcards";
import { useAuth } from "./contexts/AuthContext";

import "./styles/globals.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Dashboard } from "./pages/Dashboard";
import { BrowseProjects } from "./pages/BrowseProjects";
import { AccountPage } from "./pages/AccountPage";
import { BottomNav } from "./components/BottomNav.jsx";
import { ProjectModal } from "./components/ProjectModal";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useIsBigScreen } from "./components/UseIsBigScreen";
import { PortalNav } from "./components/PortalNav";
import { EditProjectModal } from "./components/EditProjectModal.jsx";
import { AddProjectPage } from "./pages/AddProjectPage.jsx";
import GithubCallback from "./components/GithubCallback";
import { Leaderboard } from "./pages/Leaderboard";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { Header } from "./components/Header";
import { GuestHeader } from "./components/GuestHeader";
import { GuestBrowse } from "./pages/GuestBrowse";

function AppContent() {
  const { user, token } = useAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [guestSearchVisible, setGuestSearchVisible] = useState(false);
  const [browseSearchVisible, setBrowseSearchVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isBigScreen = useIsBigScreen();

  const refetchProjects = async () => {
    if (token) {
      try {
        const projects = await getGhostCards(token);
        setAllProjects(projects);
      } catch (error) {
        // ignore
      }
    }
  };

  useEffect(() => {
    if (token) {
      getGhostCards(token).then(setAllProjects);
    }
  }, [token]);

  const handleAddProject = (newProject) => {
    setAllProjects((prev) => [newProject, ...prev]);
    setEditingProject(null);
  };

  const handleEditProject = (updatedProject) => {
    setAllProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
    setEditingProject(null);
  };

  // DELETE ONLY
  const handleDeleteProject = async (project) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This cannot be undone."
      )
    )
      return;
    try {
      await deleteGhostCard(project._id, token);
      setAllProjects((prev) => prev.filter((p) => p._id !== project._id));
      setSelectedProject(null);
    } catch (err) {
      // ignore
    }
  };

  const myProjects = user
    ? allProjects.filter((p) => p.creatorId === user.id)
    : [];
  const otherProjects = user
    ? allProjects.filter((p) => p.creatorId !== user.id)
    : [];

  const showBottomNav = [
    "/dashboard",
    "/browse",
    "/account",
    "/admin",
    "/add-project",
    "/leaderboard",
    "/notifications",
  ].includes(location.pathname) || location.pathname.startsWith("/project/");
  const showHeader = [
    "/dashboard",
    "/browse",
    "/account",
    "/graveyard",
    "/leaderboard",
    "/notifications",
    "/admin",
    "/add-project",
  ].includes(location.pathname) || location.pathname.startsWith("/project/");
  const showGuestHeader = location.pathname === "/guest-browse";

  const openProjectModal = (project) => {
    // Navigate to project details page instead of modal
    window.location.href = `/project/${project._id}`;
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  const closeFormModal = () => {
    setEditingProject(null);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
  };

  return (
    <div className="min-h-screen bg-[#141d38] text-slate-200 dark overflow-x-hidden pb-24 pt-16">
      {showHeader && (
        <Header
          onSearchToggle={() => setBrowseSearchVisible(!browseSearchVisible)}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showSearchButton={true}
        />
      )}
      {showGuestHeader && (
        <GuestHeader
          onSearchToggle={() => setGuestSearchVisible(!guestSearchVisible)}
          showSearchButton={true}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/guest-browse"
          element={<GuestBrowse searchVisible={guestSearchVisible} />}
        />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route
          path="/add-project"
          element={
            <ProtectedRoute>
              <AddProjectPage onProjectCreated={refetchProjects} sidebarOpen={sidebarOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                projects={myProjects}
                onOpenProject={openProjectModal}
                onDelete={handleDeleteProject}
                sidebarOpen={sidebarOpen}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseProjects
                projects={otherProjects}
                token={token}
                onOpenProject={openProjectModal}
                onDelete={handleDeleteProject}
                currentUserId={user?.id}
                onProjectRevived={refetchProjects}
                searchVisible={browseSearchVisible}
                sidebarOpen={sidebarOpen}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graveyard"
          element={
            <ProtectedRoute>
              <BrowseProjects
                projects={allProjects}
                token={token}
                onOpenProject={openProjectModal}
                onDelete={handleDeleteProject}
                currentUserId={user?.id}
                onProjectRevived={refetchProjects}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage sidebarOpen={sidebarOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard sidebarOpen={sidebarOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage sidebarOpen={sidebarOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard sidebarOpen={sidebarOpen} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage
                onEdit={openEditModal}
                onDelete={handleDeleteProject}
                onProjectRevived={refetchProjects}
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBottomNav &&
        (isBigScreen ? (
          <PortalNav
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
          <BottomNav />
        ))}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          token={token}
          onClose={closeProjectModal}
          onEdit={openEditModal}
          isOwner={selectedProject.isOwner}
          onDelete={handleDeleteProject}
          onProjectRevived={refetchProjects}
        />
      )}

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={closeFormModal}
          onSave={handleEditProject}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
