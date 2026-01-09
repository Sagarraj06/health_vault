import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { api } from './../../axios.config.js';
import socket from "../../socket.js";
import { useNavigate } from "react-router-dom";

const Notibell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications form MongoDB
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(notif => !notif.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/mark-single-read/${id}`);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Or get from context if available
      if (userId) {
        await api.patch(`notifications/mark-all-read/${userId}`);
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // 1s animation
  };

  useEffect(() => {
    const handleNewNotification = (data) => {
      console.log("🔔 New notification:", data);
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [data.notification, ...prev]);
      triggerAnimation();
    };

    const handleNewLeaveNotification = (data) => {
      console.log("📬 New leave notification:", data);
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [data.notification, ...prev]);
      triggerAnimation();
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("newLeaveNotification", handleNewLeaveNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("newLeaveNotification", handleNewLeaveNotification);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'leave': return 'jx';
      case 'message': return '✉️';
      case 'alert': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Icon */}
      <div
        className={`relative cursor-pointer p-2 rounded-full hover:bg-white/10 transition-all duration-300 ${isAnimating ? 'animate-wiggle' : ''}`}
        onClick={toggleDropdown}
      >
        <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-primary' : 'text-gray-300'} transition-colors duration-300`} />

        {/* Badge */}
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card rounded-xl shadow-2xl overflow-hidden border border-white/10 animate-fade-in-up origin-top-right">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-dark/95">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="text-2xl mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at || notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-black/40 text-center">
            <button className="text-xs text-gray-400 hover:text-white transition-colors">
              View All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notibell;