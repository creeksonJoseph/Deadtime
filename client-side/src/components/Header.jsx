import { Link, useLocation } from "react-router-dom";
import { Skull, User, Search, Bell, Shield, Menu, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Header({ onSearchToggle, onSidebarToggle, showSearchButton = false }) {
  const location = useLocation();
  const { user } = useAuth();
  const shouldShowSearch = showSearchButton && location.pathname === '/browse';
  
  return (
    <nav className="border-b border-slate-600/30 bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16">
        {/* Logo with Hamburger Menu */}
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <button
            onClick={onSidebarToggle}
            className="hidden md:flex w-16 h-16 bg-slate-800/60 hover:bg-slate-700/60 items-center justify-center transition-all duration-200 border-r border-slate-600/40 hover:border-[#34e0a1]/50"
          >
            <Menu className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
          </button>
            
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group px-4">
            <Skull className="w-8 h-8 text-[#34e0a1] group-hover:animate-pulse" />
            <span className="text-[24px] md:text-[40px] font-gothic text-[#34e0a1]">
              DEADTIME
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 px-4">
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
            

            {/* Admin Dashboard (only for admins) */}
            {(user?.role === 'admin' || user?.email === 'charanajoseph@gmail.com') && (
              <Link
                to="/admin"
                className="w-10 h-10 bg-red-900/60 hover:bg-red-800/60 rounded-full flex items-center justify-center transition-all duration-200 border border-red-600/40 hover:border-red-500/50"
              >
                <Shield className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" />
              </Link>
            )}

            {/* Notifications Icon */}
            <Link
              to="/notifications"
              className="w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <Bell className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
            </Link>

            {/* Profile Icon (Desktop) / Leaderboard (Mobile) */}
            <Link
              to="/account"
              className="hidden md:flex w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <User className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
            </Link>
            
            {/* Leaderboard Icon (Mobile only) */}
            <Link
              to="/leaderboard"
              className="md:hidden w-10 h-10 bg-slate-800/60 hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <Trophy className="w-5 h-5 text-slate-300 hover:text-[#34e0a1] transition-colors" />
            </Link>
        </div>
      </div>
    </nav>
  );
}
