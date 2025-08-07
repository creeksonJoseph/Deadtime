import { useState } from "react";
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

function AppContent() {
  const { token } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' or 'edit'
  const [editingProject, setEditingProject] = useState(null);
  const location = useLocation();
  const isBigScreen = useIsBigScreen();

  // Project Details Modal
  const openProjectModal = (project) => setSelectedProject(project);
  const closeProjectModal = () => setSelectedProject(null);

  // Add / Edit Project Modals
  const openAddModal = () => {
    setModalMode("add");
    setEditingProject(null);
  };
  const openEditModal = (project) => {
    setModalMode("edit");
    setEditingProject(project);
  };
  const closeFormModal = () => {
    setModalMode(null);
    setEditingProject(null);
  };

  const showBottomNav = ["/dashboard", "/browse", "/account"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-[#141d38] text-slate-200 dark overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                onOpenProject={openProjectModal}
                onOpenForm={openAddModal}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseProjects onOpenProject={openProjectModal} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graveyard"
          element={
            <ProtectedRoute>
              <BrowseProjects onOpenProject={openProjectModal} />
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
          token={token} // <-- Pass token here
          onClose={closeProjectModal}
          onEdit={openEditModal}
          isOwner={selectedProject.isOwner}
        />
      )}

      {modalMode === "add" && (
        <AddProjectModal onClose={closeFormModal} onSave={closeFormModal} />
      )}
      {modalMode === "edit" && editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={closeFormModal}
          onSave={closeFormModal}
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
