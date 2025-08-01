import { useState } from "react";

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
import { ProjectFormModal } from "./components/ProjectFormModal";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

function AppContent() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const location = useLocation();

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  const openProjectForm = (project = null) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const closeProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  // Determine if we should show bottom nav based on current route
  const showBottomNav = ["/dashboard", "/browse", "/account"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-[#141d38] text-slate-200 dark">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                onOpenProject={openProjectModal}
                onOpenForm={openProjectForm}
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
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route - redirects any unmatched routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBottomNav && <BottomNav onOpenForm={openProjectForm} />}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={closeProjectModal}
          onEdit={openProjectForm}
          isOwner={selectedProject.isOwner}
        />
      )}

      {showProjectForm && (
        <ProjectFormModal
          project={editingProject}
          onClose={closeProjectForm}
          onSave={closeProjectForm}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
