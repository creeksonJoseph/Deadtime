import { useState } from 'react'
import { X, ExternalLink, Edit, Heart, Play } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function ProjectModal({ project, onClose, onEdit, isOwner = false }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'RIP':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Reviving':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Still Hopeful':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
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
        {/* Watermark */}
        <div className="absolute top-4 right-4 text-6xl opacity-10">⚰️</div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 glass rounded-full p-2 hover:glass-strong transition-all duration-300"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="font-zasline text-2xl text-[#34e0a1] pr-12">{project.title}</h1>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <span className="text-sm text-slate-400">
                Created {formatDate(project.createdAt)}
              </span>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#34e0a1] hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            )}
          </div>

          {/* Video Carousel */}
          {project.videos && project.videos.length > 0 && (
            <div className="mb-6">
              <div className="glass rounded-lg p-4 mb-4">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-[#34e0a1] mx-auto mb-2" />
                    <p className="text-slate-400">Video {currentVideoIndex + 1}</p>
                  </div>
                </div>
                
                {project.videos.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {project.videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentVideoIndex
                            ? 'bg-[#34e0a1]'
                            : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg text-slate-200 mb-3">Description</h3>
            <p className="text-slate-400 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isOwner && (
              <Button
                onClick={() => onEdit(project)}
                variant="outline"
                className="border-[#34e0a1] text-[#34e0a1] hover:bg-[#34e0a1]/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            )}
            
            {!isOwner && project.status === 'RIP' && (
              <Button
                className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 neon-glow"
              >
                <Heart className="w-4 h-4 mr-2" />
                Revive Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}