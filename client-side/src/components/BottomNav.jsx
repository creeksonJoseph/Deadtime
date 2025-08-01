import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Search, User, FolderOpen } from "lucide-react";

export function BottomNav({ onOpenForm }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: FolderOpen,
      label: "My Projects",
    },
    { id: "browse", path: "/browse", icon: Search, label: "Browse Projects" },
    { id: "account", path: "/account", icon: User, label: "Account" },
  ];

  console.log("✅ BottomNav rendered on:", location.pathname);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] 
      bg-[#141d38]/95 backdrop-blur-lg 
      border-t border-[#34e0a1]/30 
      shadow-[0_0_15px_#34e0a1]/40 
      px-6 py-4"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-[#34e0a1] scale-110 drop-shadow-[0_0_5px_#34e0a1]"
                  : "text-slate-400 hover:text-[#34e0a1]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Add Button */}
        <button
          onClick={onOpenForm}
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8
          w-14 h-14 bg-[#34e0a1] text-[#141d38] rounded-full
          flex items-center justify-center
          shadow-[0_0_25px_#34e0a1] 
          hover:scale-110 transition-all duration-300 animate-bounce"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
