
import React from 'react';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-950/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs, employees, or events..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-4">
        <button className="md:hidden text-slate-400 hover:text-white">
            <Search className="w-5 h-5" />
        </button>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
        <button className="hidden md:block text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3 md:pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <img 
            src={user?.avatar || "https://picsum.photos/200"} 
            alt="Profile" 
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-700"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
