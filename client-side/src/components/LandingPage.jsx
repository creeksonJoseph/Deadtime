import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Github, Mail } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#34e0a1]/10 via-transparent to-transparent animate-pulse opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#34e0a1]/5 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#34e0a1]/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-zasline text-6xl md:text-8xl font-bold text-[#34e0a1] mb-4 neon-glow-strong animate-pulse-glow">
            DeadTime
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-md mx-auto">
            Bury and Revive Your Projects
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => navigate('/login')}
            className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 px-8 py-3 text-lg neon-glow transition-all duration-300 hover:scale-105"
          >
            Log In
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            variant="outline"
            className="border-[#34e0a1] text-[#34e0a1] hover:bg-[#34e0a1]/10 px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </Button>
        </div>

        {/* OAuth Buttons */}
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110 neon-glow">
            <Github className="w-6 h-6 text-[#34e0a1]" />
          </button>
          <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110 neon-glow">
            <Mail className="w-6 h-6 text-[#34e0a1]" />
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">⚰️</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">Bury Projects</h3>
            <p className="text-slate-400 text-sm">Let go of projects that didn't make it</p>
          </div>
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">🪄</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">Revive Ideas</h3>
            <p className="text-slate-400 text-sm">Give new life to abandoned projects</p>
          </div>
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">Earn Badges</h3>
            <p className="text-slate-400 text-sm">Become a Gravekeeper or Necromancer</p>
          </div>
        </div>
      </div>
    </div>
  )
}