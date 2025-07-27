import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import EditProjectPage from "./pages/EditProjectPage";
import Graveyard from "./pages/Graveyard";

export const API = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/submit"
          element={user ? <AddProject user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route
          path="/project/:id/edit"
          element={
            user ? <EditProjectPage user={user} /> : <Navigate to="/login" />
          }
        />
        <Route path="graveyard" element={<Graveyard />} />
      </Routes>
    </Router>
  );
}

export default App;
