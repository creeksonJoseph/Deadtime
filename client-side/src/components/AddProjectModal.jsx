import { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react";
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
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);

  const logoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cloudinary uploader
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
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/${resourceType}/upload`
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
          setTimeout(() => setProgress(0), 1000); // Fade out after 1s
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

  // Handlers
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

  const removeLogo = () => setFormData((prev) => ({ ...prev, logoUrl: "" }));
  const removePdf = () =>
    setFormData((prev) => ({ ...prev, pitchDeckUrl: "" }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl glass-strong rounded-2xl neon-glow animate-fade-up max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close */}
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
            Add GhostCard
          </h1>
          <p className="text-slate-400">Fill in the project details</p>

          {/* Title */}
          <div>
            <Label className="text-slate-300">Project Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="My Project"
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
              placeholder="Describe your project..."
              required
            />
          </div>

          {/* Status & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="mt-2 glass border-[#34e0a1]/30 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="revived">Revived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger className="mt-2 glass border-[#34e0a1]/30 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* External Link */}
          <div>
            <Label className="text-slate-300">External Link</Label>
            <Input
              type="url"
              value={formData.externalLink}
              onChange={(e) => handleChange("externalLink", e.target.value)}
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="GitHub / YouTube / Demo"
            />
          </div>

          {/* Abandonment Reason */}
          <div>
            <Label className="text-slate-300">
              Abandonment Reason (optional)
            </Label>
            <Textarea
              value={formData.abandonmentReason}
              onChange={(e) =>
                handleChange("abandonmentReason", e.target.value)
              }
              className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              placeholder="Why did this project get abandoned?"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Date Started</Label>
              <Input
                type="date"
                value={formData.dateStarted}
                onChange={(e) => handleChange("dateStarted", e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
                required
              />
            </div>
            <div>
              <Label className="text-slate-300">Date Abandoned</Label>
              <Input
                type="date"
                value={formData.dateAbandoned}
                onChange={(e) => handleChange("dateAbandoned", e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200"
              />
            </div>
          </div>

          {/* Upload Buttons / Dropzones */}
          <div className="space-y-4">
            {/* Logo Upload */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mobile Button */}
              <div className="sm:hidden flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoUpload(e.target.files[0])}
                />
                <Button
                  type="button"
                  className="w-full bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
                  onClick={() =>
                    logoInputRef.current && logoInputRef.current.click()
                  }
                >
                  Attach image
                </Button>
              </div>

              {/* Desktop Dropzone */}
              <div className="hidden sm:block relative w-full">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => handleLogoUpload(e.target.files[0])}
                  tabIndex={0}
                  aria-label="Upload logo"
                />
                <div
                  className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300"
                  onClick={() =>
                    logoInputRef.current && logoInputRef.current.click()
                  }
                  style={{ cursor: "pointer" }}
                >
                  <ImageIcon className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                  <p className="text-slate-300 mb-1">Attach image</p>
                  <p className="text-slate-500 text-sm">Click or Drag & Drop</p>
                </div>
              </div>
            </div>
            {logoProgress > 0 && (
              <div className="glass rounded-lg overflow-hidden">
                <div
                  className="h-1 bg-[#34e0a1]"
                  style={{ width: `${logoProgress}%` }}
                />
              </div>
            )}
            {formData.logoUrl && (
              <div className="relative w-24 h-24 glass rounded-lg overflow-hidden">
                <img
                  src={formData.logoUrl}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-1 text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PDF Upload */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mobile Button */}
              <div className="sm:hidden flex-1">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handlePdfUpload(e.target.files[0])}
                />
                <Button
                  type="button"
                  className="w-full bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
                  onClick={() =>
                    pdfInputRef.current && pdfInputRef.current.click()
                  }
                >
                  Attach PDF
                </Button>
              </div>

              {/* Desktop Dropzone */}
              <div className="hidden sm:block relative w-full">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => handlePdfUpload(e.target.files[0])}
                  tabIndex={0}
                  aria-label="Upload PDF"
                />
                <div
                  className="glass border-[#34e0a1]/30 border-2 border-dashed rounded-lg p-6 text-center hover:glass-strong transition-all duration-300"
                  onClick={() =>
                    pdfInputRef.current && pdfInputRef.current.click()
                  }
                  style={{ cursor: "pointer" }}
                >
                  <FileText className="w-8 h-8 text-[#34e0a1] mx-auto mb-2" />
                  <p className="text-slate-300 mb-1">Attach PDF</p>
                  <p className="text-slate-500 text-sm">Click or Drag & Drop</p>
                </div>
              </div>
            </div>
            {pdfProgress > 0 && (
              <div className="glass rounded-lg overflow-hidden">
                <div
                  className="h-1 bg-[#34e0a1]"
                  style={{ width: `${pdfProgress}%` }}
                />
              </div>
            )}
            {formData.pitchDeckUrl && (
              <div className="flex items-center justify-between glass rounded-lg p-3">
                <span className="text-slate-300 text-sm truncate">
                  Pitch Deck Uploaded
                </span>
                <button
                  type="button"
                  onClick={removePdf}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
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
              disabled={uploadingLogo || uploadingPdf}
              className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow flex-1"
            >
              {uploadingLogo || uploadingPdf ? "Uploading..." : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
