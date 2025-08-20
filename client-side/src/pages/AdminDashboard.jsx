import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllUsers, deleteUser, getAdminStats } from "../api/admin";
import { getGhostCards, deleteGhostCard } from "../api/ghostcards";
import { Trash2, Users, FolderOpen, TrendingUp, AlertTriangle } from "lucide-react";

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") return;
    
    const fetchData = async () => {
      try {
        const [usersData, projectsData, statsData] = await Promise.all([
          getAllUsers(token),
          getGhostCards(token),
          getAdminStats(token).catch(() => ({})) // Fallback if endpoint doesn't exist
        ]);
        setUsers(usersData);
        setProjects(projectsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId, token);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteGhostCard(projectId, token);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
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

  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalRevivals = projects.reduce((sum, p) => sum + (p.revivedBy?.length || 0), 0);
  const activeUsers = users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="min-h-screen pb-20 px-6 pt-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-gothic text-[#34e0a1] mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
            { id: "projects", label: "Projects", icon: FolderOpen }
          ].map(tab => (
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
                    <p className="text-2xl font-bold text-[#34e0a1]">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">{totalProjects}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Revivals</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">{totalRevivals}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Users (30d)</p>
                    <p className="text-2xl font-bold text-[#34e0a1]">{activeUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#34e0a1]" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#34e0a1] mb-4">Recent Projects</h3>
              <div className="space-y-3">
                {projects.slice(0, 5).map(project => (
                  <div key={project._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-slate-400">by {project.username || "Unknown"}</p>
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
            <h3 className="text-xl font-bold text-[#34e0a1] mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-slate-300">Username</th>
                    <th className="text-left py-3 px-4 text-slate-300">Email</th>
                    <th className="text-left py-3 px-4 text-slate-300">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-300">Projects</th>
                    <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-slate-700/50">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4 text-slate-400">{user.email}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {projects.filter(p => p.creatorId === user._id).length}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
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

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="glass rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#34e0a1] mb-4">Project Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-slate-300">Title</th>
                    <th className="text-left py-3 px-4 text-slate-300">Creator</th>
                    <th className="text-left py-3 px-4 text-slate-300">Created</th>
                    <th className="text-left py-3 px-4 text-slate-300">Revivals</th>
                    <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id} className="border-b border-slate-700/50">
                      <td className="py-3 px-4">{project.title}</td>
                      <td className="py-3 px-4 text-slate-400">{project.username || "Unknown"}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {project.revivedBy?.length || 0}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProject(project._id)}
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
    </div>
  );
}