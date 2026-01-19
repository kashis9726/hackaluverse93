import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Building2, GraduationCap, Award, MapPin, Calendar, Star, ArrowLeft } from 'lucide-react';

const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, getChatRoom } = useApp();
  const { user } = useAuth();

  const alumni = users.find(u => u.id === id);

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
    alert('Chat started. Open the messages from the top bar to talk.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-2xl">
            {alumni.profileImage ? (
              <img src={alumni.profileImage} alt={alumni.name} className="w-full h-full object-cover" />
            ) : (
              alumni.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
              {alumni.isVerified && (
                <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 font-medium">
                  Verified Alumni
                </span>
              )}
            </div>

            <div className="space-y-2 text-gray-600">
              {alumni.position && <p className="text-lg">{alumni.position}</p>}
              {alumni.company && (
                <p className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {alumni.company}
                </p>
              )}
              {alumni.department && (
                <p className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {alumni.department}
                </p>
              )}
              {alumni.graduationYear && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Class of {alumni.graduationYear}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                <span>{alumni.points} contribution points</span>
              </div>
              {user && user.id !== alumni.id && (
                <button
                  onClick={startChat}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {alumni.bio && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700 leading-relaxed">{alumni.bio}</p>
        </div>
      )}

      {/* Skills */}
      {alumni.skills && alumni.skills.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {alumni.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {alumni.badges && alumni.badges.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alumni.badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800 font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h2>
        <div className="space-y-3 text-gray-600">
          {alumni.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{alumni.location}</span>
            </div>
          )}
          <p className="text-sm">Connect via chat to get in touch directly.</p>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
