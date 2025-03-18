import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Trash2, Mail, MessageSquare, User, Calendar,
  Search, Loader2, AlertCircle, Power, Shield,
  Activity, Clock, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Popup from '@/components/Popup';

const AdminContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  
  const token = useSelector((state) => state.misc.token);

  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/getAllContactUs', {
        headers: {
          'Authorization': `Bearer ${token.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setPopupMessage(error.message);
      setPopupType('error');
      setPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  // Delete message handler
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/deleteContactUs`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(msg => msg._id !== id));
      setPopupMessage('Message deleted successfully');
      setPopupType('success');
      setPopupVisible(true);
    } catch (error) {
      setPopupMessage(error.message);
      setPopupType('error');
      setPopupVisible(true);
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quick stats calculation
  const getQuickStats = () => ({
    totalMessages: messages.length,
    todayMessages: messages.filter(msg => isToday(new Date(msg.createdAt))).length,
    uniqueUsers: new Set(messages.map(msg => msg.email)).size,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              {/* Header Icon */}
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                           flex items-center justify-center shadow-lg transform 
                           hover:scale-105 transition-transform duration-300 group">
                <MessageCircle className="h-8 w-8 text-white transform group-hover:-rotate-12 transition-transform" />
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Contact Messages
                </h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  Manage and respond to contact form submissions
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
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
                placeholder="Search messages..."
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

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStat 
              title="Total Messages" 
              value={getQuickStats().totalMessages}
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <QuickStat 
              title="Today's Messages" 
              value={getQuickStats().todayMessages}
              icon={<Calendar className="h-5 w-5" />}
            />
            <QuickStat 
              title="Unique Users" 
              value={getQuickStats().uniqueUsers}
              icon={<User className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Message History Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            Message History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">No contact messages match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50/80">
                  <tr>
                    <TableHeader title="Sender Info" />
                    <TableHeader title="Subject" />
                    <TableHeader title="Message" />
                    <TableHeader title="Timestamp" />
                    <TableHeader title="Actions" align="right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {filteredMessages.map((message) => (
                    <tr key={message._id} className="hover:bg-gray-50/60 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 
                                      flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{message.name}</div>
                            <a href={`mailto:${message.email}`} 
                               className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {message.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex px-3 py-1.5 rounded-full text-sm font-medium
                                     bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 
                                     border border-indigo-100 shadow-sm">
                          {message.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group max-w-xs">
                          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3
                                       transition-all duration-200">
                            {message.message.length > 100 ? (
                              <>
                                <div className="line-clamp-2 group-hover:hidden">
                                  {message.message}
                                </div>
                                <div className="hidden group-hover:block">
                                  {message.message}
                                </div>
                                <button className="absolute bottom-1 right-1 px-2 py-1 text-xs
                                               bg-white text-gray-500 rounded-md shadow-sm
                                               group-hover:hidden">
                                  Show More
                                </button>
                              </>
                            ) : (
                              message.message
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium text-emerald-600 bg-emerald-50 
                                       px-2 py-1 rounded-md inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(message.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                                   bg-red-50 text-red-600 hover:bg-red-600 hover:text-white
                                   transition-all duration-200 border border-red-100 hover:border-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={popupType}
      />
    </div>
  );
};

// Helper Components
const QuickStat = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm 
                 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="bg-gray-50 p-2 rounded-lg">
        {React.cloneElement(icon, { className: "h-5 w-5 text-gray-600" })}
      </div>
    </div>
    <p className="text-3xl font-bold mt-3 text-gray-900">{value}</p>
  </div>
);

const TableHeader = ({ title, align = "left" }) => (
  <th className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
    {title}
  </th>
);

// Helper function to check if date is today
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export default AdminContactUs;
