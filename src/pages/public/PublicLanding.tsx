import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Calendar, ShieldCheck } from 'lucide-react';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-[28rem] w-[28rem] rounded-full bg-emerald-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-14 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" /> Alumni ↔ Students, one platform
              </div>

              <h1 className="mt-5 text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
                <span className="block animate-fade-in-up">Unlock your future with</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-800 animate-gradient-x animate-bounce font-extrabold">
                  Alumni Power.
                </span>
                <span className="block text-lg font-semibold text-emerald-700 mt-2 animate-fade-in animate-delay-500">Mentorship, jobs, events & real connections await!</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl">
                Mentorship, opportunities, and events — built for real connections.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 shadow hover:opacity-95 font-semibold"
                >
                  Get started
                </button>
                <button
                  onClick={() => navigate('/blogs')}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-800 bg-white hover:bg-gray-50"
                >
                  Explore as guest
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  See features
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" />
              <div className="relative rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-elev-2">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
                  alt="Alumni collaboration"
                  className="h-80 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Built for momentum</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">Less noise, more real outcomes.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-white shadow-elev-1 border border-gray-200 p-6">
              <Users className="h-5 w-5 text-emerald-700" />
              <div className="mt-3 text-lg font-bold text-gray-900">Mentorship</div>
              <div className="mt-1 text-gray-600">Find alumni by skills and domain — message instantly.</div>
            </div>
            <div className="rounded-2xl bg-white shadow-elev-1 border border-gray-200 p-6">
              <Briefcase className="h-5 w-5 text-emerald-700" />
              <div className="mt-3 text-lg font-bold text-gray-900">Opportunities</div>
              <div className="mt-1 text-gray-600">Internships and roles shared by alumni and peers.</div>
            </div>
            <div className="rounded-2xl bg-white shadow-elev-1 border border-gray-200 p-6">
              <Calendar className="h-5 w-5 text-emerald-700" />
              <div className="mt-3 text-lg font-bold text-gray-900">Events & Q&A</div>
              <div className="mt-1 text-gray-600">Workshops, webinars, and answers from real alumni.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-2">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 p-6 sm:p-8 text-white shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold">Ready to join AluVerse?</h2>
              <p className="mt-2 text-white/90 max-w-2xl">
                Create your account to ask questions, register for events, and connect with alumni who’ve been where you are.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-5 py-3 rounded-lg bg-white text-emerald-800 font-semibold hover:bg-emerald-50"
              >
                Get started
              </button>
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="px-5 py-3 rounded-lg border border-white/30 bg-white/10 font-semibold hover:bg-white/15"
              >
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicLanding;
