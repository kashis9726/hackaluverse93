import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const chipBase =
  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const role = user?.role;

  const next = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get('next') || '/dashboard';
  }, [location.search]);

  const studentSteps = useMemo(
    () => [
      { key: 'academics', title: 'Academics' },
      { key: 'skills', title: 'Skills & Interests' },
      { key: 'projects', title: 'Projects' },
    ],
    []
  );

  const alumniSteps = useMemo(
    () => [
      { key: 'work', title: 'Work' },
      { key: 'presence', title: 'Online Presence' },
      { key: 'bio', title: 'Bio' },
    ],
    []
  );

  const steps = role === 'alumni' ? alumniSteps : studentSteps;

  const [stepIndex, setStepIndex] = useState(0);

  const [student, setStudent] = useState({
    year: '',
    branch: '',
    skillsRaw: '',
    interestsRaw: '',
    projectsRaw: '',
  });

  const [alumni, setAlumni] = useState({
    company: '',
    position: '',
    domain: '',
    yearsOfExperience: '',
    availability: 'Limited',
    capabilities: {
      mentor: false,
      hiring: false,
      speaker: false,
      startupMentor: false,
      researcher: false,
    },
    linkedinUrl: '',
    githubUrl: '',
    personalWebsite: '',
    bio: '',
  });

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
  const branchOptions = [
    'CSE',
    'IT',
    'ECE',
    'EEE',
    'Mechanical',
    'Civil',
    'Chemical',
    'AI/DS',
    'Other',
  ];

  const jobTitleOptions = ['Software Engineer', 'Product', 'Design', 'Data', 'Management', 'Other'];
  const domainOptions = ['Web', 'Mobile', 'AI/ML', 'Data', 'Cloud', 'Security', 'FinTech', 'Other'];

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to={next} replace />;
  }

  if (user.profileCompleted) {
    return <Navigate to={next} replace />;
  }

  const parseCsv = (raw) => {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const isValidUrlOrEmpty = (v) => {
    if (v === undefined || v === null) return true;
    if (typeof v !== 'string') return false;
    if (v.trim() === '') return true;
    try {
      // Backend uses URL() validation too
      // eslint-disable-next-line no-new
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = () => {
    setError('');

    if (role === 'student') {
      const s = steps[stepIndex]?.key;
      if (s === 'academics') {
        if (!student.year) return 'Select your year';
        if (!student.branch) return 'Select your branch';
      }
      if (s === 'skills') {
        const skills = parseCsv(student.skillsRaw);
        const interests = parseCsv(student.interestsRaw);
        if (skills.length === 0) return 'Add at least 1 skill';
        if (interests.length === 0) return 'Add at least 1 interest';
      }
      return '';
    }

    if (role === 'alumni') {
      const s = steps[stepIndex]?.key;
      if (s === 'work') {
        if (!alumni.company.trim()) return 'Company is required';
        if (!alumni.position.trim()) return 'Job title is required';
        if (!alumni.domain) return 'Domain is required';
        if (alumni.yearsOfExperience === '' || Number.isNaN(Number(alumni.yearsOfExperience))) return 'Years of experience is required';
        if (!alumni.availability) return 'Availability is required';
        const caps = Object.entries(alumni.capabilities).filter(([, v]) => v).map(([k]) => k);
        if (caps.length === 0) return 'Select at least 1 capability';
      }
      if (s === 'presence') {
        if (!alumni.linkedinUrl.trim()) return 'LinkedIn URL is required';
        if (!isValidUrlOrEmpty(alumni.linkedinUrl)) return 'LinkedIn URL must be a valid URL (include https://)';
        if (!isValidUrlOrEmpty(alumni.githubUrl)) return 'GitHub URL must be a valid URL (include https://)';
        if (!isValidUrlOrEmpty(alumni.personalWebsite)) return 'Personal website must be a valid URL (include https://)';
      }
      if (s === 'bio') {
        if (!alumni.bio.trim()) return 'Short bio is required';
      }
      return '';
    }

    return '';
  };

  const canContinue = useMemo(() => validateStep() === '', [
    role,
    stepIndex,
    student.year,
    student.branch,
    student.skillsRaw,
    student.interestsRaw,
    alumni.company,
    alumni.position,
    alumni.domain,
    alumni.yearsOfExperience,
    alumni.availability,
    alumni.capabilities,
    alumni.linkedinUrl,
    alumni.githubUrl,
    alumni.bio,
  ]);

  const isLast = stepIndex === steps.length - 1;

  const goNext = async () => {
    const msg = validateStep();
    if (msg) {
      setError(msg);
      return;
    }

    if (!isLast) {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      let payload = {};

      if (role === 'student') {
        payload = {
          year: student.year,
          branch: student.branch,
          skills: parseCsv(student.skillsRaw),
          interests: parseCsv(student.interestsRaw),
          projects: parseCsv(student.projectsRaw),
        };
      } else {
        const caps = Object.entries(alumni.capabilities)
          .filter(([, v]) => v)
          .map(([k]) => k);

        payload = {
          company: alumni.company,
          position: alumni.position,
          domain: alumni.domain,
          yearsOfExperience: Number(alumni.yearsOfExperience),
          availability: alumni.availability,
          capabilities: caps,
          linkedinUrl: alumni.linkedinUrl,
          githubUrl: alumni.githubUrl,
          personalWebsite: alumni.personalWebsite,
          bio: alumni.bio,
        };
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.fields) && data.fields.length > 0) {
          setError(`${data.message || 'Missing/invalid required fields'}: ${data.fields.join(', ')}`);
        } else {
          setError((data && data.message) || 'Failed to save profile');
        }
        return;
      }

      const data = await res.json();
      if (data?.user) {
        updateUser(data.user);
      } else {
        updateUser({ profileCompleted: true });
      }

      navigate(next, { replace: true });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="bg-white rounded-2xl shadow-elev-2 border border-white/40 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-emerald-700">Profile setup</div>
              <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Complete your {role === 'alumni' ? 'alumni' : 'student'} profile</h1>
              <p className="mt-1 text-sm text-gray-600">This takes ~2 minutes. You’ll unlock the dashboard after completion.</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500">Progress</div>
              <div className="mt-1 text-sm font-extrabold text-gray-900">{progressPct}%</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{steps[stepIndex]?.title}</span>
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            {role === 'student' && steps[stepIndex]?.key === 'academics' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Year</label>
                  <select
                    value={student.year}
                    onChange={(e) => setStudent((s) => ({ ...s, year: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Branch</label>
                  <select
                    value={student.branch}
                    onChange={(e) => setStudent((s) => ({ ...s, branch: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select branch</option>
                    {branchOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {role === 'student' && steps[stepIndex]?.key === 'skills' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Skills</label>
                  <div className="mt-2 text-xs text-gray-500">Comma-separated. Example: React, Node, Figma</div>
                  <input
                    value={student.skillsRaw}
                    onChange={(e) => setStudent((s) => ({ ...s, skillsRaw: e.target.value }))}
                    placeholder="e.g. React, Node.js, SQL"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Interests</label>
                  <div className="mt-2 text-xs text-gray-500">Comma-separated. Example: AI, Startups, Open source</div>
                  <input
                    value={student.interestsRaw}
                    onChange={(e) => setStudent((s) => ({ ...s, interestsRaw: e.target.value }))}
                    placeholder="e.g. AI/ML, Startups, Open Source"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Preview</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {parseCsv(student.skillsRaw).slice(0, 8).map((s) => (
                      <span key={s} className={`${chipBase} border-emerald-200 bg-emerald-50 text-emerald-800`}>
                        {s}
                      </span>
                    ))}
                    {parseCsv(student.skillsRaw).length === 0 && (
                      <span className="text-sm text-gray-500">Add skills to preview chips</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {role === 'student' && steps[stepIndex]?.key === 'projects' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Projects (optional)</label>
                  <div className="mt-2 text-xs text-gray-500">Comma-separated project names or keywords.</div>
                  <input
                    value={student.projectsRaw}
                    onChange={(e) => setStudent((s) => ({ ...s, projectsRaw: e.target.value }))}
                    placeholder="e.g. Portfolio site, Attendance app"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  Tip: You can edit these later from your profile.
                </div>
              </div>
            )}

            {role === 'alumni' && steps[stepIndex]?.key === 'work' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Company name</label>
                  <input
                    value={alumni.company}
                    onChange={(e) => setAlumni((a) => ({ ...a, company: e.target.value }))}
                    placeholder="e.g. Google"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Role / Job title</label>
                  <select
                    value={alumni.position}
                    onChange={(e) => setAlumni((a) => ({ ...a, position: e.target.value }))}
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select job title</option>
                    {jobTitleOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">Domain</label>
                    <select
                      value={alumni.domain}
                      onChange={(e) => setAlumni((a) => ({ ...a, domain: e.target.value }))}
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select domain</option>
                      {domainOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800">Years of experience</label>
                    <input
                      type="number"
                      min="0"
                      value={alumni.yearsOfExperience}
                      onChange={(e) => setAlumni((a) => ({ ...a, yearsOfExperience: e.target.value }))}
                      placeholder="e.g. 4"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Availability</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {['Busy', 'Limited', 'Open'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAlumni((a) => ({ ...a, availability: v }))}
                        className={`${chipBase} justify-center ${alumni.availability === v ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Capabilities</label>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        ['mentor', 'Mentor'],
                        ['hiring', 'Hiring'],
                        ['speaker', 'Speaker'],
                        ['startupMentor', 'Startup mentor'],
                        ['researcher', 'Researcher'],
                      ]
                    ).map(([k, label]) => (
                      <label key={k} className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={alumni.capabilities[k]}
                          onChange={(e) =>
                            setAlumni((a) => ({
                              ...a,
                              capabilities: { ...a.capabilities, [k]: e.target.checked },
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {role === 'alumni' && steps[stepIndex]?.key === 'presence' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">LinkedIn URL</label>
                  <input
                    value={alumni.linkedinUrl}
                    onChange={(e) => setAlumni((a) => ({ ...a, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">GitHub URL (optional)</label>
                  <input
                    value={alumni.githubUrl}
                    onChange={(e) => setAlumni((a) => ({ ...a, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800">Personal website (optional)</label>
                  <input
                    value={alumni.personalWebsite}
                    onChange={(e) => setAlumni((a) => ({ ...a, personalWebsite: e.target.value }))}
                    placeholder="https://your-site.com"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  You can keep personal website empty.
                </div>
              </div>
            )}

            {role === 'alumni' && steps[stepIndex]?.key === 'bio' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">Short bio</label>
                  <textarea
                    value={alumni.bio}
                    onChange={(e) => setAlumni((a) => ({ ...a, bio: e.target.value }))}
                    rows={5}
                    placeholder="What can students reach out to you for?"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue || submitting}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 shadow hover:opacity-95 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : isLast ? 'Finish setup' : 'Continue'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Note: Until you complete your profile, dashboard and features stay locked.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
