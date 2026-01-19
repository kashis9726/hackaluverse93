import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import ActivityFeed from '../activity/ActivityFeed';
import AlumniActivityMonitor from '../activity/AlumniActivityMonitor';
import RecommendationList from '../recommendations/RecommendationList';
import {
  TrendingUp,
  Users,
  Calendar,
  Trophy,
  BookOpen,
  Lightbulb,
  RefreshCw,
  Target,
  Briefcase,
  MapPin,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { posts, events, users } = useApp();

  // ... (keep existing stats logic) ...
  // Get recent job opportunities for students
  const recentOpportunities = posts
    .filter(p => p.type === 'job')
    .slice(0, 3);

  const stats = [
    {
      title: 'Active Connections',
      value: users.filter(u => u.isOnline).length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Upcoming Events',
      value: events.filter(e => new Date(e.date) > new Date()).length,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Your Points',
      value: user?.points || 0,
      icon: Trophy,
      color: 'bg-yellow-500',
      change: `+${Math.floor(Math.random() * 50)}`
    },
    {
      title: 'Recent Posts',
      value: posts.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+8%'
    }
  ];

  const recentActivity = [
    { type: 'startup', content: 'New startup "EcoTrack" posted in Startup Hub', time: '2 hours ago' },
    { type: 'event', content: 'Tech Career Fair event is starting soon', time: '4 hours ago' },
    { type: 'mentorship', content: 'Sarah Johnson accepted your mentorship request', time: '1 day ago' },
    { type: 'qa', content: 'Your question about React hooks got 3 new answers', time: '2 days ago' }
  ];

  const quickActions = user?.role === 'student' ? [
    { title: 'Find Mentors', description: 'Connect with experienced alumni', icon: Users, action: 'mentorship' },
    { title: 'Join Events', description: 'Upcoming seminars and workshops', icon: Calendar, action: 'events' },
    { title: 'Share Startup', description: 'Showcase your innovative ideas', icon: Lightbulb, action: 'startups' },
    { title: 'Solve Problems', description: 'Take on real industry challenges', icon: RefreshCw, action: 'reverse-pitching' }
  ] : [
    { title: 'Write a Blog', description: 'Share industry insights', icon: BookOpen, action: 'blogs' },
    { title: 'Review Startups', description: 'Help students with feedback', icon: Lightbulb, action: 'startups' },
    { title: 'Host Events', description: 'Organize knowledge sessions', icon: Calendar, action: 'events' },
    { title: 'Post Problems', description: 'Share real industry challenges', icon: Target, action: 'reverse-pitching' }
  ];

  const topContributors = users
    .filter(u => u.id !== user?.id)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'student'
              ? 'Ready to learn and grow with the alumni network?'
              : 'Ready to mentor and share your expertise?'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {user?.badges && user.badges.length > 0 && (
            <div className="flex items-center space-x-2">
              {user.badges.slice(0, 3).map((badge, index) => (
                <span key={index} className="text-lg">{badge}</span>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              if (confirm('This will clear all demo data (posts, events, questions, etc.) and refresh the page. Continue?')) {
                const keysToRemove = ['posts', 'startups', 'reversePitches', 'events', 'questions', 'chatRooms', 'users'];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                window.location.reload();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            title="Clear all demo data from localStorage"
          >
            Clear Demo Data
          </button>
        </div>
      </div>

      {/* Recommended Alumni - New Feature */}
      <RecommendationList />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h2>
          <div className="space-y-3">
            {topContributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {contributor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{contributor.name}</p>
                    <p className="text-xs text-gray-500">{contributor.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-gray-900">{contributor.points}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Opportunities - Students Only */}
      {user?.role === 'student' && recentOpportunities.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Opportunities</h2>
            <a
              href="/internships"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {recentOpportunities.map((post) => {
              const lines = post.content.split('\n');
              const header = lines[0] || '';
              const typeMatch = header.match(/•\s*(\w+)/);
              const typeLabel = typeMatch ? typeMatch[1] : 'Open';
              const companyMatch = header.match(/@\s*([^•]+)/);
              const company = companyMatch ? companyMatch[1].trim() : 'Company';
              const title = header.split('@')[0].trim();

              return (
                <div
                  key={post.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() => window.location.href = '/internships'}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                        <p className="text-sm text-gray-600">{company}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>Posted by {post.author?.name || 'Alumni'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeLabel.toLowerCase().includes('intern')
                      ? 'bg-amber-100 text-amber-700'
                      : typeLabel.toLowerCase().includes('freelance')
                        ? 'bg-fuchsia-100 text-fuchsia-700'
                        : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {typeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm">{activity.content}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      {user?.role === 'alumni' ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Activity Monitor</h2>
          <AlumniActivityMonitor />
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Community Activity Feed</h2>
          <ActivityFeed limit={20} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;