import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield, Box, CheckCircle, Code, Activity, Bell, Bug } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Popup from '@/components/Popup';
import { fetchUserData, updateUserData, setEditMode } from "../../store/userSlice";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DevPage = () => {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const token = useSelector((state) => state.misc.token);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const { user, status, isEditMode } = useSelector((state) => state.user);


  useEffect(() => {
    if (token) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templateData, containerData] = await Promise.all([
          fetchTemplate(),
          fetchContainers(),
        ]);
        const combinedData = templateData.map((template) => {
          const uses = containerData.filter((container) => container.template === template.image).length;
          return { ...template, uses };
        })
        // console.log(combinedData);
        setTemplates(combinedData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [token]);


  const fetchTemplate = async () => {
    try {
      const currRole = token.role;
      const endpoint = currRole === 'admin' ? "http://localhost:3000/dev/getAllTemplates" : `http://localhost:3000/dev/getUserTemplates/${token.email}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.ok ? await response.json() : Promise.reject(response);
    } catch (err) {
      setError(err.message);
    }
  }

  const fetchContainers = async () => {
    const response = await fetch("http://localhost:3000/dev/getAllContainers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.ok ? await response.json() : [];
  };


  const filteredTemplates = templates.filter((template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  }))

  const templatePhase = {
    labels: ['Development', 'Testing', 'Production'],
    datasets: [{
      label: 'Phase Distribution',
      data: [
        templates.filter(template => template.phase === 'Development').length,
        templates.filter(template => template.phase === 'Testing').length,
        templates.filter(template => template.phase === 'Production').length
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',  // Blue
        'rgba(234, 179, 8, 0.7)',   // Yellow
        'rgba(34, 197, 94, 0.7)'    // Green
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      maxBarThickness: 60,
      hoverBackgroundColor: [
        'rgba(59, 130, 246, 0.9)',
        'rgba(234, 179, 8, 0.9)',
        'rgba(34, 197, 94, 0.9)'
      ],
      hoverBorderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      hoverBorderWidth: 3,
    }],
  };

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    // console.log(randomColor);
    return randomColor.padEnd(7, "0");
  };

  const templateStatus = {
    labels: templates.map(template => template.name),
    datasets: [
      {
        label: 'Containers',
        data: templates.map(template => template.uses),
        backgroundColor: templates.map(template => generateRandomColor()),
      },
    ],
  };

  const deleteTemplate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/dev/deleteTemplate/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        setTemplates(templates.filter((template) => template._id !== id));
        setPopupMessage("Template deleted successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        throw new Error("Failed to delete template");
        setPopupMessage("Failed to delete template");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (err) {
      setError(err + "Failed to delete template");
      setPopupMessage("Failed to delete template");
      setPopupType("error");
      setPopupVisible(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {/* Enhanced Header Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            {/* Added Prominent Icon */}
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                           flex items-center justify-center shadow-lg transform 
                           hover:scale-105 transition-all duration-300">
              <Code className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-1">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Developer Dashboard
                </h1>
              </Link>
              <p className="text-gray-500 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Monitor and manage your container templates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dev/editor"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-all duration-200 shadow-sm hover:shadow"
            >
              <Edit className="h-4 w-4" />
              Editor
            </Link>
            <Link
              to="/dev/bugreports"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-all duration-200 shadow-sm hover:shadow"
            >
              <Bug className="h-4 w-4" />
              Bug Reports
            </Link>
            <Link
              to="/dev/notification"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-all duration-200 shadow-sm hover:shadow"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
            {token.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                         transition-all duration-200 shadow-sm hover:shadow"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                       bg-black rounded-lg hover:bg-gray-800 
                       transition-all duration-200 shadow-sm hover:shadow"
            >
              <Power className="h-4 w-4" />
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
              placeholder="Search templates..."
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickStat 
            title="Total Templates" 
            value={templates.length}
            icon={<Box className="h-4 w-4" />}
          />
          <QuickStat 
            title="Production Ready" 
            value={templates.filter(t => t.phase === 'Production').length}
            icon={<CheckCircle className="h-4 w-4" />}
            valueColor="text-green-600"
          />
          <QuickStat 
            title="In Development" 
            value={templates.filter(t => t.phase === 'Development').length}
            icon={<Code className="h-4 w-4" />}
            valueColor="text-blue-600"
          />
          <QuickStat 
            title="Total Uses" 
            value={templates.reduce((acc, curr) => acc + curr.uses, 0)}
            icon={<Activity className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Phase Bar Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Template Phase Distribution</CardTitle>
              <p className="text-sm text-gray-500">Overview of templates in each development phase</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <Bar
                data={templatePhase}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    delay: (context) => context.dataIndex * 100
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                        size: 13,
                        family: 'Inter',
                        weight: '600'
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
                          const value = context.raw;
                          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return [
                            `Templates: ${value}`,
                            `Percentage: ${percentage}%`
                          ];
                        }
                      }
                    }
                  },
                  elements: {
                    bar: {
                      borderWidth: 2,
                      borderRadius: 8,
                      borderSkipped: false
                    }
                  },
                  barPercentage: 0.7,
                  categoryPercentage: 0.8,
                  datasets: {
                    bar: {
                      pointStyle: 'rect'
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
                        stepSize: 1,
                        precision: 0,
                        font: {
                          size: 12,
                          family: 'Inter'
                        },
                        color: 'rgba(0,0,0,0.6)',
                        padding: 8,
                        callback: function(value) {
                          return Math.floor(value) + (Math.floor(value) === 1 ? ' Template' : ' Templates');
                        }
                      },
                      border: {
                        dash: [4, 4]
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
                          family: 'Inter',
                          weight: '500'
                        },
                        color: 'rgba(0,0,0,0.6)',
                        padding: 8
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-center items-center gap-6 mt-6">
              {['Development', 'Testing', 'Production'].map((phase, index) => (
                <div key={phase} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{
                      backgroundColor: templatePhase.datasets[0].backgroundColor[index],
                      border: `2px solid ${templatePhase.datasets[0].borderColor[index]}`
                    }}
                  />
                  <span className="text-sm text-gray-600 font-medium">{phase}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Status Pie Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Template Usage Distribution</CardTitle>
              <p className="text-sm text-gray-500">Number of containers using each template</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <Pie
                data={templateStatus}
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
                          size: 11,
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
                      cornerRadius: 8
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

      {/* Enhanced Template Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-xl font-semibold">Template Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <TempTable 
              token={token}
              setPopupVisible={setPopupVisible}
              popupMessage={popupMessage}
              popupType={popupType}
              popupVisible={popupVisible}
              templates={filteredTemplates}
              deleteTemplate={deleteTemplate}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

// Enhanced TempTable component
const TempTable = ({ token, setPopupVisible, popupMessage, popupType, popupVisible, templates, deleteTemplate }) => (
  <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
    <thead className="bg-gray-50/80">
      <tr>
        <TableHeader title="Template Details" />
        <TableHeader title="Image" />
        <TableHeader title="Phase" />
        <TableHeader title="Description" />
        <TableHeader title="Pricing" />
        <TableHeader title="Usage" />
        {token.role === 'admin' && <TableHeader title="Actions" />}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {templates.length === 0 ? (
        <tr>
          <td colSpan={token.role === 'admin' ? 7 : 6} className="px-6 py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Box className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 font-medium">No templates found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      ) : (
        templates.map((template) => (
          <tr 
            key={template._id} 
            className="hover:bg-gray-50/60 transition-all duration-200"
          >
            {/* Template Name Cell */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 
                            flex items-center justify-center shadow-sm">
                  <Code className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-500">ID: {template._id.slice(0, 8)}...</div>
                </div>
              </div>
            </td>

            {/* Image Cell */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {template.image}
                </span>
              </div>
            </td>

            {/* Phase Cell */}
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium
                ${template.phase === 'Development' 
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' 
                  : template.phase === 'Testing' 
                  ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                  : 'bg-green-50 text-green-700 ring-1 ring-green-600/20'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  template.phase === 'Development' ? 'bg-blue-600' :
                  template.phase === 'Testing' ? 'bg-yellow-600' : 'bg-green-600'
                }`} />
                {template.phase}
              </span>
            </td>

            {/* Description Cell */}
            <td className="px-6 py-4">
              <div className="group relative">
                <div className="max-w-xs">
                  <p className="line-clamp-1 group-hover:line-clamp-none
                             bg-gray-50/80 p-2 rounded-lg text-gray-600
                             group-hover:bg-white group-hover:shadow-md 
                             transition-all duration-200">
                    {template.description}
                  </p>
                </div>
                {template.description.length > 50 && (
                  <div className="absolute hidden group-hover:block bottom-0 right-0 
                              text-xs text-gray-400 pr-2">
                    Hover to expand
                  </div>
                )}
              </div>
            </td>

            {/* Price Cell */}
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="font-medium text-green-600">
                  ${typeof template.price === 'number' ? template.price.toFixed(2) : template.price}
                </span>
                <span className="text-xs text-gray-400">per hour</span>
              </div>
            </td>

            {/* Uses Cell */}
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 
                           text-xs font-medium bg-blue-50 text-blue-700 
                           ring-1 ring-inset ring-blue-600/20">
                <Activity className="h-3.5 w-3.5" />
                {template.uses}
                <span className="text-blue-400">uses</span>
              </span>
            </td>

            {/* Actions Cell */}
            {token.role === 'admin' && (
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteTemplate(template._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                           text-red-700 bg-red-50 rounded-md hover:bg-red-100 
                           transition-colors duration-200"
                >
                  <Trash className="h-3.5 w-3.5" />
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

// Enhanced TableHeader component
const TableHeader = ({ title }) => (
  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 bg-gray-50/80">
    {title}
  </th>
);

// Add QuickStat component
const QuickStat = ({ title, value, icon, valueColor = "text-gray-900" }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className={`text-2xl font-semibold ${valueColor}`}>{value}</div>
  </div>
);

export default DevPage;