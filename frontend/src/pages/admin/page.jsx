import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useSelector } from 'react-redux';
import { Activity, Users, User, Box, Power, StopCircle, Trash, Search, Play, Edit, ToggleRight, ArrowRight, LogOut } from "lucide-react";
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

  // Add this new function to assign template to user
  const assignTemplate = async (userEmail, templateId) => {
    try {
      setIsLoading(true); // Add loading state
      console.log("Assigning template:", { userEmail, templateId }); // Debug log
      
      // Make sure both userEmail and templateId are present
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
      
      // Log the raw response for debugging
      // console.log("Raw response:", response);
      
      // Handle non-OK responses
      if (!response.ok) {
        // console.log("Response not ok:", response.status);
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`Server error: ${response.status} ${errorData}`);
      }
      
      // Parse the response data
      const data = await response.json();
      console.log("Assignment response:", data);
      
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

  // Add useEffect to fetch templates
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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const containerStatusData = {
    labels: ['Running', 'Stopped'],
    datasets: [
      {
        label: 'Container Status',
        data: [
          containers.filter(container => container.status === 'running').length,
          containers.filter(container => container.status === 'exited').length,
        ],
        backgroundColor: ['#4CAF50', '#F44336'],
      },
    ],
  };

  const userLoggedInData = {
    labels: ['Logged In', 'Logged Out'],
    datasets: [
      {
        label: 'User Login Status',
        data: [
          users.filter(user => user.isLoggedIn).length,
          users.filter(user => !user.isLoggedIn).length
        ],
        backgroundColor: ['#4CAF50', '#F44336']
      },
    ],
  };


  return (
    <>
      {isLoading ? <div className='fixed top-0 left-0 w-full h-full bg-black/40 z-[9999] flex justify-center items-center'>
        Loading...
      </div> : null}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </Link>
          <div className="flex gap-4">
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              <Power className="h-4 w-4" />
              Logout
            </Link>
            <Link
              to="/dev"
              className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <Edit className="h-4 w-4" />
              Developer
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex items-center rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by template name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full border-none outline-none focus:ring-0"
          />
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard title="Total Users" value={users.length} icon={<Users className="h-4 w-4 text-gray-500" />} />
          <StatCard
            title="Active Containers"
            value={containers.filter(container => container.status === 'running').length}
            icon={<Box className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="System Status"
            value={getSystemHealthStatus(containers)}
            icon={<Activity className="h-4 w-4" />}
            color={getSystemHealthStatus(containers) === "Healthy" ? "text-green-500" : "text-red-500"}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {/* User Role Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Roles Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={userRoleData} options={{ responsive: true, maintainAspectRatio: false }} />
            </CardContent>
          </Card>

          {/* Container Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Container Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={containerStatusData} options={{ responsive: true, maintainAspectRatio: false }} />

            </CardContent>
          </Card>
          {/* Logged In user Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Login Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={userLoggedInData} options={{ responsive: true, maintainAspectRatio: false }} />
            </CardContent>
          </Card>

        </div>
        {/* Users Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>
                {activeRole === 'user' ? 'Regular Users' : 'Developers'} and Containers
              </CardTitle>
              <button
                onClick={toggleRole}
                className="text-blue-500 hover:text-blue-800 flex items-center gap-2"
              >
                <span>View {activeRole === 'user' ? 'Developers' : 'Users'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
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
              />
            </div>

          </CardContent>
        </Card>
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          templates={templates}
          onAssign={assignTemplate}
          user={selectedUser}
        />
      </div>
    </>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, color = "text-gray-500" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={color}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// Reusable UserTable component
const UserTable = ({ setPopupVisible, popupMessage, popupType, popupVisible, users, toggleShowContainers, expandedUserIds, onStopContainer, onStartContainer, onDeleteContainer, onLogoutUser, onChangeRole, activeRole, onAssignTemplate }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b border-gray-200 text-left">
        <TableHeader title="User" />
        <TableHeader title="Email" />
        <TableHeader title="Role" />
        <TableHeader title="Login Status" />
        <TableHeader title="Containers" />
        {activeRole === 'dev' && <TableHeader title="Templates" />}
        <TableHeader title="Actions" />
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <React.Fragment key={user._id}>
          <tr className="border-b border-gray-200 cursor-pointer">
            <td className="px-4 py-3 font-medium flex items-center gap-2"
              onClick={() => toggleShowContainers(user._id)}
            >
              <User className="h-4 w-4 text-gray-500" />
              <span>{user.username}</span>
            </td>

            <td className="px-4 py-3" onClick={() => toggleShowContainers(user._id)}>{user.email}</td>
            <td className="px-4 py-3" onClick={() => toggleShowContainers(user._id)}>
              <span
                className={
                  user.role === 'admin' ? 'text-red-500 font-bold' :
                    user.role === 'dev' ? 'text-blue-500 font-bold' :
                      user.role === 'user' ? 'text-green-500 font-bold' : ''
                }
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={user.isLoggedIn} />
            </td>
            <td className="px-4 py-3">{user.containers.length}</td>
            {activeRole === 'dev' && (
              <td className="px-4 py-3">
                {user.assignedTemplates?.length || 0} assigned
                <button
                  onClick={() => onAssignTemplate(user)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </td>
            )}
            <td className="px-4 py-3">
              <button onClick={() => onLogoutUser(user.email)} className="text-red-500 hover:text-red-800">
                <LogOut className="h-4 w-4" />
              </button>
              <button onClick={() => onChangeRole(user.email)} className="px-4 text-blue-500 hover:text-blue-800">
                <ToggleRight className="h-4 w-4" />
              </button>
              <Popup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
                type={popupType}
              />
            </td>
          </tr>
          {expandedUserIds.includes(user._id) && user.containers.map(container => (
            <ContainerRow
              key={container.id}
              container={container}
              onStopContainer={onStopContainer}
              onStartContainer={onStartContainer}
              onDeleteContainer={onDeleteContainer}
              setPopupVisible={setPopupVisible} popupMessage={popupMessage} popupType={popupType} popupVisible={popupVisible}
            />
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
);

const TemplateModal = ({ isOpen, onClose, templates, onAssign, user }) => {
  const [assignedStates, setAssignedStates] = useState({});
  if (!isOpen || !user) return null;
  const handleAssign = async (email, templateId) => {
    try {
      await onAssign(email, templateId);
      setAssignedStates(prev => ({
        ...prev,
        [templateId]: true
      }));
    } catch (error) {
      console.error("Error in handleAssign:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Assign Template to {user.username}</h2>
        <div className="space-y-4">
          {templates.map(template => (
            <div key={template._id} className="flex items-center justify-between">
              <span>{template.name}</span>
              <button
                onClick={() => handleAssign(user.email, template._id)}
                className={`px-3 py-1 rounded text-white transition-colors ${
                  assignedStates[template._id]
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {assignedStates[template._id] ? 'Assigned' : 'Assign'}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const TableHeader = ({ title }) => (
  <th className="px-4 py-3 text-sm font-medium text-gray-500">{title}</th>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {status ? 'Logged In' : 'Logged Out'}
  </span>
);

const ContainerRow = ({ setPopupVisible, popupMessage, popupType, popupVisible, container, onStopContainer, onStartContainer, onDeleteContainer }) => (
  <tr className="border-b border-gray-100 bg-gray-50">
    <td className="px-4 py-3 pl-12" colSpan={2}>{container.name}</td>
    <td className="px-4 py-3">{container.template}</td>
    <td className="px-4 py-3">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${container.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {container.status}
      </span>
    </td>
    <td className="px-4 py-3">CPU: {container.cpu} | Memory: {container.memory}</td>
    <td className="px-4 py-3">
      <button onClick={() => onStopContainer(container.id)} className="mr-2 text-red-500 hover:text-red-700">
        <StopCircle className="h-4 w-4" />
      </button>
      <button onClick={() => onStartContainer(container.id)} className="ml-2 text-green-500 hover:text-green-700">
        <Play className="h-4 w-4" />
      </button>
      <button onClick={() => onDeleteContainer(container.id)} className="ml-2 text-red-700 hover:text-red-900">
        <Trash className="h-4 w-4" />
      </button>
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