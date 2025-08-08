import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-6 right-6 z-50 glass rounded-xl p-4 border border-[#34e0a1]/30 neon-glow"
    >
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-5 h-5 text-[#34e0a1]" />
        <span className="text-slate-200 font-medium">{message}</span>
      </div>
    </motion.div>
  );
}