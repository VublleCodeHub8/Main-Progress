import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useSelector } from 'react-redux';
import { Activity, Users, User, Box, Power, StopCircle, Trash, Search, Play, Edit, ToggleRight, ArrowRight, LogOut, Bug, History} from "lucide-react";
import { Link } from 'react-router-dom';
import Popup from '@/components/Popup';
import { set } from 'react-hook-form';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);
  const [expandedUserIds, setExpandedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.misc.token);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('user');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const fetchTemplates = async () => {
    try {
      const response = await fetch("http://localhost:3000/dev/getAllTemplates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const assignTemplate = async (userEmail, templateId) => {
    try {
      setIsLoading(true); // Add loading state

      if (!userEmail || !templateId) {
        throw new Error("Email and template ID are required");
      }

      const response = await fetch("http://localhost:3000/admin/addTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          templateId: templateId
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`Server error: ${response.status} ${errorData}`);
      }

      setPopupMessage("Template assigned successfully");
      setPopupType("success");
      setPopupVisible(true);
      setShowTemplateModal(false);
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error("Error assigning template:", error);
      setPopupMessage(error.message || "Error assigning template");
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  const removeTemplate = async (userEmail, templateId) => {
    try{
      setIsLoading(true);
      if(!userEmail || !templateId){
        throw new Error("Email and template ID are required");
      }
      
      const response = await fetch("http://localhost:3000/admin/removeTemplate", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({
            email: userEmail,
            templateId: templateId
          }),
        });

      if(!response.ok){
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`Server error: ${response.status} ${errorData}`);
      }

      setPopupMessage("Template removed successfully");
      setPopupType("success");
      setPopupVisible(true);
      setShowTemplateModal(false);
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error("Error removing template:", error);
      setPopupMessage(error.message || "Error removing template");
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, containersData, authData] = await Promise.all([
          fetchUsers(),
          fetchContainers(),
          fetchAuthData(),
        ]);

        const containersWithStatus = await addContainerDetails(containersData);
        setContainers(containersWithStatus);

        const combinedData = usersData.map(user => ({
          ...user,
          containers: containersWithStatus.filter(container => container.email === user.email),
          isLoggedIn: authData.some(auth => auth.email === user.email && auth.noOfLogins > 0),
        }));
        setUsers(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [token, refreshTrigger]);


  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/admin/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : [];
  };

  const fetchContainers = async () => {
    const response = await fetch("http://localhost:3000/admin/getAllContainers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : [];
  };

  const fetchAuthData = async () => {
    const response = await fetch("http://localhost:3000/admin/getAllAuth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : [];
  };

  const addContainerDetails = async (containersData) => {
    return Promise.all(
      containersData.map(async (container) => {
        try {
          const response = await fetch(`http://localhost:3000/container/details/${container.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          });
          const details = await response.json();
          return {
            ...container,
            status: details.status,
            cpu: details.cpuUsagePercentage,
            memory: details.memoryUsagePercentage,

          };
        } catch (error) {
          console.error(`Error fetching data for container ${container.id}:`, error);
          return container;
        }
      })
    );
  };

  const toggleShowContainers = (userId) => {
    setExpandedUserIds(prevUserIds =>
      prevUserIds.includes(userId) ? prevUserIds.filter(id => id !== userId) : [...prevUserIds, userId]
    );
  };

  const handleStopContainer = async (containerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/container/stop/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        setContainers(containers.map(container => container.id === containerId ? { ...container, status: "exited" } : container));
        setPopupMessage("Container stopped successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        console.error(`Failed to stop container ${containerId}`);
        setPopupMessage("Failed to stop container");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
      setPopupMessage("Error stopping container");
      setPopupType("error");
      setPopupVisible(true);
    }
    setRefreshTrigger(prevTrigger => !prevTrigger);
  };

  const handleStartContainer = async (containerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/container/start/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        setContainers(containers.map(container => container.id === containerId ? { ...container, status: "running" } : container));
        setPopupMessage("Container started successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        console.error(`Failed to start container ${containerId}`);
        setPopupMessage("Failed to start container");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (error) {
      console.error(`Error starting container ${containerId}:`, error);
      setPopupMessage("Error starting container");
      setPopupType("error");
      setPopupVisible(true);
    }
    // setPopupMessage(true);
    setRefreshTrigger(prevTrigger => !prevTrigger);
  };

  const handleDeleteContainer = async (containerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/container/delete/${containerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        setContainers(containers.filter(container => container.id !== containerId));
        setPopupMessage("Container deleted successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        console.error(`Failed to delete container ${containerId}`);
        setPopupMessage("Failed to delete container");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch {
      console.error(`Error deleting container ${containerId}`, error);
      setPopupMessage("Error deleting container");
      setPopupType("error");
      setPopupVisible(true);
    }
    // setPopupMessage(true);
    setRefreshTrigger(prevTrigger => !prevTrigger);
  };

  const logoutUser = async (userEmail) => { // Rename parameter to avoid conflict
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/admin/adminLogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({ email: userEmail }), // Use userEmail directly in the payload
      });
      setIsLoading(false);
      if (response.ok) {
        setUsers(users.map(user => user.email === userEmail ? { ...user, isLoggedIn: false } : user));
        setPopupMessage("User logged out successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        console.error(`Failed to logout user: ${userEmail}`);
        setPopupMessage("Failed to logout user");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (error) {
      console.error(`Error logging out user ${userEmail}:`, error);
      setPopupMessage("Error logging out user");
      setPopupType("error");
      setPopupVisible(true);
    }
    setRefreshTrigger(prevTrigger => !prevTrigger);
  };

  const changeRole = async (userEmail) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/admin/roleChange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });
      setIsLoading(false);
      if (response.ok) {
        setUsers(users.map(user => user.email === userEmail ? { ...user, role: user.role === 'dev' ? 'user' : 'dev' } : user));
        setPopupMessage("Role changed successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        console.error(`Failed to change role for user: ${userEmail}`);
        setPopupMessage("Failed to change role for user");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (error) {
      console.error("Error changing role for user: ${userEmail}", error);
      setPopupMessage("Error changing role for user");
      setPopupType("error");
      setPopupVisible(true);
    }
    setRefreshTrigger(prevTrigger => !prevTrigger);
  };


  const filteredUsers = users
    .filter(user => user.role === activeRole)
    .map(user => ({
      ...user,
      containers: user.containers.filter(container =>
        container.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.containers.length > 0
    );

  const getSystemHealthStatus = (containers) => {
    const runningContainers = containers.filter(container => container.status === 'running').length;
    const totalContainers = containers.length;
    const runningPercentage = (runningContainers / totalContainers) * 100;
    return runningPercentage >= 40 ? "Healthy" : "Unhealthy";
  };

  const toggleRole = () => {
    setActiveRole(activeRole === 'user' ? 'dev' : 'user');
  };

  const userRoleData = {
    labels: ['Admin', 'Developer', 'User'],
    datasets: [
      {
        label: 'Number of Users',
        data: [
          users.filter(user => user.role === 'admin').length,
          users.filter(user => user.role === 'dev').length,
          users.filter(user => user.role === 'user').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  };

  const containerStatusData = {
    labels: ['Running', 'Stopped'],
    datasets: [{
      label: 'Container Status',
      data: [
        containers.filter(container => container.status === 'running').length,
        containers.filter(container => container.status === 'exited').length,
      ],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(244, 67, 54, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4,
      hoverBorderWidth: 3,
    }],
  };

  const userLoggedInData = {
    labels: ['Logged In', 'Logged Out'],
    datasets: [{
      label: 'User Login Status',
      data: [
        users.filter(user => user.isLoggedIn).length,
        users.filter(user => !user.isLoggedIn).length
      ],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(244, 67, 54, 0.8)'
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(244, 67, 54, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4,
      hoverBorderWidth: 3,
    }],
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Title and Actions Section */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-5">
              {/* Single Prominent Icon */}
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                           flex items-center justify-center shadow-lg transform 
                           hover:rotate-3 transition-all duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </Link>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4" />
                  Monitor and manage system resources, users, and containers
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin/templates"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                         transition-all duration-200 shadow-sm"
              >
                <Edit className="h-4 w-4" />
                Templates
              </Link>
              <Link
                to="/admin/bugreports"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                         transition-all duration-200 shadow-sm"
              >
                <Bug className="h-4 w-4" />
                Bug Reports
              </Link>
              <Link
                to="/admin/containerhistory"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                         transition-all duration-200 shadow-sm"
              >
                <History className="h-4 w-4" />
                Container History
              </Link>
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                         bg-black rounded-lg hover:bg-gray-800 
                         transition-all duration-200 shadow-sm"
              >
                <Power className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>

          {/* Enhanced Search Bar with top margin */}
          <div className="max-w-2xl mt-6 border-t pt-1 border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users or containers... (Press '/' to focus)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 text-sm
                         border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-black focus:border-transparent
                         placeholder-gray-400 transition-all duration-200
                         bg-gray-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<Users className="h-5 w-5" />}
          description="Active users in the system"
          trend="+5% from last week"
          trendUp={true}
        />
        <StatCard
          title="Active Containers"
          value={containers.filter(container => container.status === 'running').length}
          icon={<Box className="h-5 w-5" />}
          description="Currently running containers"
          trend="-2% from yesterday"
          trendUp={false}
        />
        <StatCard
          title="System Status"
          value={getSystemHealthStatus(containers)}
          icon={<Activity className="h-5 w-5" />}
          description="Overall system health"
          color={getSystemHealthStatus(containers) === "Healthy" ? "text-green-500" : "text-red-500"}
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">User Roles Distribution</CardTitle>
              <p className="text-sm text-gray-500">Overview of user types in the system</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[240px]">
              <Bar
                data={userRoleData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                        size: 13,
                        family: 'Inter'
                      },
                      bodyFont: {
                        size: 12,
                        family: 'Inter'
                      },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      usePointStyle: true,
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.y} Users`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false
                      },
                      ticks: {
                        font: {
                          size: 12,
                          family: 'Inter'
                        },
                        color: 'rgba(0,0,0,0.6)',
                        padding: 8
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      ticks: {
                        font: {
                          size: 12,
                          family: 'Inter'
                        },
                        color: 'rgba(0,0,0,0.6)',
                        padding: 8
                      }
                    }
                  },
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 0,
                      left: 0,
                      right: 0
                    }
                  },
                  hover: {
                    mode: 'index',
                    intersect: false
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Container Status</CardTitle>
              <p className="text-sm text-gray-500">Current state of all containers</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[240px]">
              <Pie
                data={containerStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    animateRotate: true,
                    animateScale: true
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                          size: 12,
                          family: 'Inter'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                        size: 13,
                        family: 'Inter'
                      },
                      bodyFont: {
                        size: 12,
                        family: 'Inter'
                      },
                      padding: 12,
                      cornerRadius: 8,
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  elements: {
                    arc: {
                      borderWidth: 2
                    }
                  },
                  cutout: '60%',
                  radius: '90%'
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">User Login Status</CardTitle>
              <p className="text-sm text-gray-500">Active vs. inactive user sessions</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[240px]">
              <Pie
                data={userLoggedInData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    animateRotate: true,
                    animateScale: true
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                          size: 12,
                          family: 'Inter'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                        size: 13,
                        family: 'Inter'
                      },
                      bodyFont: {
                        size: 12,
                        family: 'Inter'
                      },
                      padding: 12,
                      cornerRadius: 8,
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  elements: {
                    arc: {
                      borderWidth: 2
                    }
                  },
                  cutout: '60%',
                  radius: '90%'
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Users Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {activeRole === 'user' ? 'Regular Users' : 'Developers'} and Containers
              </CardTitle>
              <p className="text-sm text-gray-500">
                Manage users and their associated containers
              </p>
            </div>
            <button
              onClick={toggleRole}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
                       transition-all duration-200 shadow-sm"
            >
              <span>View {activeRole === 'user' ? 'Developers' : 'Users'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <UserTable
              setPopupVisible={setPopupVisible}
              popupMessage={popupMessage}
              popupType={popupType}
              popupVisible={popupVisible}
              users={filteredUsers}
              toggleShowContainers={toggleShowContainers}
              expandedUserIds={expandedUserIds}
              onStopContainer={handleStopContainer}
              onStartContainer={handleStartContainer}
              onDeleteContainer={handleDeleteContainer}
              onLogoutUser={logoutUser}
              onChangeRole={changeRole}
              activeRole={activeRole}
              onAssignTemplate={(user) => {
                setSelectedUser(user);
                setShowTemplateModal(true);
              }}
              className="w-full border-collapse [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_th]:py-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={templates}
        onAssign={assignTemplate}
        onRemove={removeTemplate}
        user={selectedUser}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm font-medium text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced StatCard component
const StatCard = ({ title, value, icon, description, trend, trendUp, color = "text-gray-500" }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
    <CardHeader className="p-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className={`${color} p-2 bg-gray-50 rounded-full`}>{icon}</div>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        {trend && (
          <div className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Reusable UserTable component
const UserTable = ({ setPopupVisible, popupMessage, popupType, popupVisible, users, toggleShowContainers, expandedUserIds, onStopContainer, onStartContainer, onDeleteContainer, onLogoutUser, onChangeRole, activeRole, onAssignTemplate }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-50/80 border-b border-gray-200">
        <TableHeader title="User" />
        <TableHeader title="Email" />
        <TableHeader title="Role" />
        <TableHeader title="Login Status" />
        <TableHeader title="Containers" />
        {activeRole === 'dev' && <TableHeader title="Templates" />}
        <TableHeader title="Actions" />
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {users.map(user => (
        <React.Fragment key={user._id}>
          <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200">
            <td className="px-4 py-4">
              <div className="flex items-center gap-3 group cursor-pointer"
                onClick={() => toggleShowContainers(user._id)}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
                              flex items-center justify-center text-sm font-semibold text-gray-700
                              shadow-sm group-hover:shadow-md transition-all duration-200">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.isLoggedIn && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 
                                border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.containers.length} container{user.containers.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className={`ml-2 transform transition-transform duration-200 
                              ${expandedUserIds.includes(user._id) ? 'rotate-90' : ''}`}>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </td>

            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            </td>

            <td className="px-4 py-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                ${user.role === 'admin' 
                  ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' 
                  : user.role === 'dev'
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                  : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </td>

            <td className="px-4 py-4">
              <StatusBadge status={user.isLoggedIn} />
            </td>

            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {user.containers.length}
                </span>
              </div>
            </td>

            {activeRole === 'dev' && (
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAssignTemplate(user)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
                             text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 
                             transition-colors duration-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    {user.assignedTemplates?.length || 0} Templates
                  </button>
                </div>
              </td>
            )}

            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLogoutUser(user.email)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
                           text-red-700 bg-red-50 rounded-md hover:bg-red-100 
                           transition-colors duration-200"
                  title="Logout User"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>

                <button
                  onClick={() => onChangeRole(user.email)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
                           text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 
                           transition-colors duration-200"
                  title="Change Role"
                >
                  <ToggleRight className="h-3.5 w-3.5" />
                  Role
                </button>
              </div>
              <Popup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
                type={popupType}
              />
            </td>
          </tr>

          {/* Container Details Section */}
          {expandedUserIds.includes(user._id) && (
            <>
              <tr className="bg-gray-50/60">
                <th scope="col" colSpan={activeRole == 'dev' ? 3 : 2} 
                    className="py-3 pl-12 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Container Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              {user.containers.map(container => (
                <ContainerRow
                  key={container.id}
                  container={container}
                  onStopContainer={onStopContainer}
                  onStartContainer={onStartContainer}
                  onDeleteContainer={onDeleteContainer}
                  setPopupVisible={setPopupVisible}
                  popupMessage={popupMessage}
                  popupType={popupType}
                  popupVisible={popupVisible}
                  activeRole={activeRole}
                />
              ))}
              {user.containers.length === 0 && (
                <tr className="bg-gray-50/60">
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Box className="h-5 w-5 text-gray-400" />
                      <p>No containers found for this user</p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </table>
);

// Update TableHeader component
const TableHeader = ({ title }) => (
  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {title}
  </th>
);

// Update StatusBadge component
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
    ${status 
      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${
      status ? 'bg-green-600 animate-pulse' : 'bg-gray-500'
    }`} />
    {status ? 'Active' : 'Inactive'}
  </span>
);

const TemplateModal = ({ isOpen, onClose, templates, onAssign, user, onRemove }) => {
  const [assignedStates, setAssignedStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !user) return null;

  const isTemplateAssigned = (templateId) => {
    return user.assignedTemplates?.some(assignedId => assignedId.toString() === templateId.toString());
  };

  const handleToggle = async (email, templateId, currentState) => {
    try {
      if (!currentState) {
        await onAssign(email, templateId);
      } else {
        await onRemove(email, templateId);
      }
      setAssignedStates(prev => ({
        ...prev,
        [templateId]: !currentState
      }));
    } catch (error) {
      console.error("Error in handleToggle:", error);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800 to-black 
                          flex items-center justify-center shadow-md">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Template Access</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage template permissions for {user.username}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-black focus:border-transparent
                         placeholder-gray-400 transition-all duration-200
                         bg-gray-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Template List */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          <div className="space-y-3">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <div key={template._id} 
                     className="flex items-center justify-between p-3 rounded-lg
                              border border-gray-100 hover:border-gray-200 
                              hover:bg-gray-50/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Box className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">
                        Phase: {template.phase || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isTemplateAssigned(template._id)}
                      onChange={() => handleToggle(user.email, template._id, isTemplateAssigned(template._id))}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                                peer-focus:ring-4 peer-focus:ring-black/10
                                peer-checked:after:translate-x-full 
                                peer-checked:after:border-white
                                after:content-[''] after:absolute 
                                after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 
                                after:border after:rounded-full
                                after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-black">
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Box className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No templates found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-lg 
                       hover:bg-gray-50 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContainerRow = ({ setPopupVisible, popupMessage, popupType, popupVisible, container, onStopContainer, onStartContainer, onDeleteContainer, activeRole }) => (
  <tr className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50 transition-colors duration-200">
    <td className="px-4 py-3 pl-12" colSpan={activeRole == 'dev' ? 3 : 2}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-200/70 flex items-center justify-center">
          <Box className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <span className="font-medium text-gray-900">{container.name}</span>
          <p className="text-xs text-gray-500 mt-0.5">ID: {container.id.slice(0, 12)}</p>
        </div>
      </div>
    </td>

    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
        <span className="text-sm font-medium text-gray-600">{container.template}</span>
      </div>
    </td>

    <td className="px-4 py-3">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium 
        ${container.status === 'running' 
          ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20' 
          : 'bg-red-100 text-red-700 ring-1 ring-red-600/20'}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${
          container.status === 'running' ? 'bg-green-600 animate-pulse' : 'bg-red-600'
        }`} />
        {container.status === 'running' ? 'Running' : 'Stopped'}
      </span>
    </td>

    <td className="px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">CPU:</span>
          <div className="flex-1 h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${container.cpu}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{container.cpu}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">RAM:</span>
          <div className="flex-1 h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${container.memory}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{container.memory}</span>
        </div>
      </div>
    </td>

    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        {container.status === 'running' ? (
          <button
            onClick={() => onStopContainer(container.id)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 
                     bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
            title="Stop Container"
          >
            <StopCircle className="h-3.5 w-3.5" />
            Stop
          </button>
        ) : (
          <button
            onClick={() => onStartContainer(container.id)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 
                     bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
            title="Start Container"
          >
            <Play className="h-3.5 w-3.5" />
            Start
          </button>
        )}

        <button
          onClick={() => onDeleteContainer(container.id)}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 
                   bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          title="Delete Container"
        >
          <Trash className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={popupType}
      />
    </td>
  </tr>
);

export default AdminPage;