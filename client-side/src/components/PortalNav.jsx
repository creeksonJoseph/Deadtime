import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, User, Home, Trophy, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function PortalNav({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: Home, title: "Dashboard" },
    { id: "browse", path: "/browse", icon: Search, title: "Graveyard" },
    { id: "favourites", path: "/favourites", icon: Star, title: "Favourites" },
    { id: "account", path: "/account", icon: User, title: "Account" },
    { id: "leaderboard", path: "/leaderboard", icon: Trophy, title: "Leaderboard" },
  ];

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#141d38]/95 backdrop-blur-xl border border-[#34e0a1]/30 rounded-r-2xl p-6 shadow-[0_0_30px_#34e0a1]/20"
          >
            <div className="flex flex-col items-center space-y-6">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.id} className="relative group">
                    <motion.button
                      onClick={() => navigate(item.path)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "bg-[#34e0a1]/20 text-[#34e0a1] border-[#34e0a1]/40 shadow-[0_0_15px_#34e0a1]"
                          : "text-slate-400 border-slate-600/40 hover:text-[#34e0a1] hover:border-[#34e0a1]/40 hover:shadow-[0_0_10px_#34e0a1]"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.button>
                    {/* Tooltip */}
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#34e0a1] text-[#141d38] text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {item.title}
                    </div>
                  </div>
                );
              })}

              {/* Divider */}
              <div className="w-8 h-px bg-slate-600/50" />

              {/* Add Project Button */}
              <div className="relative group">
                <motion.button
                  onClick={() => navigate('/add-project')}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-xl bg-[#34e0a1] text-[#141d38] shadow-[0_0_20px_#34e0a1] flex items-center justify-center relative overflow-hidden"
                >
                  <Plus className="w-6 h-6" />
                  <span className="absolute inset-0 rounded-xl border-2 border-[#34e0a1]/60 animate-pulse" />
                </motion.button>
                <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#34e0a1] text-[#141d38] text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Add Project
                </div>
              </div>


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
