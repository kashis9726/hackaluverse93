import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Chat from '../components/chat/Chat';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ page?: string; search?: string }>;
      if (!ce.detail?.page) return;

      const page = ce.detail.page;
      const map: Record<string, string> = {
        dashboard: '/dashboard',
        events: '/events',
        opportunities: '/internships',
        blogs: '/blogs',
        startups: '/startups',
        'reverse-pitching': '/challenges',
        qa: '/qa',
        alumni: '/alumni',
        profile: '/profile',
        users: '/admin/users',
        analytics: '/admin/analytics',
        content: '/admin/content',
        settings: '/admin/settings',
      };

      if (ce.detail.search && page === 'alumni') {
        try {
          localStorage.setItem('directorySearch', ce.detail.search);
        } catch {}
      }

      navigate(map[page] || '/dashboard');
    };

    window.addEventListener('app:navigate' as any, handler as any);
    return () => window.removeEventListener('app:navigate' as any, handler as any);
  }, [navigate]);

  return (
    <div className="relative h-screen bg-app-gradient overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span
          className="absolute -top-16 -left-24 h-80 w-80 rounded-full blur-3xl opacity-50 animate-drift-slower"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(217,70,239,0.45), transparent 60%)' }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 -right-24 h-96 w-96 rounded-full blur-3xl opacity-50 animate-float-slow"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.35), transparent 60%)' }}
        />
        <span
          className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-40 animate-drift-slower"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(20,184,166,0.35), transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 flex h-full">
        <Sidebar />

        <div className="flex-1 flex min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="sticky top-0 z-30">
              <Header onChatToggle={() => setChatOpen((v) => !v)} />
            </div>

            <main className="flex-1 overflow-auto">
              <div className="mx-auto w-full max-w-6xl p-6">
                <Outlet />
              </div>
            </main>
          </div>

          {chatOpen && (
            <div className="w-80 bg-white/80 backdrop-blur border-l border-white/50 shadow-elev-1">
              <Chat onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
