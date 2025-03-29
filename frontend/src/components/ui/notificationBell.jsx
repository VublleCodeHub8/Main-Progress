import { useState, useEffect } from "react";
import { Bell, Clock, CheckCircle, AlertCircle, X } from "lucide-react";
import { useSelector } from "react-redux";

const NotificationPopover = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-96 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-40 overflow-hidden">
            {content}
          </div>
        </>
      )}
    </div>
  );
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/user/topnotification", {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        });
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();

    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token.token]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:3000/user/notification/markread/${notificationId}`, {
        method: 'PUT',
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost:3000/user/notification/markallread", {
        method: 'PUT',
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDismiss = async (notificationId) => {
    try {
      await fetch(`http://localhost:3000/user/notification/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n._id !== notificationId)
      );
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const notificationsList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsList.filter(n => !n.read).length;

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <NotificationPopover
      content={
        <div className="divide-y divide-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                    {unreadCount} unread
                  </span>
                )}
                <button 
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Mark all as read"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notificationsList.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">No new notifications</p>
                <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notificationsList.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`group relative p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/40' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-400">
                          {getTimeAgo(notification.time)}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      title="Dismiss"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification._id);
                      }}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      }
    >
      <button 
        className="relative group p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
            {unreadCount}
          </span>
        )}
      </button>
    </NotificationPopover>
  );
};

export default NotificationBell;