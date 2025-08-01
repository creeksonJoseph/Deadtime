import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Github, Mail } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#34e0a1]/10 via-transparent to-transparent animate-pulse opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#34e0a1]/5 rounded-full animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#34e0a1]/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
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
            onClick={() => navigate("/login")}
            className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 px-8 py-3 text-lg neon-glow transition-all duration-300 hover:scale-105"
          >
            Log In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              className="w-6 h-6 text-[#34e0a1] fill-current"
            >
              <path d="M488 261.8c0-17.8-1.6-35-4.7-51.7H249v97.8h134.3c-5.8 31.2-23.2 57.7-49.5 75.4v62.8h79.8c46.7-43 73.4-106.3 73.4-184.3zM249 492c66.7 0 122.7-22 163.6-59.9l-79.8-62.8c-22.2 15-50.8 23.9-83.8 23.9-64.5 0-119-43.5-138.4-102h-82v64.1C69.5 442.7 153.5 492 249 492zM110.6 297c-4.6-13.7-7.3-28.2-7.3-43s2.7-29.3 7.3-43v-64.1h-82C11.3 194.8 0 221.2 0 254c0 32.8 11.3 59.2 28.6 86.1l82-64.1zM249 120.1c36.2 0 68.7 12.5 94.2 37.1l70.6-70.6C371.7 52.6 315.7 30 249 30 153.5 30 69.5 79.3 28.6 167.9l82 64.1c19.4-58.5 73.9-102 138.4-102z" />
            </svg>
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">⚰️</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">
              Bury Projects
            </h3>
            <p className="text-slate-400 text-sm">
              Let go of projects that didn't make it
            </p>
          </div>
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">🪄</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">
              Revive Ideas
            </h3>
            <p className="text-slate-400 text-sm">
              Give new life to abandoned projects
            </p>
          </div>
          <div className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">
              Earn Badges
            </h3>
            <p className="text-slate-400 text-sm">
              Become a Gravekeeper or Necromancer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
