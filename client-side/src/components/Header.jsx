import { Link } from "react-router-dom";
import { Skull, User } from "lucide-react";

export function Header() {
  return (
    <nav className="border-b border-slate-600/30 bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <Skull className="w-8 h-8 text-[#34e0a1] group-hover:animate-pulse" />
            <span className="text-[40px] font-gothic text-[#34e0a1]">
              DEADTIME
            </span>
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
    </nav>
  );
}
