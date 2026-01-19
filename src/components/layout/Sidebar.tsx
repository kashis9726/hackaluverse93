import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  Lightbulb,
  RefreshCw,
  MessageCircle,
  User,
  LogOut,
  BarChart3,
  BookOpen,
  Briefcase,
  UserCheck,
  Settings,
  Shield,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const resolvedCurrentPage = useMemo(() => {
    if (currentPage) return currentPage;
    const p = location.pathname;
    if (p.startsWith('/dashboard')) return 'dashboard';
    if (p.startsWith('/alumni')) return 'alumni';
    if (p.startsWith('/internships')) return 'opportunities';
    if (p.startsWith('/events')) return 'events';
    if (p.startsWith('/startups')) return 'startups';
    if (p.startsWith('/qa')) return 'qa';
    if (p.startsWith('/blogs')) return 'blogs';
    if (p.startsWith('/challenges')) return 'reverse-pitching';
    if (p.startsWith('/profile')) return 'profile';
    if (p.startsWith('/admin/users')) return 'users';
    if (p.startsWith('/admin/analytics')) return 'analytics';
    if (p.startsWith('/admin/content')) return 'content';
    if (p.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  }, [currentPage, location.pathname]);

  const go = (page: string) => {
    if (setCurrentPage) {
      setCurrentPage(page);
      return;
    }
    const map: Record<string, string> = {
      dashboard: '/dashboard',
      alumni: '/alumni',
      opportunities: '/internships',
      mentorship: '/mentorship',
      events: '/events',
      startups: '/startups',
      qa: '/qa',
      blogs: '/blogs',
      'reverse-pitching': '/challenges',
      profile: '/profile',
      users: '/admin/users',
      analytics: '/admin/analytics',
      content: '/admin/content',
      settings: '/admin/settings',
    };
    navigate(map[page] || '/dashboard');
  };

  // Define role-specific menu items
  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: Home },
          { id: 'alumni', label: 'Alumni Directory', icon: Users },
          { id: 'mentorship', label: 'Find Mentors', icon: UserCheck },
          { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'startups', label: 'Startup Ideas', icon: Lightbulb },
          { id: 'qa', label: 'Ask Questions', icon: MessageCircle },
          { id: 'blogs', label: 'Blogs', icon: BookOpen },
          { id: 'reverse-pitching', label: 'Challenges Hub', icon: RefreshCw },
        ];

      case 'alumni':
        return [
          { id: 'dashboard', label: 'Alumni Dashboard', icon: Home },
          { id: 'qa', label: 'Q&A Board', icon: MessageCircle },
          { id: 'alumni', label: 'Alumni Directory', icon: Users },
          { id: 'mentorship', label: 'Mentorship', icon: UserCheck },
          { id: 'blogs', label: 'Blogs', icon: BookOpen },
          { id: 'startups', label: 'Startup Hub', icon: Lightbulb },
          { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
          { id: 'events', label: 'Alumni Events', icon: Calendar },
          { id: 'reverse-pitching', label: 'Mentor Students', icon: RefreshCw },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin', icon: BarChart3 },
          { id: 'users', label: 'User Management', icon: Shield },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'events', label: 'Event Management', icon: Calendar },
          { id: 'content', label: 'Content Moderation', icon: FileText },
          { id: 'alumni', label: 'Alumni Database', icon: Users },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gradient-to-b from-purple-50 to-white border-r border-purple-200 flex flex-col h-screen sticky top-0">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center gap-3 mb-3 opacity-60 hover:opacity-90 transition-opacity duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-700">AluVerse</div>
            <div className="text-xs text-gray-600 capitalize font-medium">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = resolvedCurrentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-purple-100'
                    }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-purple-200 space-y-2">
        <button
          onClick={() => go('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${resolvedCurrentPage === 'profile'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-purple-100'
            }`}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">Profile</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;