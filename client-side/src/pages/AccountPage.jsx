import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LogOut, Edit, Save, X, Upload, Camera, ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { updateUserProfile } from "../api/users";

export function AccountPage({ sidebarOpen }) {
  const navigate = useNavigate();
  const { user, logout, refreshUser, token } = useAuth();

  const [stats, setStats] = useState({
    totalProjects: 0,
    revivedProjects: 0,
    projectsRevived: 0,
    joinDate: "",
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editingUsername, setEditingUsername] = useState(user?.username || "");
  const [editingProfilePic, setEditingProfilePic] = useState(
    user?.profilepic || ""
  );
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [profilePicProgress, setProfilePicProgress] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Local user state to ensure profile picture persists
  const [localUser, setLocalUser] = useState(user);

  // Cloudinary upload function
  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      setUploadingProfilePic(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProfilePicProgress(percent);
        }
      });

      xhr.onload = () => {
        setUploadingProfilePic(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setTimeout(() => setProfilePicProgress(0), 1000);
          resolve(res.secure_url);
        } else {
          setTimeout(() => setProfilePicProgress(0), 1000);
          reject("Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploadingProfilePic(false);
        setTimeout(() => setProfilePicProgress(0), 1000);
        reject("Upload failed");
      };
      xhr.send(data);
    });
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      setEditingProfilePic(url);
    } catch (error) {
      setError("Failed to upload profile picture");
    }
  };

  const handleSaveProfile = async () => {
    if (!editingUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updates = {
        username: editingUsername.trim(),
        ...(editingProfilePic && { profilepic: editingProfilePic }),
      };

      await updateUserProfile(user.id, updates, token);

      // Update local user state immediately with the new data
      const updatedUser = {
        ...user,
        username: editingUsername.trim(),
        ...(editingProfilePic && { profilepic: editingProfilePic }),
      };

      // Update the user in localStorage and context
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update local state immediately to show the profile picture
      setLocalUser(updatedUser);

      // Update the user context immediately to show the profile picture
      // This ensures the UI updates before the backend refresh
      await refreshUser();

      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUsername(user?.username || "");
    setEditingProfilePic(user?.profilepic || "");
    setError("");
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditingUsername(user?.username || "");
    setEditingProfilePic(user?.profilepic || "");
    setIsEditing(true);
  };

  // Update editing states when user object changes
  useEffect(() => {
    if (!isEditing) {
      setEditingUsername(user?.username || "");
      setEditingProfilePic(user?.profilepic || "");
    }
    // Update local user state when user object changes
    setLocalUser(user);
  }, [user, isEditing]);

  useEffect(() => {
    if (!user) return;

    // If user data doesn't have project info, refresh it
    if (!user.postedProjects && !user.revivedProjects) {
      refreshUser();
      return;
    }

    // Calculate stats from cached user data
    setStats({
      totalProjects: user.postedProjects?.length || 0,
      revivedProjects:
        user.postedProjects?.filter((p) => p.status === "revived")?.length || 0,
      projectsRevived: user.revivedProjects?.length || 0,
      joinDate: user.createdAt,
    });
  }, [user, refreshUser]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const badges = [
    {
      name: "Gravekeeper",
      icon: "⚰️",
      unlocked: stats.totalProjects >= 5,
      desc: "5 posted projects",
    },
    {
      name: "Necromancer",
      icon: "🪄",
      unlocked: stats.projectsRevived >= 3,
      desc: "3 revived projects",
    },
    {
      name: "Digital Ghost",
      icon: "👻",
      unlocked: stats.totalProjects >= 10,
      desc: "10 posted projects",
    },
    {
      name: "Project Phoenix",
      icon: "🔥",
      unlocked: stats.projectsRevived >= 5,
      desc: "5 revived projects",
    },
    {
      name: "Master Curator",
      icon: "🏛️",
      unlocked: stats.totalProjects >= 25,
      desc: "25 posted projects",
    },
    {
      name: "Soul Shepherd",
      icon: "🌟",
      unlocked: stats.projectsRevived >= 10,
      desc: "10 revived projects",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`min-h-screen sm:py-3 md:py-5 lg:py-7 px-4 pb-24 transition-all duration-300 ${sidebarOpen ? 'md:ml-20' : 'md:ml-0'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-50 w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
      >
        <ArrowLeft className="w-4 h-4 text-slate-300 hover:text-[#34e0a1] transition-colors" />
      </button>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
              My Account
            </h1>
            <p className="text-slate-400">Manage your graveyard profile</p>
          </div>
          <Button
            onClick={() => setShowLogoutDialog(true)}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Section */}
        <div className="px-4 mb-6 md:mb-8">
          <div className="bg-slate-800/30 rounded-xl p-4 md:p-8 border border-slate-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-zasline text-xl text-[#34e0a1]">
                Profile Information
              </h3>
              {!isEditing && (
                <Button
                  onClick={startEditing}
                  variant="outline"
                  size="sm"
                  className="border-[#34e0a1]/30 text-[#34e0a1] hover:bg-[#34e0a1]/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-700/50 flex items-center justify-center overflow-hidden">
                  {isEditing && editingProfilePic ? (
                    <img
                      src={editingProfilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : localUser?.profilepic ? (
                    <img
                      src={localUser.profilepic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="text-2xl md:text-3xl"
                    style={{
                      display:
                        (!isEditing || !editingProfilePic) &&
                        !localUser?.profilepic
                          ? "flex"
                          : "none",
                    }}
                  >
                    👤
                  </div>
                </div>

                {isEditing && (
                  <div className="absolute -bottom-1 -right-1">
                    <label className="cursor-pointer">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-[#34e0a1] rounded-full flex items-center justify-center hover:bg-[#34e0a1]/80 transition-colors">
                        {uploadingProfilePic ? (
                          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                        disabled={uploadingProfilePic}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Username
                      </label>
                      <Input
                        value={editingUsername}
                        onChange={(e) => setEditingUsername(e.target.value)}
                        className="bg-slate-700/50 border-slate-600/30 text-white"
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-[#34e0a1] hover:bg-[#34e0a1]/80 text-black"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="border-slate-600/30 text-slate-400 hover:bg-slate-700/50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-zasline text-2xl md:text-4xl text-slate-200 mb-1 md:mb-2">
                      {localUser?.username || user?.username}
                    </h2>
                    <p className="text-slate-400 mb-2 md:mb-4 text-sm md:text-base">
                      {localUser?.email || user?.email}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm">
                      Joined{" "}
                      {localUser?.createdAt || user?.createdAt
                        ? new Date(
                            localUser?.createdAt || user?.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 mb-6 md:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="bg-slate-800/30 rounded-lg p-3 md:p-6 text-center hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/30">
              <div className="text-xl md:text-2xl mb-1 md:mb-2">⚰️</div>
              <div className="text-lg md:text-2xl font-bold text-[#34e0a1] mb-1">
                {stats.totalProjects}
              </div>
              <div className="text-slate-400 text-xs md:text-sm">
                Projects I Buried
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-6 text-center hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/30">
              <div className="text-2xl mb-2">🪄</div>
              <div className="text-2xl font-bold text-[#34e0a1] mb-1">
                {stats.projectsRevived}
              </div>
              <div className="text-slate-400 text-sm">Projects I Revived</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-6 text-center hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/30">
              <div className="text-2xl mb-2">❤️</div>
              <div className="text-2xl font-bold text-[#34e0a1] mb-1">
                {stats.revivedProjects}
              </div>
              <div className="text-slate-400 text-sm">My Projects Revived</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-6 text-center hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/30">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-[#34e0a1] mb-1">
                {badges.filter((a) => a.unlocked).length}
              </div>
              <div className="text-slate-400 text-sm">Achievements</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4">
          <div className="bg-slate-800/30 rounded-xl p-4 md:p-8 border border-slate-700/30">
            <h3 className="font-zasline text-xl md:text-2xl text-[#34e0a1] mb-4 md:mb-6 text-center">
              🏆 Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`flex flex-col items-center p-2 md:p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 ${
                    b.unlocked ? "border-[#34e0a1]/30" : "opacity-50"
                  }`}
                >
                  <span className="text-2xl md:text-3xl mb-1 md:mb-2">
                    {b.icon}
                  </span>
                  <span className="font-bold text-slate-200 text-sm md:text-base">
                    {b.name}
                  </span>
                  <span className="text-xs text-slate-400">{b.desc}</span>
                  {!b.unlocked && (
                    <span className="text-xs text-yellow-400 mt-1">
                      {b.name === "Gravekeeper"
                        ? `${5 - stats.totalProjects} to go`
                        : b.name === "Necromancer"
                          ? `${3 - stats.projectsRevived} to go`
                          : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        title="Confirm Logout"
        message="Are you sure you want to leave the graveyard? You'll need to sign in again to access your account."
      />
    </div>
  );
}
