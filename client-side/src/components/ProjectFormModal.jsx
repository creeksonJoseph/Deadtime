import { useState } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function ProjectFormModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    status: project?.status || 'Still Hopeful',
    description: project?.description || '',
    link: project?.link || '',
    videos: project?.videos || []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save to backend
    console.log('Saving project:', formData)
    onSave(formData)
  }

  const handleVideoUpload = (e) => {
    // Mock video upload - in real app, this would upload to cloud storage
    const files = Array.from(e.target.files)
    const videoUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...videoUrls]
    }))
  }

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl p-8 neon-glow animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 glass rounded-full p-2 hover:glass-strong transition-all duration-300"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6">
            <h1 className="font-zasline text-2xl text-[#34e0a1] mb-2">
              {project ? 'Edit Project' : 'Bury New Project'}
            </h1>
            <p className="text-slate-400">
              {project ? 'Update your project details' : 'Add a project to the digital graveyard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-slate-300">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
                placeholder="My Amazing Project"
                required
              />
            </div>

            {/* Status */}
            <div>
              <Label className="text-slate-300">Project Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-[#34e0a1]/30">
                  <SelectItem value="Still Hopeful" className="text-slate-200">Still Hopeful</SelectItem>
                  <SelectItem value="Reviving" className="text-slate-200">Reviving</SelectItem>
                  <SelectItem value="RIP" className="text-slate-200">RIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500 min-h-[120px]"
                placeholder="Tell the story of your project..."
                required
              />
            </div>

            {/* Project Link */}
            <div>
              <Label htmlFor="link" className="text-slate-300">Project Link (optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
                placeholder="https://github.com/username/project"
              />
            </div>

            {/* Video Upload */}
            <div>
              <Label className="text-slate-300">Project Videos (optional)</Label>
              <div className="mt-2 space-y-4">
                {/* Video Upload Button */}
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
                    <p className="text-slate-500 text-sm">Drag and drop or click to browse</p>
                  </div>
                </div>

                {/* Uploaded Videos */}
                {formData.videos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">Uploaded Videos:</p>
                    {formData.videos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between glass rounded-lg p-3">
                        <span className="text-slate-300 text-sm">Video {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
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

            {/* Actions */}
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
                className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow flex-1"
              >
                {project ? 'Update Project' : 'Bury Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}