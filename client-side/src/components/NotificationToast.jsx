import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { X, Bell, MessageCircle, Trophy, Shield } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, clearNotification } = useSocket();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      setVisibleNotifications(prev => [...prev, latest]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== latest.id));
        clearNotification(latest.id);
      }, 5000);
    }
  }, [notifications, clearNotification]);

  const getIcon = (type) => {
    switch (type) {
      case 'revival': return <Trophy className="w-5 h-5 text-green-400" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'admin': return <Shield className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleClose = (id) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    clearNotification(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg max-w-sm animate-slide-in"
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-200 font-medium">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => handleClose(notification.id)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;