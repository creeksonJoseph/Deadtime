import { useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, Filter } from 'lucide-react'

// Mock data for other users' projects
const browseProjects = [
  {
    id: 'b1',
    title: 'Social Media Dashboard',
    status: 'RIP',
    description: 'A comprehensive dashboard for managing multiple social media accounts. Never got past the prototype stage.',
    createdAt: '2024-01-10',
    author: 'DevGhost',
    link: 'https://github.com/devghost/social-dashboard',
    videos: [],
    isOwner: false
  },
  {
    id: 'b2',
    title: 'Recipe Sharing App',
    status: 'RIP',
    description: 'An app where food lovers could share and discover new recipes. Had great potential.',
    createdAt: '2024-02-05',
    author: 'ChefCoder',
    link: 'https://github.com/chefcoder/recipe-app',
    videos: [],
    isOwner: false
  },
  {
    id: 'b3',
    title: 'AI Code Assistant',
    status: 'Reviving',
    description: 'Building an AI-powered code completion tool. Currently working on bringing it back.',
    createdAt: '2024-01-20',
    author: 'AIWizard',
    link: 'https://github.com/aiwizard/code-assistant',
    videos: [],
    isOwner: false
  },
  {
    id: 'b4',
    title: 'Fitness Tracker',
    status: 'Still Hopeful',
    description: 'A minimalist fitness tracking app with beautiful visualizations.',
    createdAt: '2024-03-01',
    author: 'FitDev',
    link: 'https://github.com/fitdev/fitness-tracker',
    videos: [],
    isOwner: false
  },
  {
    id: 'b5',
    title: 'Markdown Editor',
    status: 'RIP',
    description: 'A distraction-free markdown editor with live preview. Beautiful but incomplete.',
    createdAt: '2024-01-15',
    author: 'WriteCode',
    link: 'https://github.com/writecode/md-editor',
    videos: [],
    isOwner: false
  },
  {
    id: 'b6',
    title: 'Budget Tracker',
    status: 'RIP',
    description: 'Personal finance management app with smart categorization. Had big dreams.',
    createdAt: '2024-02-12',
    author: 'MoneyMind',
    link: 'https://github.com/moneymind/budget-tracker',
    videos: [],
    isOwner: false
  }
]

export function BrowseProjects({ onOpenProject }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const statusFilters = ['All', 'RIP', 'Reviving', 'Still Hopeful']

  const filteredProjects = browseProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">Browse the Graveyard</h1>
        <p className="text-slate-400">Discover projects waiting for revival</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, descriptions, or authors..."
            className="pl-10 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#34e0a1] text-[#141d38] neon-glow'
                  : 'glass text-slate-400 hover:glass-strong hover:text-[#34e0a1]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="space-y-2">
              <ProjectCard
                project={project}
                onClick={() => onOpenProject(project)}
              />
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500">by {project.author}</span>
                {project.status === 'RIP' && (
                  <Badge className="bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/30 text-xs">
                    Available to Revive
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-zasline text-xl text-[#34e0a1] mb-2">No projects found</h3>
          <p className="text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 glass rounded-lg p-6">
        <h3 className="font-zasline text-lg text-[#34e0a1] mb-4">Graveyard Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#34e0a1]">
              {browseProjects.filter(p => p.status === 'RIP').length}
            </div>
            <div className="text-slate-400 text-sm">RIP Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {browseProjects.filter(p => p.status === 'Reviving').length}
            </div>
            <div className="text-slate-400 text-sm">Being Revived</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {browseProjects.filter(p => p.status === 'Still Hopeful').length}
            </div>
            <div className="text-slate-400 text-sm">Still Hopeful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#34e0a1]">{browseProjects.length}</div>
            <div className="text-slate-400 text-sm">Total Projects</div>
          </div>
        </div>
      </div>
    </div>
  )
}