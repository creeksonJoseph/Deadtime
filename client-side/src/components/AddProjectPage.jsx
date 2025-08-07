import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Skull,
  GitBranch,
  Youtube,
  Briefcase,
  Plus,
  X,
  Calendar,
  FileText,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { createGhostCard } from "../api/ghostcards";
import { useAuth } from "../contexts/AuthContext";

export function AddProjectPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

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
    pitchDeckUrl: "",
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

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
          resolve(res.secure_url);
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
    const url = await uploadToCloudinary(
      file,
      "image",
      setLogoProgress,
      setUploadingLogo
    );
    setFormData((prev) => ({ ...prev, logoUrl: url }));
  };

  const handlePdfUpload = async (file) => {
    if (!file) return;
    const url = await uploadToCloudinary(
      file,
      "raw",
      setPdfProgress,
      setUploadingPdf
    );
    setFormData((prev) => ({ ...prev, pitchDeckUrl: url }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
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
      await createGhostCard(formData, token);
      setLoading(false);
      navigate(-1);
    } catch (err) {
      setLoading(false);
      setError("Failed to add project");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Exit Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-8 z-50 w-12 h-12 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
      >
        <ArrowLeft className="w-6 h-6 text-slate-300 hover:text-[#34e0a1] transition-colors" />
      </button>

      {/* Header - Fixed at top */}
      <div className="text-center py-8 px-4">
        <Skull className="w-16 h-16 mx-auto mb-6 text-[#34e0a1] animate-pulse" />
        <h1 className="text-5xl font-gothic text-[#34e0a1] mb-4">Bury Your Project</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Give your abandoned project a proper digital burial. Fill out this death certificate so others can pay their respects.
        </p>
      </div>

      {/* Form - Full width landscape */}
      <div className="px-4 pb-8">
        <div className="w-full max-w-none">
          <Card className="tombstone-card p-8 mx-auto max-w-7xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-foreground font-medium"
                  >
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
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.type === type.value
                              ? "border-[#34e0a1] bg-[#34e0a1]/10 text-[#34e0a1]"
                              : "border-border hover:border-[#34e0a1]/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
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
                      Project Logo (Optional)
                    </Label>
                    <div className="relative">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleLogoUpload(e.target.files[0])}
                      />
                      <div className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
                        <ImageIcon className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                        <p className="text-slate-300 mb-1">Upload Logo</p>
                        <p className="text-slate-500 text-sm">
                          Click or drag & drop
                        </p>
                      </div>
                    </div>
                    {logoProgress > 0 && (
                      <div className="glass rounded-lg overflow-hidden mt-2">
                        <div
                          className="h-1 bg-[#34e0a1]"
                          style={{ width: `${logoProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <Label className="text-foreground font-medium mb-2 block">
                      Pitch Deck (Optional)
                    </Label>
                    <div className="relative">
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handlePdfUpload(e.target.files[0])}
                      />
                      <div className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
                        <FileText className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                        <p className="text-slate-300 mb-1">Upload PDF</p>
                        <p className="text-slate-500 text-sm">
                          Click or drag & drop
                        </p>
                      </div>
                    </div>
                    {pdfProgress > 0 && (
                      <div className="glass rounded-lg overflow-hidden mt-2">
                        <div
                          className="h-1 bg-[#34e0a1]"
                          style={{ width: `${pdfProgress}%` }}
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
                    disabled={uploadingLogo || uploadingPdf || loading}
                    className="w-full bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-background neon-glow"
                  >
                    <Skull className="w-5 h-5 mr-2" />
                    {loading || uploadingLogo || uploadingPdf
                      ? "Burying Project..."
                      : "Lay This Project to Rest"}
                  </Button>
                </div>
              </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
