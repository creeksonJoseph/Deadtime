import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Skull,
  GitBranch,
  Youtube,
  Briefcase,
  Plus,
  X,
  Calendar,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { updateGhostCard, getGhostCardById } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";

export function EditProjectPage({ onProjectUpdated, sidebarOpen }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { token, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logoUrl: "",
    status: "abandoned",
    type: "code",
    externalLink: "",
    abandonmentReason: "",
    dateStarted: "",
    dateAbandoned: "",
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const logoInputRef = useRef(null);

  const projectTypes = [
    {
      value: "code",
      label: "Coding Project",
      icon: GitBranch,
      description: "Apps, websites, libraries, or any code repository",
    },
    {
      value: "business",
      label: "Business Idea",
      icon: Briefcase,
      description: "Startup concepts, business plans, or market opportunities",
    },
    {
      value: "content",
      label: "Content Project",
      icon: Youtube,
      description: "YouTube channels, blogs, podcasts, or creative content",
    },
    {
      value: "other",
      label: "Other",
      icon: Plus,
      description: "Any other type of abandoned project",
    },
  ];

  // Load existing project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getGhostCardById(projectId, token);
        setFormData({
          title: project.title || "",
          description: project.description || "",
          logoUrl: project.logoUrl || "",
          status: project.status || "abandoned",
          type: project.type || "code",
          externalLink: project.externalLink || "",
          abandonmentReason: project.abandonmentReason || "",
          dateStarted: project.dateStarted ? project.dateStarted.split('T')[0] : "",
          dateAbandoned: project.dateAbandoned ? project.dateAbandoned.split('T')[0] : "",

        });
      } catch (err) {
        setError("Failed to load project data");
      } finally {
        setInitialLoading(false);
      }
    };

    if (projectId && token) {
      loadProject();
    }
  }, [projectId, token]);

  const uploadToCloudinary = (
    file,
    resourceType,
    setProgress,
    setUploading
  ) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/${resourceType}/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      });

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setTimeout(() => setProgress(0), 1000);
          const url = res.secure_url;
          resolve(url);
        } else {
          setTimeout(() => setProgress(0), 1000);
          reject("Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setTimeout(() => setProgress(0), 1000);
        reject("Upload failed");
      };
      xhr.send(data);
    });
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    try {
      const url = await uploadToCloudinary(
        file,
        "image",
        setLogoProgress,
        setUploadingLogo
      );
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    } catch (error) {
      setError("Failed to upload logo");
    }
  };

  const handleDeleteLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.logoUrl.trim()) return "Project logo is required";
    if (!formData.abandonmentReason.trim()) return "Cause of Death is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await updateGhostCard(projectId, formData, token);
      await refreshUser();
      if (onProjectUpdated) await onProjectUpdated();
      setLoading(false);
      navigate(-1);
    } catch (err) {
      setLoading(false);
      setError("Failed to update project");
    }
  };

  if (initialLoading) {
    return (
      <div className={`min-h-screen mt-0 pt-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-20' : 'md:ml-0'} flex items-center justify-center`}>
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 text-[#34e0a1] animate-pulse" />
          <p className="text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen mt-0 pt-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-20' : 'md:ml-0'}`}>
      {/* Exit Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-8 z-50 w-12 h-12 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
      >
        <ArrowLeft className="w-6 h-6 text-slate-300 hover:text-[#34e0a1] transition-colors" />
      </button>

      {/* Header - Fixed at top */}
      <div className="text-center py-3 md:py-4 px-4">
        <Skull className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-[#34e0a1] animate-pulse" />
        <h1 className="text-3xl md:text-5xl font-gothic text-[#34e0a1] mb-3 md:mb-4">
          Edit Your Project
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
          Update your project's digital burial record. Make changes to help others understand your creation.
        </p>
      </div>

      {/* Form - Full width landscape */}
      <div className="px-4 pb-6 md:pb-8">
        <div className="w-full max-w-none">
          <Card className="tombstone-card p-4 md:p-8 mx-auto max-w-7xl">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Project Name *
                </Label>
                <Input
                  id="title"
                  placeholder="What was your project called?"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* Project Type */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">
                  Project Type *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange("type", type.value)}
                        className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
                          formData.type === type.value
                            ? "border-[#34e0a1] bg-[#34e0a1]/10 text-[#34e0a1]"
                            : "border-border hover:border-[#34e0a1]/50"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1 md:mb-2">
                          <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          <span className="font-medium text-sm md:text-base">
                            {type.label}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* External Link */}
              <div className="space-y-2">
                <Label
                  htmlFor="externalLink"
                  className="text-foreground font-medium"
                >
                  Project Link (Optional)
                </Label>
                <Input
                  id="externalLink"
                  placeholder="GitHub, YouTube, website, etc."
                  value={formData.externalLink}
                  onChange={(e) =>
                    handleInputChange("externalLink", e.target.value)
                  }
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Share a link so others can see what you were building
                </p>
              </div>

              {/* Date Started */}
              <div className="space-y-2">
                <Label
                  htmlFor="dateStarted"
                  className="text-foreground font-medium"
                >
                  When Did You Start? (Optional)
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dateStarted"
                    type="date"
                    value={formData.dateStarted}
                    onChange={(e) =>
                      handleInputChange("dateStarted", e.target.value)
                    }
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              {/* Date Abandoned */}
              <div className="space-y-2">
                <Label
                  htmlFor="dateAbandoned"
                  className="text-foreground font-medium"
                >
                  Date Abandoned (Optional)
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dateAbandoned"
                    type="date"
                    value={formData.dateAbandoned}
                    onChange={(e) =>
                      handleInputChange("dateAbandoned", e.target.value)
                    }
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-foreground font-medium"
                >
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="What were you building? What features did you plan? What was your vision?"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="bg-background/50"
                />
              </div>

              {/* Abandonment Reason */}
              <div className="space-y-2">
                <Label
                  htmlFor="abandonmentReason"
                  className="text-foreground font-medium"
                >
                  Cause of Death *
                </Label>
                <Textarea
                  id="abandonmentReason"
                  placeholder="Why did you abandon this project? What killed your motivation?"
                  value={formData.abandonmentReason}
                  onChange={(e) =>
                    handleInputChange("abandonmentReason", e.target.value)
                  }
                  rows={3}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Be honest - this helps others understand what they're taking
                  on
                </p>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <Label className="text-foreground font-medium mb-2 block">
                    Project images *
                  </Label>
                  <p className="text-sm text-slate-400 mb-3">
                    Help someone visualize your project
                  </p>
                  {!formData.logoUrl ? (
                    <div className="relative">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleLogoUpload(e.target.files[0])}
                        disabled={uploadingLogo}
                      />
                      <div className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
                        <ImageIcon className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                        <p className="text-slate-300 mb-1">
                          {uploadingLogo ? "Uploading..." : "Upload image"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {uploadingLogo
                            ? "Please wait"
                            : "Click or drag & drop"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="glass rounded-lg p-4 border border-[#34e0a1]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={formData.logoUrl}
                            alt="Logo preview"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <span className="text-slate-300">image uploaded</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(formData.logoUrl, "_blank")
                            }
                            className="border-[#34e0a1]/30 text-[#34e0a1] hover:bg-[#34e0a1]/10"
                          >
                            Preview
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleDeleteLogo}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {logoProgress > 0 && (
                    <div className="glass rounded-lg overflow-hidden mt-2">
                      <div
                        className="h-1 bg-[#34e0a1]"
                        style={{ width: `${logoProgress}%` }}
                      />
                    </div>
                  )}
                </div>


              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={uploadingLogo || loading}
                  className="w-full bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-background neon-glow"
                >
                  <Skull className="w-5 h-5 mr-2" />
                  {uploadingLogo
                    ? "Uploading..."
                    : loading
                      ? "Updating Project..."
                      : "Update Project"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}