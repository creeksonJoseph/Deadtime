import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ArrowLeft, Github, Mail } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    login()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden animate-fade-up">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#34e0a1]/5 via-transparent to-transparent"></div>
      
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 glass rounded-full p-3 hover:glass-strong transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5 text-[#34e0a1]" />
      </button>

      {/* Login form */}
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="text-center mb-8">
            <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">Welcome Back</h1>
            <p className="text-slate-400">Enter the graveyard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 py-3 neon-glow transition-all duration-300 hover:scale-[1.02]"
            >
              Enter the Graveyard
            </Button>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px bg-slate-600 flex-1"></div>
              <span className="text-slate-500 text-sm">or</span>
              <div className="h-px bg-slate-600 flex-1"></div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 glass rounded-lg p-3 flex items-center justify-center hover:glass-strong transition-all duration-300">
                <Github className="w-5 h-5 text-[#34e0a1] mr-2" />
                <span className="text-slate-300">GitHub</span>
              </button>
              <button className="flex-1 glass rounded-lg p-3 flex items-center justify-center hover:glass-strong transition-all duration-300">
                <Mail className="w-5 h-5 text-[#34e0a1] mr-2" />
                <span className="text-slate-300">Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              New to the graveyard?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#34e0a1] hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}