import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Briefcase, MapPin, Search } from 'lucide-react';

const Opportunities: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { internships, updateUserPoints, getChatRoom } = useApp();

  // Create-only UI state (omitted for brevity, keep existing)
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    stipend: '',
    type: 'Internship' as 'Job' | 'Internship' | 'Freelance' | 'Part-time',
    skills: '',
    description: ''
  });

  // Filters
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'All' | 'Job' | 'Internship' | 'Freelance' | 'Part-time'>('All');

  const filteredInternships = useMemo(() => {
    return internships
      .filter(p => (kind === 'All' ? true : p.type === kind)) // Type match
      .filter(p => (q ? (p.title + ' ' + (p.company || '')).toLowerCase().includes(q.toLowerCase()) : true));
  }, [internships, q, kind]);

  const timeAgo = (d: Date | string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Placeholder submit function
  const submit = () => {
    alert("Posting is currently disabled in this demo view.");
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Toolbar (Reuse existing JSX) */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Opportunities</h1>
            <p className="text-gray-600">Jobs • Internships • Freelance • Part-time</p>
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1"
              >
                Post Job/Internship
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-elev-1 border border-white/50">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
            {(['All', 'Job', 'Internship', 'Freelance', 'Part-time'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setKind(tab)}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${kind === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search title, company..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInternships.map((p) => {
          // Direct mapping from Internship interface
          const typeLabel = p.type || 'Internship';
          return (
            <div key={p.id} className="rounded-2xl border border-white/50 bg-white/90 backdrop-blur shadow-elev-1 hover:shadow-elev-2 transition overflow-hidden">
              {/* Image removed or use generic placeholder */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{p.company}</span>
                      {p.location && (<><span>•</span><span>{p.location}</span></>)}
                      <span>•</span>
                      <span>{timeAgo(p.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${typeLabel.toLowerCase().includes('intern') ? 'bg-amber-100 text-amber-700' : typeLabel.toLowerCase().includes('freelance') ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-emerald-100 text-emerald-700'}`}>{typeLabel}</span>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-700 whitespace-pre-line">
                  <div>{p.description}</div>
                </div>

                {p.skills && p.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-sm font-semibold text-gray-700">Skills:</span>
                    {p.skills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{p.location || 'Remote-Friendly'}</span>
                    {p.stipend && (
                      <>
                        <span className="ml-3 text-emerald-600 font-semibold">{p.stipend}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/alumni/${p.postedById}`)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium"
                  >
                    View Poster
                  </button>
                  <button
                    onClick={() => {
                      if (!user) return alert('Please login to apply.');
                      getChatRoom([user.id, p.postedById]);
                      // Reward both applicant and alumni poster
                      updateUserPoints(user.id, 5);
                      updateUserPoints(p.postedById, 5);
                      alert('Chat started with the poster. Open chat from the top bar to message now.');
                    }}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-800 shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Drawer */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-elev-2 border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Post Job/Internship</h3>
              <button onClick={() => setShowCreate(false)} className="px-3 py-1 rounded-full border">Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="px-3 py-2 border rounded-lg" placeholder="Title (e.g., Data Analyst Intern)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <select className="px-3 py-2 border rounded-lg" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
                <option>Job</option>
                <option>Internship</option>
                <option>Freelance</option>
                <option>Part-time</option>
              </select>
              <input className="px-3 py-2 border rounded-lg" placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              <input className="px-3 py-2 border rounded-lg" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              <input className="px-3 py-2 border rounded-lg" placeholder="Stipend/CTC (e.g., ₹20,000/month)" value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} />
              <input className="px-3 py-2 border rounded-lg" placeholder="Skills (comma-separated)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
              <textarea className="md:col-span-2 px-3 py-2 border rounded-lg" rows={4} placeholder="Short description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={submit} className="px-5 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
