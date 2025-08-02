import { motion } from "framer-motion";
import { Plus, Search, User, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function PortalNav({ onOpenForm }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: Home },
    { id: "browse", path: "/browse", icon: Search },
    { id: "account", path: "/account", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.2, rotate: 3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 flex items-center justify-center rounded-full border-2
              transition-all duration-300 backdrop-blur-xl
              ${
                isActive
                  ? "bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/40 shadow-[0_0_15px_#34e0a1]"
                  : "text-slate-400 border-slate-600/40 hover:text-[#34e0a1] hover:shadow-[0_0_10px_#34e0a1]"
              }`}
          >
            <item.icon className="w-6 h-6" />
          </motion.button>
        );
      })}

      {/* Lit Add Button */}
      <motion.button
        onClick={onOpenForm}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 rounded-full bg-[#34e0a1] text-[#141d38]
                   shadow-[0_0_30px_#34e0a1,0_0_60px_#34e0a1] 
                   flex items-center justify-center"
      >
        <Plus className="w-7 h-7" />
        {/* Neon Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#34e0a1]/60 animate-ping" />
      </motion.button>
    </div>
  );
}
