import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? 'text-emerald-700' : 'text-gray-700 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-900 font-extrabold tracking-tight">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span>AluVerse</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navItemClass} end>
                Home
              </NavLink>
              <NavLink to="/blogs" className={navItemClass}>
                Blogs
              </NavLink>
              <NavLink to="/events" className={navItemClass}>
                Events
              </NavLink>
              <NavLink to="/internships" className={navItemClass}>
                Opportunities
              </NavLink>
              <NavLink to="/startups" className={navItemClass}>
                Startups
              </NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 shadow hover:opacity-95"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-6xl px-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-600">© {new Date().getFullYear()} AluVerse</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
