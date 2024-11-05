import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from 'react-redux';
import { Activity, Users, Box, Power } from "lucide-react";
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, containersData, authData] = await Promise.all([
          fetchUsers(),
          fetchContainers(),
          fetchAuthData(),
        ]);

        const containersWithStatus = await addContainerStatus(containersData);
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
  }, [token]);

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

  const addContainerStatus = async (containersData) => {
    return Promise.all(
      containersData.map(async (container) => {
        try {
          const response = await fetch(`http://localhost:3000/container/inspect/${container.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          });
          const statusData = await response.json();
          return { ...container, status: statusData };
        } catch (error) {
          console.error(`Error fetching data for container ${container.id}:`, error);
          return container;
        }
      })
    );
  };

  const toggleShowContainers = (userId) => {
    setExpandedUserId(prevUserId => prevUserId === userId ? null : userId);
  };
  const handleStopContainer = async (containerId) => {
    try {
      // wait for the response before fetching the latest data
      const response = await fetch(`http://localhost:3000/container/stop/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      // console.log(response);
      if (response.ok) {
        // Fetch the latest data to refresh the page 
        await fetchData();
      } else {
        console.error(`Failed to stop container ${containerId}`);
      }
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
    }
  };

  const handleStartContainer = async (containerId) =>{
    try {
      // wait for the response before fetching the latest data
      const response = await fetch(`http://localhost:3000/container/start/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      console.log(response);
      if (response.ok) {
        // Fetch the latest data to refresh the page 
        await fetchData();
      } else {
        console.error(`Failed to start container ${containerId}`);
      }
    } catch (error) {
      console.error(`Error starting container ${containerId}:`, error);
    }
  };

  const handleRestartContainer = async (containerId) => {
    try{
      const response = await fetch(`http://localhost:3000/container/restart/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      console.lgo(response);
      console.log(response);
      if (response.ok) {
        // Fetch the latest data to refresh the page 
        await fetchData();
      } else {
        console.error(`Failed to restart container ${containerId}`);
      }
    } catch (error) {
      console.error(`Error restarting container ${containerId}:`, error);
    }
  };

  // Filter users and containers based on the search term
  const filteredUsers = users.map(user => ({
    ...user,
    containers: user.containers.filter(container =>
      container.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.containers.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/auth" className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
          <Power className="h-4 w-4" />
          Logout
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by username or container name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border border-gray-300 px-4 py-2"
        />
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={users.length} icon={<Users className="h-4 w-4 text-gray-500" />} />
        <StatCard
          title="Active Containers"
          value={containers.filter(container => container.status.status === 'running').length}
          icon={<Box className="h-4 w-4 text-gray-500" />}
        />
        <StatCard title="System Status" value="Healthy" icon={<Activity className="h-4 w-4 text-gray-500" />} color="text-green-500" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Users Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Users and Containers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <UserTable users={filteredUsers} toggleShowContainers={toggleShowContainers} expandedUserId={expandedUserId} onStopContainer={handleStopContainer} onStartContainer= {handleStartContainer} onRestartContainer={handleRestartContainer}/>
          </div>
        </CardContent>
      </Card>
    </div>
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
const UserTable = ({ users, toggleShowContainers, expandedUserId, onStopContainer, onStartContainer, onRestartContainer}) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b border-gray-200 text-left">
        <TableHeader title="User" />
        <TableHeader title="Email" />
        <TableHeader title="Login Status" />
        <TableHeader title="Containers" />
        <TableHeader title="Actions" />
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <React.Fragment key={user.id}>
          <tr className="border-b border-gray-200 cursor-pointer" >
            <td className="px-4 py-3 font-medium" onClick={() => toggleShowContainers(user.id)}>{user.username} </td>
            <td className="px-4 py-3">{user.email}</td>
            <td className="px-4 py-3">
              <StatusBadge status={user.isLoggedIn} />
            </td>
            <td className="px-4 py-3">{user.containers.length}</td>
            <td className="px-4 py-3">
              <button className="text-blue-500 hover:text-blue-700">Manage</button>
            </td>
          </tr>
          {expandedUserId === user.id && user.containers.map(container => (
            <ContainerRow key={container.id} container={container} onStopContainer={onStopContainer} onStartContainer={onStartContainer} onRestartContainer ={onRestartContainer} />
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
);

const TableHeader = ({ title }) => (
  <th className="px-4 py-3 text-sm font-medium text-gray-500">{title}</th>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {status ? 'Logged In' : 'Logged Out'}
  </span>
);

const ContainerRow = ({ container, onStopContainer, onStartContainer, onRestartContainer}) => (
  <tr className="border-b border-gray-100 bg-gray-50">
    <td className="px-4 py-3 pl-12" colSpan={2}>{container.name}</td>
    <td className="px-4 py-3">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${container.status.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {container.status.status}
      </span>
    </td>
    <td className="px-4 py-3">CPU: {container.cpu} | Memory: {container.memory}</td>
    <td className="px-4 py-3">
      <button onClick={() => onStopContainer(container.id)} className="mr-2 text-red-500 hover:text-red-700">Stop</button>
      <button onClick={() => onRestartContainer(container.id)} className="text-blue-500 hover:text-blue-700">Restart</button>
      <button onClick={() => onStartContainer(container.id)} className="ml-2 text-green-500 hover:text-green-700">Start</button>
      {/* <button className="ml-2 text-red-500 hover:text-red-700">Delete</button> */}
    </td>
  </tr>
);

export default AdminPage;
