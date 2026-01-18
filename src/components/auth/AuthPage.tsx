import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { GraduationCap, Mail, Lock, User, Building, Calendar, BookOpen } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, signup } = useAuth();
  const { posts, events } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = (searchParams.get('mode') || 'login').toLowerCase() === 'signup' ? 'signup' : 'login';
  const next = searchParams.get('next') || '/dashboard';

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'alumni',
    department: '',
    graduationYear: new Date().getFullYear(),
    company: '',
    position: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const authMessage = (location.state as any)?.message as string | undefined;

  const latestBlogs = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return posts.filter(p => p.type === 'post').slice(0, 2);
  }, [posts]);

  const upcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null;
    return events
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, [events]);

  const setMode = (m: 'login' | 'signup') => {
    const sp = new URLSearchParams(searchParams);
    sp.set('mode', m);
    setSearchParams(sp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        success = await signup({
          ...formData,
          skills: skillsArray
        });
      }

      if (!success) {
        alert(isLogin ? 'Invalid credentials' : 'User already exists or signup failed');
        return;
      }

      navigate(next, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-2xl shadow-elev-2 border border-white/40 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xl font-extrabold text-gray-900">AluVerse</div>
                <div className="text-sm text-gray-600">Sign in to continue</div>
              </div>
            </div>

            {authMessage && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {authMessage}
              </div>
            )}

            <div className="mt-6">
              <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isLogin ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-700'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!isLogin ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-700'
                    }`}
                >
                  Sign up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {formData.role === 'student' && (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Expected graduation year"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {formData.role === 'alumni' && (
                    <>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Current company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </>
                  )}

                  <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:opacity-95 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
              </button>
            </form>


          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 shadow-elev-1 text-white">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/80">Latest from the community</div>
              <div className="mt-4 space-y-3">
                {latestBlogs.map((b) => (
                  <div key={b.id} className="rounded-xl bg-white/10 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <BookOpen className="h-4 w-4" />
                      <span className="truncate">{b.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className="mt-2 text-sm font-bold line-clamp-2">{(b as any).title || b.content}</div>
                    <div className="mt-1 text-xs text-white/80 line-clamp-2">{b.content}</div>
                  </div>
                ))}
                {latestBlogs.length === 0 && (
                  <div className="text-sm text-white/80">No blogs available yet.</div>
                )}
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold uppercase tracking-wide text-white/80">Upcoming event</div>
                <div className="mt-3 rounded-xl bg-white/10 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{upcomingEvent ? new Date(upcomingEvent.date).toLocaleString() : 'Coming soon'}</span>
                  </div>
                  <div className="mt-2 text-sm font-bold line-clamp-2">{upcomingEvent?.title || 'Alumni Events & Webinars'}</div>
                  <div className="mt-1 text-xs text-white/80 line-clamp-1">{upcomingEvent?.location || 'Log in to register and join.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;