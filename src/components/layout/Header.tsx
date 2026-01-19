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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  React.useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Assuming API returns { notifications: [...] }
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string, refId: string, type: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));

      // API Call
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ notificationIds: [id] })
        });
      }

      // Navigation based on type
      if (type === 'internship') navigate(`/internships`);
      else if (type === 'post') navigate(`/blogs`);
      else if (type === 'connection') navigate(`/alumni`);

      setShowNotifs(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
      if (unreadIds.length === 0) return;

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ notificationIds: unreadIds })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const messageCount = 0; // Placeholder for now

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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-emerald-100 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/50">
                  <span className="text-sm font-bold text-emerald-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      <span className="block mb-1">🔕</span>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleMarkAsRead(notif._id, notif.referenceId, notif.type)}
                        className={`px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors hover:bg-emerald-50/30 ${!notif.isRead ? 'bg-emerald-50/40 border-l-2 border-l-emerald-500' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-emerald-500' : 'bg-transparent'}`} />
                          <div>
                            <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                {user?.name?.charAt(0).toUpperCase() || 'U'}
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