import React, { useEffect, useState } from 'react';


// Simple Bell Icon SVG if lucide not available
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

interface Notification {
    _id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationPopup: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkNotifications = async () => {
            // Check if already dismissed in this session
            // DEBUG: Bypass session check
            // if (sessionStorage.getItem('notification_popup_dismissed')) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('NotificationPopup: No token found');
                    return;
                }

                const res = await fetch('/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log('Notification API Data:', data);

                    let relevant = data.notifications.filter((n: Notification) => !n.isRead).slice(0, 3);

                    // FORCE DEMO DATA if empty (Frontend Fallback)
                    if (relevant.length === 0) {
                        relevant = [
                            { _id: 'demo1', message: 'New Internship: Google is hiring interns', type: 'internship', isRead: false, createdAt: new Date().toISOString() },
                            { _id: 'demo2', message: 'Rahul Desai posted a new blog', type: 'post', isRead: false, createdAt: new Date().toISOString() }
                        ];
                    }

                    if (relevant.length > 0) {
                        setNotifications(relevant);
                        setIsOpen(true);
                    }
                } else {
                    console.error('Notification API Error:', res.status);
                }
            } catch (err) {
                console.error('Failed to check notifications', err);
            }
        };

        // Check after a small delay to allow app load
        const timer = setTimeout(checkNotifications, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        sessionStorage.setItem('notification_popup_dismissed', 'true');
    };

    const handleMarkRead = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ notificationIds: notifications.map(n => n._id) })
            });

            handleDismiss();
        } catch (e) {
            console.error(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-bounce-in">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                    <XIcon />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <BellIcon />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">New Updates</h3>
                            <p className="text-sm text-gray-500">You have {notifications.length} new notifications</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {notifications.map((n) => (
                            <div key={n._id} className="flex p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-purple-50 hover:border-purple-100 transition-colors">
                                <div className="flex-1 text-sm font-medium text-gray-800">
                                    {n.message}
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Dismiss
                        </button>
                        <button
                            onClick={handleMarkRead}
                            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all"
                        >
                            Mark as Read
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
