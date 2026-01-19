import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, MessageSquare, PenTool, Users, Zap } from 'lucide-react';

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
  visibility: string;
}

const ActivityFeed: React.FC<{ limit?: number }> = ({ limit = 30 }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/activity/feed?limit=${limit}`,
          {
            headers: user ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {}
          }
        );

        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, [user, limit]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question_asked':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'answer_posted':
        return <PenTool className="h-4 w-4 text-green-500" />;
      case 'blog_created':
        return <Zap className="h-4 w-4 text-amber-500" />;
      case 'user_signup':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'question_asked':
        return 'bg-blue-50 border-blue-200';
      case 'answer_posted':
        return 'bg-green-50 border-green-200';
      case 'blog_created':
        return 'bg-amber-50 border-amber-200';
      case 'user_signup':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No activities to show yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className={`rounded-lg border p-4 ${getActivityColor(activity.type)} hover:shadow-md transition`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {activity.userId.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activity.userId.role === 'alumni' && (
                      <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded mr-2">
                        Alumni
                      </span>
                    )}
                    {activity.userId.role === 'student' && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                        Student
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-900 mt-2">
                {activity.title}
              </p>

              {activity.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {activity.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
