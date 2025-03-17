import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData, setEditMode } from "@/store/userSlice";
import { 
  User, Mail, Edit, Camera, X, Save, Loader2, UserCircle, FileEdit,
  Github, Twitter, Linkedin, Link2, Calendar, Activity, Container,
  Clock, MapPin, Briefcase, Globe, Plus, DollarSign
} from "lucide-react";
import Popup from "@/components/Popup";
import { Link } from 'react-router-dom';
import { subDays, format, parseISO } from 'date-fns';

const generateMockContributions = () => {
  const contributions = {};
  const today = new Date();
  
  // Generate last 365 days of contributions with different patterns
  for (let i = 0; i < 365; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    
    // Create patterns of activity
    if (i % 7 === 0) { // Heavy activity on weekends
      contributions[date] = Math.floor(Math.random() * 8) + 5; // 5-12 contributions
    } else if (i % 3 === 0) { // Medium activity every third day
      contributions[date] = Math.floor(Math.random() * 4) + 2; // 2-5 contributions
    } else if (i % 2 === 0) { // Light activity on alternate days
      contributions[date] = Math.floor(Math.random() * 2) + 1; // 1-2 contributions
    } else {
      contributions[date] = Math.random() > 0.7 ? 1 : 0; // 30% chance of 1 contribution
    }

    // Add some "hot streaks" - periods of high activity
    if (i > 30 && i < 45) { // Two weeks of high activity
      contributions[date] = Math.floor(Math.random() * 7) + 6; // 6-12 contributions
    }
  }

  return contributions;
};

const ContributionHeatmap = ({ contributions }) => {
  // Generate last 365 days of data
  const generateHeatmapData = () => {
    const data = {};
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      data[date] = contributions[date] || 0;
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const weeks = [];
  let currentWeek = [];
  
  // Create weeks array for grid display
  Object.entries(heatmapData).forEach(([date, count], index) => {
    currentWeek.push({ date, count });
    if (currentWeek.length === 7 || index === Object.keys(heatmapData).length - 1) {
      weeks.unshift([...currentWeek]);
      currentWeek = [];
    }
  });

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-emerald-100 hover:bg-emerald-200';
    if (count <= 4) return 'bg-emerald-200 hover:bg-emerald-300';
    if (count <= 6) return 'bg-emerald-300 hover:bg-emerald-400';
    if (count <= 8) return 'bg-emerald-400 hover:bg-emerald-500';
    if (count <= 10) return 'bg-emerald-500 hover:bg-emerald-600';
    return 'bg-emerald-600 hover:bg-emerald-700';
  };

  // Calculate total contributions and longest streak
  const totalContributions = Object.values(contributions).reduce((sum, count) => sum + count, 0);
  const calculateLongestStreak = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    Object.values(contributions).forEach(count => {
      if (count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    return longestStreak;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          Contribution Activity
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-gray-600">{totalContributions} contributions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-gray-600">Longest streak: {calculateLongestStreak()} days</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex gap-1 mb-2 text-xs text-gray-400">
            <div className="w-8" />
            <div className="flex-1 grid grid-cols-[repeat(52,1fr)] gap-1">
              {weeks.map((_, weekIndex) => (
                weekIndex % 4 === 0 && (
                  <div key={weekIndex} className="text-center col-span-4">
                    {format(parseISO(weeks[weekIndex][0].date), 'MMM')}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            <div className="grid grid-rows-7 gap-1 text-xs text-gray-400 pr-2">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>
            <div className="flex-1 grid grid-cols-[repeat(53,1fr)] gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {week.map(({ date, count }, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getColor(count)} 
                                transition-all duration-200 cursor-pointer
                                hover:ring-2 hover:ring-black hover:ring-offset-1
                                transform hover:scale-110`}
                      title={`${format(parseISO(date), 'MMM d, yyyy')}: ${count} contribution${count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Less</span>
              {[0, 2, 4, 6, 8, 10].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColor(level)}
                            transition-transform hover:scale-110 cursor-help`}
                  title={`${level} contributions`}
                />
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status, isEditMode } = useSelector((state) => state.user);
  const token = useSelector((state) => state.misc.token);

  const [updatedUser, setUpdatedUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  // Add new state for social links and additional info
  const [socialLinks, setSocialLinks] = useState({
    github: user?.github || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
    website: user?.website || ""
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    location: user?.location || "",
    occupation: user?.occupation || "",
    joinedDate: user?.joinedDate || new Date().toISOString()
  });

  // Modify userStats to include billing
  const userStats = [
    {
      label: "Total Bill",
      value: user?.billingInfo?.amount ? `$${user.billingInfo.amount.toFixed(2)}` : "$0.00",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      color: "bg-green-50"  // Add a subtle background color
    },
    { label: "Total Containers", value: 12, icon: <Container className="h-4 w-4" /> },
    { label: "Active Time", value: "127h", icon: <Clock className="h-4 w-4" /> },
  ];

  const recentActivity = [
    { type: "container", action: "Created new container", time: "2 hours ago" },
    { type: "template", action: "Updated template settings", time: "1 day ago" },
    { type: "profile", action: "Updated profile picture", time: "3 days ago" }
  ];

  // Replace the mockContributions with the generated data
  const mockContributions = generateMockContributions();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        username: user.username || "",
        bio: user.bio || "",
        profilePic: user.profilePicUrl || ""
      });
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setPopupMessage("File size should be less than 5MB");
        setPopupType("error");
        setPopupVisible(true);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser((prevUser) => ({ ...prevUser, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = async () => {
    if (!updatedUser.username || !updatedUser.username.trim()) {
      setPopupMessage("Username cannot be empty!");
      setPopupType("error");
      setPopupVisible(true);
      return;
    }

    try {
      await dispatch(updateUserData({ token, updatedUser, selectedFile })).unwrap();
      setPopupMessage("Profile updated successfully!");
      setPopupType("success");
      setPopupVisible(true);
      dispatch(setEditMode(false));
    } catch (error) {
      setPopupMessage("Failed to update profile");
      setPopupType("error");
      setPopupVisible(true);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="text-gray-600 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Existing Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="absolute -bottom-16 left-6">
                  <div className="relative">
                    <img
                      src={updatedUser.profilePic || user?.profilePicUrl || "https://github.com/shadcn.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover"
                    />
                    {!isEditMode && (
                      <button
                        onClick={() => dispatch(setEditMode(true))}
                        className="absolute bottom-2 right-2 p-2 bg-black rounded-full shadow-lg
                                 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 px-6 pb-6">
                {isEditMode ? (
                  <div className="space-y-6 animate-slideIn">
                    {/* Edit Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={updatedUser.username || ""}
                          onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                   focus:ring-black focus:border-transparent transition-colors"
                          placeholder="Enter username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={updatedUser.bio || ""}
                          onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                   focus:ring-black focus:border-transparent transition-colors resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 
                                         rounded-lg cursor-pointer hover:bg-gray-100 transition-colors
                                         border border-gray-300">
                            <Camera className="h-5 w-5" />
                            <span>Choose Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                          onClick={() => dispatch(setEditMode(false))}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100
                                   rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={onSave}
                          className="px-4 py-2 text-sm font-medium text-white bg-black
                                   rounded-lg hover:bg-gray-800 transition-colors
                                   flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {user?.bio || "No bio added yet."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Contribution Heatmap */}
            <ContributionHeatmap contributions={mockContributions} />

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4">
              {userStats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.color || 'bg-white'} rounded-xl p-4 shadow-md 
                             hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-gray-500 ${index === 0 ? 'text-green-500' : ''}`}>
                      {stat.icon}
                    </span>
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className={`text-sm ${index === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {activity.type === 'container' && <Container className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'template' && <FileEdit className="h-4 w-4 text-green-500" />}
                      {activity.type === 'profile' && <User className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info & Social Links */}
          <div className="space-y-8">
            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{additionalInfo.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{additionalInfo.occupation || "Occupation not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Joined {new Date(additionalInfo.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-4">
                {Object.entries(socialLinks).map(([platform, link]) => (
                  <div key={platform} className="flex items-center gap-3">
                    {platform === 'github' && <Github className="h-5 w-5 text-gray-400" />}
                    {platform === 'twitter' && <Twitter className="h-5 w-5 text-gray-400" />}
                    {platform === 'linkedin' && <Linkedin className="h-5 w-5 text-gray-400" />}
                    {platform === 'website' && <Globe className="h-5 w-5 text-gray-400" />}
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ) : (
                      <span className="text-gray-400">Add {platform}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/containers"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium 
                           text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 
                           transition-colors duration-200"
                >
                  <Container className="h-4 w-4" />
                  View All Containers
                </Link>
                <Link 
                  to="/"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium 
                           text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 
                           transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Create New Container
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={popupType}
      />
    </div>
  );
};

// Add this to your CSS
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
`;

export default Profile;