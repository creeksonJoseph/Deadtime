import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Github, Mail } from "lucide-react";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    login();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden animate-fade-up">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#34e0a1]/5 via-transparent to-transparent"></div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 glass rounded-full p-3 hover:glass-strong transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5 text-[#34e0a1]" />
      </button>

      {/* Signup form */}
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="text-center mb-8">
            <h1 className="font-zasline text-3xl text-[#34e0a1] mb-2">
              Join the Graveyard
            </h1>
            <p className="text-slate-400">Become a digital archaeologist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
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

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                  className="w-5 h-5 text-[#34e0a1] mr-2 fill-current"
                >
                  <path d="M488 261.8c0-17.8-1.6-35-4.7-51.7H249v97.8h134.3c-5.8 31.2-23.2 57.7-49.5 75.4v62.8h79.8c46.7-43 73.4-106.3 73.4-184.3zM249 492c66.7 0 122.7-22 163.6-59.9l-79.8-62.8c-22.2 15-50.8 23.9-83.8 23.9-64.5 0-119-43.5-138.4-102h-82v64.1C69.5 442.7 153.5 492 249 492zM110.6 297c-4.6-13.7-7.3-28.2-7.3-43s2.7-29.3 7.3-43v-64.1h-82C11.3 194.8 0 221.2 0 254c0 32.8 11.3 59.2 28.6 86.1l82-64.1zM249 120.1c36.2 0 68.7 12.5 94.2 37.1l70.6-70.6C371.7 52.6 315.7 30 249 30 153.5 30 69.5 79.3 28.6 167.9l82 64.1c19.4-58.5 73.9-102 138.4-102z" />
                </svg>
                <span className="text-slate-300">Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already a gravekeeper?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#34e0a1] hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
