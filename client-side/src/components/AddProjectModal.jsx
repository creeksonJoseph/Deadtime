import { useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function AddProjectModal({ onClose, onSave }) {
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
    images: [],
    videos: [],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cloudinary upload helper
  const uploadToCloudinary = async (files, resourceType = "image") => {
    setUploading(true);
    const urls = [];

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET); // set in .env
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/${resourceType}/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const uploaded = await res.json();
      urls.push(uploaded.secure_url);
    }

    setUploading(false);
    return urls;
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = await uploadToCloudinary(files, "image");
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = await uploadToCloudinary(files, "video");
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...uploadedUrls],
    }));
  };

  const removeMedia = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting to backend:", formData);
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl glass-strong rounded-2xl neon-glow animate-fade-up max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 glass rounded-full p-2 hover:glass-strong transition-all"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 sm:px-8 pt-10 pb-24 space-y-6"
        >
          <h1 className="font-zasline text-2xl text-[#34e0a1] mb-2">
            Add Project
          </h1>
          <p className="text-slate-400">
            Fill out details to bury or revive a project
          </p>

          {/* Title */}
          <div>
            <Label className="text-slate-300">Project Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="My Amazing Project"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-slate-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 min-h-[120px]"
              placeholder="Tell the story of your project..."
              required
            />
          </div>

          {/* Status */}
          <div>
            <Label className="text-slate-300">Project Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger className="mt-2 glass border-[#34e0a1]/30 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-[#34e0a1]/30">
                <SelectItem value="abandoned" className="text-slate-200">
                  Abandoned
                </SelectItem>
                <SelectItem value="on-hold" className="text-slate-200">
                  On Hold
                </SelectItem>
                <SelectItem value="revived" className="text-slate-200">
                  Revived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div>
            <Label className="text-slate-300">Project Type</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => handleChange("type", val)}
            >
              <SelectTrigger className="mt-2 glass border-[#34e0a1]/30 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-[#34e0a1]/30">
                <SelectItem value="code" className="text-slate-200">
                  Code
                </SelectItem>
                <SelectItem value="business" className="text-slate-200">
                  Business
                </SelectItem>
                <SelectItem value="content" className="text-slate-200">
                  Content
                </SelectItem>
                <SelectItem value="other" className="text-slate-200">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional fields */}
          <div>
            <Label className="text-slate-300">External Link (optional)</Label>
            <Input
              value={formData.externalLink}
              onChange={(e) => handleChange("externalLink", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="GitHub or live link"
            />
          </div>

          <div>
            <Label className="text-slate-300">
              Abandonment Reason (optional)
            </Label>
            <Textarea
              value={formData.abandonmentReason}
              onChange={(e) =>
                handleChange("abandonmentReason", e.target.value)
              }
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 min-h-[80px]"
              placeholder="Why did you abandon this project?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Date Started (required)</Label>
              <Input
                type="date"
                value={formData.dateStarted}
                onChange={(e) => handleChange("dateStarted", e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
                required
              />
            </div>
            <div>
              <Label className="text-slate-300">
                Date Abandoned (optional)
              </Label>
              <Input
                type="date"
                value={formData.dateAbandoned}
                onChange={(e) => handleChange("dateAbandoned", e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Pitch Deck (optional PDF)</Label>
            <Input
              type="url"
              value={formData.pitchDeckUrl}
              onChange={(e) => handleChange("pitchDeckUrl", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="Cloud link to your pitch deck"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-slate-300">Project Images (optional)</Label>
            <div className="mt-2 space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
                  <Upload className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                  <p className="text-slate-300 mb-1">Upload Images</p>
                  <p className="text-slate-500 text-sm">
                    Drag and drop or click to browse
                  </p>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 glass rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        className="object-cover w-full h-full"
                        alt={`Image ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia("images", index)}
                        className="absolute top-1 right-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <Label className="text-slate-300">Project Videos (optional)</Label>
            <div className="mt-2 space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300">
                  <Upload className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                  <p className="text-slate-300 mb-1">Upload Videos</p>
                  <p className="text-slate-500 text-sm">
                    Drag and drop or click to browse
                  </p>
                </div>
              </div>

              {formData.videos.length > 0 && (
                <div className="space-y-2">
                  {formData.videos.map((vid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between glass rounded-lg p-3"
                    >
                      <span className="text-slate-300 text-sm">
                        Video {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMedia("videos", index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow flex-1"
            >
              {uploading ? "Uploading..." : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
