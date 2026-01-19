import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, MessageSquare, ChevronDown, LogOut, Settings, User } from 'lucide-react';

interface HeaderProps {
  onChatToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const notifCount = 3;
  const messageCount = 2;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-md border-b border-emerald-200/20 shadow-none">
      <div className="h-14 px-6 flex items-center justify-between gap-4">

        {/* Left - Brand Logo (Hidden on desktop since it's in sidebar) */}
        <div className="flex items-center gap-2 min-w-fit lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-emerald-700 font-bold text-sm tracking-wide">AluVerse</span>
        </div>

        {/* Center - Spacer */}
        <div className="flex-1"></div>

        {/* Right - Icons and Profile (Compact) */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {notifCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-emerald-200 p-3 z-50">
                <div className="text-xs uppercase tracking-wide text-emerald-600 font-bold mb-2">Notifications</div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {[...Array(Math.min(notifCount, 3))].map((_, i) => (
                    <div key={i} className="p-2 rounded-lg hover:bg-emerald-50 text-sm text-gray-700">
                      New opportunity available
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button
            onClick={onChatToggle}
            className="relative p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                {messageCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative ml-2 pl-2 border-l border-emerald-200">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'K'}
              </div>
              <ChevronDown className="h-3 w-3 text-emerald-700 group-hover:rotate-180 transition-transform" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-emerald-200 overflow-hidden z-50">
                <div className="px-3 py-3 border-b border-emerald-100 bg-emerald-50">
                  <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                  <div className="text-xs text-gray-600">{user?.email}</div>
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-emerald-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;