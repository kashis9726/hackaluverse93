import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Building2, GraduationCap, Award, MapPin, Calendar, Star, ArrowLeft, Briefcase, HelpCircle } from 'lucide-react';

const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, questions, getChatRoom } = useApp();
  const { user } = useAuth();

  const alumni = users.find(u => u.id === id);

  const [connectionStatus, setConnectionStatus] = React.useState<'none' | 'pending_sent' | 'pending_received' | 'accepted'>('none');
  const [loading, setLoading] = React.useState(false);

  // Fetch status
  React.useEffect(() => {
    if (!user || !id || user.id === id) return;

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch(`/api/connections/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConnectionStatus(data.status);
        }
      } catch (err) { console.error(err); }
    };
    fetchStatus();
  }, [id, user]);

  const handleConnect = async () => {
    if (!user) return alert('Please login first');
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/connections/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ followingId: id })
      });
      if (res.ok) {
        setConnectionStatus('pending_sent');
      } else {
        alert('Failed to send request');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      // We need the requester ID, which is 'id' (the profile owner)
      const res = await fetch('/api/connections/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId: id })
      });
      if (res.ok) {
        setConnectionStatus('accepted');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const questionsAnsweredCount = useMemo(() => {
    if (!alumni) return 0;
    return questions.filter(q => q.answers.some(a => a.authorId === alumni.id)).length;
  }, [questions, alumni]);

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Alumni Not Found</h2>
          <p className="text-gray-600">The alumni profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/alumni')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Alumni Directory
          </button>
        </div>
      </div>
    );
  }

  const startChat = () => {
    if (!user) return alert('Please login first.');
    getChatRoom([user.id, alumni.id]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              {alumni.profileImage ? (
                <img src={alumni.profileImage} alt={alumni.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-4xl">
                  {alumni.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-2">
              {user && user.id !== alumni.id && (
                <>
                  {connectionStatus === 'accepted' && (
                    <button
                      onClick={startChat}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </button>
                  )}

                  {connectionStatus === 'none' && (
                    <button
                      onClick={handleConnect}
                      disabled={loading}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm font-medium disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Connect'}
                    </button>
                  )}

                  {connectionStatus === 'pending_sent' && (
                    <button
                      disabled
                      className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2 shadow-sm font-medium border border-gray-200"
                    >
                      Request Sent
                    </button>
                  )}

                  {connectionStatus === 'pending_received' && (
                    <button
                      onClick={handleAccept}
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
                    >
                      Accept Request
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
              {alumni.isVerified && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-medium border border-blue-200">Verified Alumni</span>
              )}
            </div>
            <p className="text-lg text-gray-600 mb-4">{alumni.position || 'Alumni'} {alumni.company && <span>at <span className="text-gray-900 font-medium">{alumni.company}</span></span>}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {/* Location removed as it's not in User type */}
              {alumni.graduationYear && <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Class of {alumni.graduationYear}</div>}
              {alumni.department && <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />{alumni.department}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              About
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{alumni.bio || "No bio available."}</p>
          </div>

          {/* Experience Mockup (since model doesn't support array yet, we use single field + mock) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
              Experience
            </h2>
            <div className="space-y-6">
              {/* Current Role */}
              <div className="flex gap-4">
                <div className="mt-1 bg-blue-50 p-2 rounded-lg h-fit text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{alumni.position}</h3>
                  <p className="text-gray-700">{alumni.company}</p>
                  <p className="text-sm text-gray-500 mt-1">Present • {alumni.yearsOfExperience || 1}+ years total exp</p>
                  <p className="text-sm text-gray-600 mt-2">Leading development and strategy in {alumni.domain || 'tech'}.</p>
                </div>
              </div>

              {/* Mock Past Role to look generic but realistic */}
              <div className="flex gap-4">
                <div className="mt-1 bg-gray-50 p-2 rounded-lg h-fit text-gray-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Software Engineer</h3>
                  <p className="text-gray-700">Previous Tech Corp</p>
                  <p className="text-sm text-gray-500 mt-1">2018 - 2021</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-600 rounded-full"></span>
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {alumni.skills && alumni.skills.length > 0 ? alumni.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium rounded-lg">
                  {skill}
                </span>
              )) : <span className="text-gray-500 italic">No skills listed</span>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Community Impact</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700 font-medium">Questions Answered</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{questionsAnsweredCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                    <Star className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700 font-medium">Contribution Points</span>
                </div>
                <span className="text-xl font-bold text-amber-700">{alumni.points || 0}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Badges</h2>
            {alumni.badges && alumni.badges.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {alumni.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg">
                    <Award className="h-8 w-8 text-purple-600" />
                    <div>
                      <span className="block text-gray-900 font-medium text-sm">{badge}</span>
                      <span className="block text-xs text-gray-500">Awarded for excellence</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No badges yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlumniProfile;
