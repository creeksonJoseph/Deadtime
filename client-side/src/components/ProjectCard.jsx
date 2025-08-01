import { Badge } from './ui/badge'
import { ExternalLink } from 'lucide-react'

export function ProjectCard({ project, onClick, variant = 'default' }) {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (variant === 'tombstone') {
    return (
      <div 
        onClick={onClick}
        className="min-w-[240px] glass rounded-t-3xl rounded-b-lg p-6 hover:glass-strong hover:scale-105 transition-all duration-300 cursor-pointer neon-glow group relative"
      >
        {/* Tombstone decoration */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-[#34e0a1]/30 rounded-full"></div>
        
        <div className="text-center">
          <div className="text-2xl mb-3">⚰️</div>
          <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-[#34e0a1] transition-colors">
            {project.title}
          </h3>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <p className="text-xs text-slate-400 mt-3">
            Buried {formatDate(project.createdAt)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      onClick={onClick}
      className="glass rounded-lg p-6 hover:glass-strong hover:scale-105 transition-all duration-300 cursor-pointer neon-glow group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-slate-200 group-hover:text-[#34e0a1] transition-colors">
          {project.title}
        </h3>
        {project.link && (
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#34e0a1] transition-colors" />
        )}
      </div>
      
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {project.description}
      </p>
      
      <div className="flex justify-between items-center">
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
        <span className="text-xs text-slate-500">
          {formatDate(project.createdAt)}
        </span>
      </div>
    </div>
  )
}