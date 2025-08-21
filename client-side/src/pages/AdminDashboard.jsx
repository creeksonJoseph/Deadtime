import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllUsers, deleteUser } from "../api/admin";
import { getGhostCards, deleteGhostCard } from "../api/ghostcards";
import {
  Trash2,
  Users,
  FolderOpen,
  TrendingUp,
  AlertTriangle,
  X,
  Search,
} from "lucide-react";

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsWithUsernames, setProjectsWithUsernames] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    project: null,
  });
  const [userSearch, setUserSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  // Admin check
  const isAdmin =
    user?.role === "admin" || user?.email === "charanajoseph@gmail.com";

  useEffect(() => {
    if (!isAdmin || !token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Since admin endpoints are failing, use regular endpoints
        const projectsData = await getGhostCards(token);

        // Create mock users data from projects for now
        const usersData = [];
        setUsers(usersData); // Empty for now
        setProjects(projectsData);

        // Resolve usernames for projects
        const projectsWithNames = await Promise.all(
          projectsData.map(async (project) => {
            try {
              const userRes = await fetch(
                `https://deadtime.onrender.com/api/users/${project.creatorId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (userRes.ok) {
                const userData = await userRes.json();
                return {
                  ...project,
                  creatorUsername: userData.user?.username || "Unknown",
                };
              }
            } catch (error) {
              // ignore
            }
            return { ...project, creatorUsername: "Unknown" };
          })
        );
        setProjectsWithUsernames(projectsWithNames);
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, isAdmin]);

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId, token);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      // ignore
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteGhostCard(projectId, token);
      setProjects(projects.filter((p) => p._id !== projectId));
      setProjectsWithUsernames(
        projectsWithUsernames.filter((p) => p._id !== projectId)
      );
      setDeleteModal({ show: false, project: null });
    } catch (error) {
      // ignore
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-400">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#34e0a1]"></div>
      </div>
    );
  }

  const totalUsers = "N/A"; // Admin endpoint unavailable
  const totalProjects = projects.length;
  const totalRevivals = projects.reduce(
    (sum, p) => sum + (p.revivedBy?.length || 0),
    0
  );
  // Calculate unique creators from projects
  const uniqueCreators = new Set(projects.map((p) => p.creatorId)).size;
  const activeUsers = uniqueCreators; // Use unique project creators as proxy

  // Filter functions
  const filteredUsers = users.filter(
    (userObj) =>
      userObj.user?.username
        ?.toLowerCase()
        .includes(userSearch.toLowerCase()) ||
      userObj.user?.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProjects = projectsWithUsernames.filter(
    (project) =>
      project.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.creatorUsername
        ?.toLowerCase()
        .includes(projectSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 px-6 pt-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-gothic text-[#34e0a1] mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
            { id: "projects", label: "Projects", icon: FolderOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#34e0a1] text-[#141d38]"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">
                      {totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">
                      {totalProjects}
                    </p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Revivals</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">
                      {totalRevivals}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Users (30d)</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">
                      {activeUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#34e0a1] mb-4">
                Recent Projects
              </h3>
              <div className="space-y-3">
                {projectsWithUsernames.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-slate-400">
                        by {project.creatorUsername || "Unknown"}
                      </p>
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="glass rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold text-[#34e0a1]">
                User Management
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#34e0a1]"
                />
              </div>
            </div>
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-slate-400">User management unavailable</p>
              <p className="text-sm text-slate-500">
                Admin user endpoint is currently inaccessible
              </p>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="glass rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold text-[#34e0a1]">
                Project Management
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#34e0a1]"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-slate-300">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Creator
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Revivals
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project._id}
                      className="border-b border-slate-700/50"
                    >
                      <td className="py-3 px-4">{project.title}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {project.creatorUsername || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {project.revivedBy?.length || 0}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            setDeleteModal({ show: true, project })
                          }
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-400">Delete Project</h3>
              <button
                onClick={() => setDeleteModal({ show: false, project: null })}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-300 mb-2">
              Are you sure you want to delete this project?
            </p>
            <p className="text-[#34e0a1] font-medium mb-6">
              "{deleteModal.project?.title}"
            </p>
            <p className="text-sm text-slate-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, project: null })}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteModal.project._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
