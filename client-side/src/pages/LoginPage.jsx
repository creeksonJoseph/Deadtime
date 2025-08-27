import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Github, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/auth";
import { Toast } from "../components/Toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  const handleGithubLogin = () => {
    const serverURL = "https://deadtime.onrender.com";
    window.location.href = `${serverURL}/api/auth/github`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        login(data.token, data.user);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (!navigator.onLine) {
        setError("You're offline. Please check your internet connection.");
      } else if (err.message === "Failed to fetch" || err.message.includes("fetch")) {
        setError("Failed to log in. Please check your connection and try again.");
      } else {
        setError(err.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const Sparks = () => (
    <>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#34e0a1] rounded-full opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0%", "-40%"],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </>
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center  bg-[#141d38] fixed top-0 left-0 m-0 p-0">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#34e0a1]/5 blur-3xl" />

        <motion.div
          className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-[#34e0a1]/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full bg-[#34e0a1]/15 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[50%] right-[5%] w-40 h-40 rounded-full bg-[#34e0a1]/25 blur-2xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <Sparks />
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 glass rounded-full p-3 hover:glass-strong transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5 text-[#34e0a1]" />
      </button>

      <motion.div
        className="relative w-full max-w-md z-10 mx-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="glass rounded-2xl p-8 neon-glow border border-[#34e0a1]/20 relative overflow-hidden">
          <div className="text-center mb-8 relative z-10">
            <h1 className="font-zasline text-4xl text-[#34e0a1] mb-2 animate-pulse">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              {loading ? "Logging in..." : "Enter the graveyard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="relative">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onFocus={() => setActiveInput("email")}
                onBlur={() => setActiveInput(null)}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500 transition-all ${
                  activeInput === "email" ? "shadow-[0_0_15px_#34e0a1]" : ""
                }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onFocus={() => setActiveInput("password")}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-2 glass border-[#34e0a1]/30 focus:border-[#34e0a1] text-slate-200 placeholder:text-slate-500 transition-all pr-12 ${
                    activeInput === "password"
                      ? "shadow-[0_0_15px_#34e0a1]"
                      : ""
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#34e0a1] hover:text-[#34e0a1]/80 transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 py-3 neon-glow transition-all duration-300 hover:scale-[1.02]"
            >
              {loading ? "Logging In..." : "Enter the Graveyard"}
            </Button>
          </form>

          <div className="mt-6 relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px bg-slate-600 flex-1"></div>
              <span className="text-slate-500 text-sm">or</span>
              <div className="h-px bg-slate-600 flex-1"></div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex-1 glass rounded-lg p-3 flex items-center justify-center hover:glass-strong transition-all duration-300"
              >
                <Github className="w-5 h-5 text-[#34e0a1] mr-2" />
                <span className="text-slate-300">GitHub</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate("/google-unavailable")}
                className="flex-1 glass rounded-lg p-3 flex items-center justify-center hover:glass-strong transition-all duration-300"
              >
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

          <div className="mt-6 text-center relative z-10">
            <p className="text-slate-400">
              New to the graveyard?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#34e0a1] hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showToast && (
          <Toast 
            message="Login successful! Welcome back." 
            onClose={() => setShowToast(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
