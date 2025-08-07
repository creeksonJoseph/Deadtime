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
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { BrowseProjects } from "./components/BrowseProjects";
import { AccountPage } from "./components/AccountPage";
import { BottomNav } from "./components/BottomNav.jsx";
import { ProjectModal } from "./components/ProjectModal";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useIsBigScreen } from "./components/UseIsBigScreen";
import { PortalNav } from "./components/PortalNav";
import { EditProjectModal } from "./components/EditProjectModal.jsx";
import { AddProjectModal } from "./components/AddProjectModal.jsx";
import GithubCallback from "./components/GithubCallback";
import { Leaderboard } from "./components/Leaderboard";
import { Header } from "./components/Header";

function AppContent() {
  const { user, token } = useAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' or 'edit'
  const [editingProject, setEditingProject] = useState(null);
  const location = useLocation();
  const isBigScreen = useIsBigScreen();

  useEffect(() => {
    if (token) {
      getGhostCards(token).then(setAllProjects);
    }
  }, [token]);

  const handleAddProject = (newProject) => {
    setAllProjects((prev) => [newProject, ...prev]);
    setModalMode(null);
    setEditingProject(null);
  };

  const handleEditProject = (updatedProject) => {
    setAllProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
    setModalMode(null);
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
      console.error("Failed to delete project", err);
    }
  };

  const myProjects = user
    ? allProjects.filter((p) => p.creatorId === user.id)
    : [];
  const otherProjects = user
    ? allProjects.filter((p) => p.creatorId !== user.id)
    : [];

  const showBottomNav = ["/dashboard", "/browse", "/account"].includes(
    location.pathname
  );
  const showHeader = ["/dashboard", "/browse", "/account", "/graveyard", "/leaderboard"].includes(
    location.pathname
  );

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingProject(null);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  const closeFormModal = () => {
    setModalMode(null);
    setEditingProject(null);
  };

  const openEditModal = (project) => {
    setModalMode("edit");
    setEditingProject(project);
  };

  return (
    <div className="min-h-screen bg-[#141d38] text-slate-200 dark overflow-x-hidden pb-24">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <div className="min-h-screen py-8 px-4">
                <div className="container mx-auto max-w-2xl">
                  <h1 className="text-3xl font-bold text-[#34e0a1] mb-8 text-center">
                    Submit Dead Project
                  </h1>
                  <AddProjectModal 
                    onClose={() => window.history.back()} 
                    onSave={(project) => {
                      handleAddProject(project);
                      window.location.href = '/dashboard';
                    }}
                    standalone={true}
                  />
                </div>
              </div>
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
                onOpenForm={openAddModal}
                onDelete={handleDeleteProject}
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
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBottomNav &&
        (isBigScreen ? (
          <PortalNav onOpenForm={openAddModal} />
        ) : (
          <BottomNav onOpenForm={openAddModal} />
        ))}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          token={token}
          onClose={closeProjectModal}
          onEdit={openEditModal}
          isOwner={selectedProject.isOwner}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Modals */}
      {modalMode === "add" && (
        <AddProjectModal onClose={closeFormModal} onSave={handleAddProject} />
      )}
      {modalMode === "edit" && editingProject && (
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
