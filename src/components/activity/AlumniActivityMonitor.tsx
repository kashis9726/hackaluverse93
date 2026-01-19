import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';

interface Activity {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    role: string;
  };
  type: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface Stats {
  totalQuestions: number;
  totalAnswers: number;
  totalNewUsers: number;
  recentActivity: Activity[];
}

const AlumniActivityMonitor: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activity/qa?limit=10', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          const questions = data.activities.filter((a: any) => a.type === 'question_asked');
          const answers = data.activities.filter((a: any) => a.type === 'answer_posted');

          setStats({
            totalQuestions: questions.length,
            totalAnswers: answers.length,
            totalNewUsers: 0,
            recentActivity: data.activities.slice(0, 5)
          });
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh every 15 seconds
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Questions Asked</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalQuestions}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 uppercase tracking-wide font-semibold">Answers Given</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.totalAnswers}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Last Updated</p>
              <p className="text-sm font-mono text-purple-900 mt-1">{lastUpdate}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-900">Recent Student Activity</h3>
        </div>

        <div className="space-y-3">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0">
                  {activity.userId.profileImage ? (
                    <img
                      src={activity.userId.profileImage}
                      alt={activity.userId.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                      {activity.userId.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.userId.name}</span>
                    {' '}
                    {activity.type === 'question_asked' && 'asked a question'}
                    {activity.type === 'answer_posted' && 'provided an answer'}
                    {activity.type === 'blog_created' && 'published a blog'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniActivityMonitor;
