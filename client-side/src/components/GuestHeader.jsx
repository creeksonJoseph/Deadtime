import { Link } from "react-router-dom";
import { Skull, Home, LogIn, UserPlus, Search } from "lucide-react";

export function GuestHeader({ onSearchToggle, showSearchButton = false }) {
  return (
    <nav className="border-b border-slate-600/30 bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Skull className="w-8 h-8 text-[#34e0a1] group-hover:animate-pulse" />
            <span className="text-[40px] font-gothic text-[#34e0a1]">
              DEADTIME
            </span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            {showSearchButton && (
              <button
                onClick={onSearchToggle}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span className="text-slate-300 text-sm">Search</span>
              </button>
            )}
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <Home className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300 text-sm">Home</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-200 border border-slate-600/40 hover:border-[#34e0a1]/50"
            >
              <LogIn className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300 text-sm">Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#34e0a1] hover:bg-[#34e0a1]/90 text-[#141d38] transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}