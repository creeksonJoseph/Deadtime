import { Link, useLocation } from "react-router-dom";
import { Skull, User, Search, Bell } from "lucide-react";

export function Header({ onSearchToggle, showSearchButton = false }) {
  const location = useLocation();
  const shouldShowSearch = showSearchButton && location.pathname === '/browse';
  
  return (
    <nav className="border-b border-slate-600/30 bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <Skull className="w-8 h-8 text-[#34e0a1] group-hover:animate-pulse" />
            <span className="text-[24px] md:text-[40px] font-gothic text-[#34e0a1]">
              DEADTIME
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            {shouldShowSearch && (
              <button
                onClick={onSearchToggle}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span className="text-slate-300 text-sm">Search</span>
              </button>
            )}
            

            {/* Notifications Icon */}
            <Link
              to="/notifications"
              className="w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <Bell className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
            </Link>

            {/* Profile Icon */}
            <Link
              to="/account"
              className="w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <User className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
