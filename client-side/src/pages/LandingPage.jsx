import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Github } from "lucide-react";
import { useEffect } from "react";

export function LandingPage() {
  useEffect(() => {
    fetch("https://deadtime.onrender.com", { method: "GET" }).catch((err) =>
      console.error("Warm-up failed ❌", err)
    );
  }, []);

  const navigate = useNavigate();

  const fadeSlide = (direction = "up", delay = 0) => {
    let x = 0,
      y = 0;
    if (direction === "up") y = 50;
    if (direction === "down") y = -50;
    if (direction === "left") x = 50;
    if (direction === "right") x = -50;

    return {
      hidden: { opacity: 0, x, y },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { delay, duration: 0.8, type: "spring" },
      },
    };
  };

  const LiquidCircle = ({ className, delay = 0, distance = 20 }) => (
    <motion.div
      className={`absolute rounded-full overflow-hidden backdrop-blur-xl border border-[#34e0a1]/30 shadow-[0_0_25px_rgba(52,224,161,0.35)] ${className}`}
      animate={{ y: [0, distance, 0] }}
      transition={{ repeat: Infinity, duration: 6 + delay, delay }}
    >
      <div className="absolute inset-0 bg-[#34e0a1]/10 blur-xl" />
      <motion.svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ x: 0 }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      >
        <path
          d="M0 60 Q 25 50 50 60 T 100 60 V100 H0 Z"
          fill="#34e0a1"
          fillOpacity="0.3"
        />
      </motion.svg>
      <motion.svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ x: 0 }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        <path
          d="M0 55 Q 25 65 50 55 T 100 55 V100 H0 Z"
          fill="#34e0a1"
          fillOpacity="0.2"
        />
      </motion.svg>
    </motion.div>
  );

  const FloatingSVG = ({
    children,
    className,
    rotate = 0,
    duration = 10,
    delay = 0,
    distance = 20,
  }) => (
    <motion.div
      className={`absolute opacity-30 ${className}`}
      animate={{ y: [0, distance, 0], rotate: [0, rotate, -rotate, 0] }}
      transition={{ repeat: Infinity, duration, delay }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#141d38]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#34e0a1]/10 via-transparent to-transparent animate-pulse opacity-30"></div>

        <LiquidCircle className="top-[10%] left-[15%] w-28 h-28" />
        <LiquidCircle
          className="bottom-[20%] right-[10%] w-32 h-32"
          delay={1}
        />
        <LiquidCircle className="top-[50%] left-[5%] w-16 h-16" delay={0.5} />
        <LiquidCircle
          className="bottom-[5%] left-[30%] w-20 h-20"
          delay={0.8}
        />
        <LiquidCircle className="top-[30%] right-[30%] w-24 h-24" delay={1.2} />

        <FloatingSVG
          className="top-[15%] left-[10%] w-10"
          rotate={15}
          duration={8}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="fill-[#34e0a1]"
          >
            <path d="M360 0H24C10.7 0 0 10.7 0 24V64c0 13.3 10.7 24 24 24h13.2c6.2 18.6 18.1 35.3 33.6 48L160 192l-89.2 56c-15.5 12.7-27.4 29.4-33.6 48H24c-13.3 0-24 10.7-24 24v40c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-40c0-13.3-10.7-24-24-24h-13.2c-6.2-18.6-18.1-35.3-33.6-48L224 192l89.2-56c15.5-12.7 27.4-29.4 33.6-48H360c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24z" />
          </svg>
        </FloatingSVG>
        <FloatingSVG
          className="bottom-[25%] right-[15%] w-12"
          rotate={-10}
          duration={10}
          delay={1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="fill-[#34e0a1]"
          >
            <path d="M360 0H24C10.7 0 0 10.7 0 24V64c0 13.3 10.7 24 24 24h13.2c6.2 18.6 18.1 35.3 33.6 48L160 192l-89.2 56c-15.5 12.7-27.4 29.4-33.6 48H24c-13.3 0-24 10.7-24 24v40c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-40c0-13.3-10.7-24-24-24h-13.2c-6.2-18.6-18.1-35.3-33.6-48L224 192l89.2-56c15.5-12.7 27.4-29.4 33.6-48H360c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24z" />
          </svg>
        </FloatingSVG>
        <FloatingSVG
          className="top-[20%] right-[20%] w-14"
          rotate={360}
          duration={20}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="fill-[#34e0a1]"
          >
            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm12-312h-24v136l112 67.2 12-19.8-100-60.1V144z" />
          </svg>
        </FloatingSVG>
        <FloatingSVG
          className="bottom-[10%] left-[20%] w-16"
          rotate={-360}
          duration={25}
          delay={0.5}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="fill-[#34e0a1]"
          >
            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm12-312h-24v136l112 67.2 12-19.8-100-60.1V144z" />
          </svg>
        </FloatingSVG>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16 sm:pt-0">
        <motion.div
          className="text-center mb-12 relative inline-block"
          variants={fadeSlide("up", 0.3)}
          initial="hidden"
          animate="show"
        >
          <svg
            className="absolute -inset-6 w-full h-full pointer-events-none"
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
          >
            <path
              d="M10,60 Q 50,20 100,60 T 200,60 300,60 400,60 Q 450,100 490,60 L 490,140 Q 450,180 400,140 T 300,140 200,140 100,140 Q 50,180 10,140 Z"
              fill="none"
              stroke="#34e0a1"
              strokeWidth="4"
              className="drop-shadow-[0_0_15px_#34e0a1]"
            />
          </svg>

          <h1 className="font-zasline text-6xl md:text-8xl font-bold text-[#34e0a1] mb-4 neon-glow-strong animate-pulse-glow relative">
            DeadTime
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-md mx-auto">
            Bury and Revive Your Projects
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <motion.div
            variants={fadeSlide("left", 0.6)}
            initial="hidden"
            animate="show"
          >
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#34e0a1] text-[#141d38] hover:bg-[#34e0a1]/90 px-8 py-3 text-lg neon-glow transition-all duration-300 hover:scale-105"
            >
              Log In
            </Button>
          </motion.div>
          <motion.div
            variants={fadeSlide("left", 0.8)}
            initial="hidden"
            animate="show"
          >
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="border-[#34e0a1] text-[#34e0a1] hover:bg-[#34e0a1]/10 px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </Button>
          </motion.div>
        </div>

        <div className="flex gap-4">
          <motion.button
            variants={fadeSlide("right", 1)}
            initial="hidden"
            animate="show"
            onClick={() => {
              window.location.href =
                "https://deadtime.onrender.com/api/auth/github";
            }}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110 neon-glow"
          >
            <Github className="w-6 h-6 text-[#34e0a1]" />
          </motion.button>
          <motion.button
            variants={fadeSlide("right", 1.2)}
            initial="hidden"
            animate="show"
            onClick={() => navigate("/google-unavailable")}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110 neon-glow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              className="w-6 h-6 text-[#34e0a1] fill-current"
            >
              <path d="M488 261.8c0-17.8-1.6-35-4.7-51.7H249v97.8h134.3c-5.8 31.2-23.2 57.7-49.5 75.4v62.8h79.8c46.7-43 73.4-106.3 73.4-184.3zM249 492c66.7 0 122.7-22 163.6-59.9l-79.8-62.8c-22.2 15-50.8 23.9-83.8 23.9-64.5 0-119-43.5-138.4-102h-82v64.1C69.5 442.7 153.5 492 249 492zM110.6 297c-4.6-13.7-7.3-28.2-7.3-43s2.7-29.3 7.3-43v-64.1h-82C11.3 194.8 0 221.2 0 254c0 32.8 11.3 59.2 28.6 86.1l82-64.1zM249 120.1c36.2 0 68.7 12.5 94.2 37.1l70.6-70.6C371.7 52.6 315.7 30 249 30 153.5 30 69.5 79.3 28.6 167.9l82 64.1c19.4-58.5 73.9-102 138.4-102z" />
            </svg>
          </motion.button>
        </div>

        {/* Guest Browse Button */}
        <motion.div
          variants={fadeSlide("up", 1.4)}
          initial="hidden"
          animate="show"
          className="mt-8"
        >
          <Button
            onClick={() => navigate("/guest-browse")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800/60 px-6 py-2 text-sm transition-all duration-300 hover:scale-105"
          >
            Browse as Guest
          </Button>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "⚰️",
              title: "Bury Projects",
              text: "Let go of projects that didn't make it",
            },
            {
              icon: "🪄",
              title: "Revive Ideas",
              text: "Give new life to abandoned projects",
            },
            {
              icon: "🌟",
              title: "Earn Badges",
              text: "Become a Gravekeeper or Necromancer",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeSlide("up", 1.4 + i * 0.2)}
              initial="hidden"
              animate="show"
              className="text-center glass rounded-lg p-6 hover:glass-strong transition-all duration-300"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-zasline text-lg text-[#34e0a1] mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
