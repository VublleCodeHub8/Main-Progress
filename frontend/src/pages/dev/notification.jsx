import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Bell, Search, Power, Shield, Clock, Activity, MessageCircle, Eye } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Popup from '@/components/Popup';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Notifications = () => {
    const token = useSelector((state) => state.misc.token);
    const [searchTerm, setSearchTerm] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:3000/dev/notifications", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.token}`
                    }
                });
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [token, refreshTrigger]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/dev/notification/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`
                }
            });

            if (response.ok) {
                setNotifications(notifications.filter(notification => notification._id !== id));
                setPopupMessage("Notification deleted successfully");
                setPopupType("success");
                setPopupVisible(true);
            } else {
                setPopupMessage("Failed to delete notification");
                setPopupType("error");
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
            setPopupMessage("Error deleting notification");
            setPopupType("error");
            setPopupVisible(true);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/dev/notification/${id}/read`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`
                }
            });

            if (response.ok) {
                setNotifications(notifications.map(notification => notification._id === id ? { ...notification, read: true } : notification));
                setPopupMessage("Notification marked as read");
                setPopupType("success");
                setPopupVisible(true);
            } else {
                setPopupMessage("Failed to mark notification as read");
                setPopupType("error");
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
            setPopupMessage("Error marking notification as read");
            setPopupType("error");
            setPopupVisible(true);
        }
    };

    const filteredNotifications = notifications.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            {/* Enhanced Header Section */}
            <div className="mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-5">
                            {/* Single Prominent Icon */}
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                                         flex items-center justify-center shadow-lg transform 
                                         hover:scale-105 transition-transform duration-300 group">
                                <Bell className="h-8 w-8 text-white transform group-hover:-rotate-12 transition-transform" />
                            </div>

                            {/* Title and Subtitle */}
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Notifications
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Activity className="h-4 w-4" />
                                    Track and manage system notifications
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dev"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                         bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                                         transition-all duration-200 shadow-sm hover:shadow group"
                            >
                                <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Dashboard
                            </Link>
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                                         bg-black text-white rounded-lg hover:bg-gray-800 
                                         transition-all duration-200 shadow-sm hover:shadow group"
                            >
                                <Power className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Logout
                            </Link>
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="mt-6 max-w-2xl">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 text-sm
                                         border border-gray-300 rounded-lg
                                         focus:ring-2 focus:ring-black focus:border-transparent
                                         placeholder-gray-400 transition-all duration-200
                                         bg-gray-50 hover:bg-white focus:bg-white"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="text-sm text-gray-400">
                                    Press '/' to focus
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <Card className="bg-white shadow-lg border border-gray-100">
                    <CardContent className="p-0">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'} found
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-gray-500" />
                                                Title
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="h-4 w-4 text-gray-500" />
                                                Message
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                Time
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                    {filteredNotifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Bell className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500 font-medium">No notifications found</p>
                                                    <p className="text-gray-400 text-sm">You're all caught up!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNotifications.map((notification) => (
                                            <tr key={notification._id} className="hover:bg-gray-50/60 transition-all duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-blue-50'} 
                                                                    flex items-center justify-center shadow-sm`}>
                                                            <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-500' : 'text-blue-500'}`} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                                {notification.title}
                                                                {!notification.read && (
                                                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500">ID: {notification._id.slice(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100">
                                                            <Clock className="h-4 w-4 text-green-500" />
                                                            <span className="text-sm font-medium text-green-700">
                                                                {new Date(notification.time).toLocaleDateString()} at{" "}
                                                                {new Date(notification.time).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification._id)}
                                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                title="Mark as read"
                                                            >
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification._id)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 
                                                                     bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete notification"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <Popup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
                type={popupType}
            />
        </div>
    );
};

export default Notifications;