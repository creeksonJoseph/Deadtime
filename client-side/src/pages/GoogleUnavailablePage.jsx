import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Github } from "lucide-react";
import { Button } from "../components/ui/button";

export function GoogleUnavailablePage() {
  const navigate = useNavigate();

  const handleGithubLogin = () => {
    const serverURL = "https://deadtime.onrender.com";
    window.location.href = `${serverURL}/api/auth/github`;
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#141d38] fixed top-0 left-0 m-0 p-0">
      <button
        onClick={() => navigate("/login")}
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
        <div className="glass rounded-2xl p-8 neon-glow border border-[#34e0a1]/20 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          
          <h1 className="font-zasline text-2xl text-[#34e0a1] mb-4">
            Google Login Unavailable
          </h1>
          
          <p className="text-slate-300 mb-6">
            ⚠️ Google authentication is temporarily unavailable, please use other login methods.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleGithubLogin}
              className="w-full glass border border-[#34e0a1]/30 hover:glass-strong transition-all duration-300 flex items-center justify-center"
            >
              <Github className="w-5 h-5 text-[#34e0a1] mr-2" />
              <span className="text-slate-300">Continue with GitHub</span>
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/login")}
                className="flex-1 bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 transition-all duration-300"
              >
                Back to Login
              </Button>
              
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="flex-1 border-[#34e0a1]/30 text-[#34e0a1] hover:bg-[#34e0a1]/10 transition-all duration-300"
              >
                Back to Signup
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}