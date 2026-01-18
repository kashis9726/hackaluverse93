import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import MainLayout from '../layouts/MainLayout';
import PublicLanding from '../pages/public/PublicLanding';
import About from '../pages/public/About';
import AuthPage from './auth/AuthPage';
import AdminLoginPage from './auth/AdminLoginPage';
import Dashboard from './dashboard/Dashboard';
import Events from './events/Events';
import Opportunities from './opportunities/Opportunities';
import Blogs from './blogs/Blogs';
import StartupHub from './startup/StartupHub';
import ReversePitching from './reverse-pitching/ReversePitching';
import QABoard from './qa/QABoard';
import AlumniDirectory from './people/AlumniDirectory';
import Profile from './profile/Profile';
import ProfileSetup from './profile/ProfileSetup';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import ContentModeration from './admin/ContentModeration';
import SystemSettings from './admin/SystemSettings';

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    if (!user) {
      const next = `${location.pathname}${location.search}`;
      return (
        <Navigate
          to={`/auth?mode=login&next=${encodeURIComponent(next)}`}
          replace
          state={{ message: 'Please log in to continue.', next }}
        />
      );
    }
    return <>{children}</>;
  };

  const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <>{children}</>;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
  };

  const RequireProfileCompleted = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    if (!user) return <>{children}</>;
    if (user.role === 'admin') return <>{children}</>;

    if (!user.profileCompleted && location.pathname !== '/profile-setup') {
      const next = `${location.pathname}${location.search}`;
      return <Navigate to={`/profile-setup?next=${encodeURIComponent(next)}`} replace />;
    }

    if (user.profileCompleted && location.pathname === '/profile-setup') {
      const sp = new URLSearchParams(location.search);
      const n = sp.get('next') || '/dashboard';
      return <Navigate to={n} replace />;
    }

    return <>{children}</>;
  };

  const HybridLayout = () => {
    return user ? <MainLayout /> : <PublicLayout />;
  };

  // Load demo dataset on first visit
  useEffect(() => {
    return;
    const loadDemoData = async () => {
      // Only load once
      if (localStorage.getItem('demoDataLoaded')) {
        return;
      }

      try {
        const res = await fetch('/demo-dataset.json');
        const data = await res.json();
        // Write each key to localStorage
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        localStorage.setItem('demoDataLoaded', 'true');
        console.log('✅ Demo dataset loaded successfully');
      } catch (error) {
        console.warn('Demo dataset not found, continuing without demo data');
      }
    };

    loadDemoData();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>

        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to={user.profileCompleted || user.role === 'admin' ? '/dashboard' : '/profile-setup'} replace />
            ) : (
              <AuthPage />
            )
          }
        />

        <Route path="/admin-login" element={user?.role === 'admin' ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <PublicLanding />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route element={<HybridLayout />}>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/internships" element={<Opportunities />} />
          <Route path="/startups" element={<StartupHub />} />
        </Route>

        <Route element={<RequireAuth><RequireProfileCompleted><MainLayout /></RequireProfileCompleted></RequireAuth>}>
          <Route path="/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />} />
          <Route path="/qa" element={<QABoard />} />
          <Route path="/challenges" element={<ReversePitching />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin/users" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
          <Route path="/admin/analytics" element={<RequireAdmin><Analytics /></RequireAdmin>} />
          <Route path="/admin/content" element={<RequireAdmin><ContentModeration /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><SystemSettings /></RequireAdmin>} />
        </Route>

        <Route
          path="/profile-setup"
          element={
            <RequireAuth>
              <RequireProfileCompleted>
                <ProfileSetup />
              </RequireProfileCompleted>
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;