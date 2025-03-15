import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield, Box, CheckCircle, Code, Activity } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Popup from '@/components/Popup';
import { fetchUserData, updateUserData, setEditMode } from "../../store/userSlice";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminTemp = () => {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const token = useSelector((state) => state.misc.token);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'



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
      const response = await fetch("http://localhost:3000/dev/getAllTemplates", {
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
    return randomColor.padEnd(7, "0");
  };

  const templateStatus = {
    labels: templates.map(template => template.name),
    datasets: [{
      label: 'Container Usage',
      data: templates.map(template => template.uses),
      backgroundColor: templates.map(() => {
        // Generate softer, more professional colors
        const hue = Math.floor(Math.random() * 360);
        return `hsla(${hue}, 70%, 65%, 0.8)`;
      }),
      borderColor: templates.map(() => {
        // Slightly darker border for depth
        const hue = Math.floor(Math.random() * 360);
        return `hsla(${hue}, 70%, 45%, 1)`;
      }),
      borderWidth: 2,
      hoverOffset: 15,
      hoverBorderWidth: 3,
    }],
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
        // throw new Error("Failed to delete template");
        setError(err + "Failed to delete template");
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
      <div className="mb-8">
        {/* Main Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              {/* Single Icon Container */}
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 
                           flex items-center justify-center shadow-lg transform 
                           hover:scale-105 transition-all duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Template Management
                </h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4" />
                  Manage and monitor your container templates
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin/templates/edit"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
                         bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 
                         transition-all duration-200 shadow-sm hover:shadow group"
              >
                <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Editor
              </Link>
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 text-sm
                         border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-black focus:border-transparent
                         placeholder-gray-400 transition-all duration-200
                         bg-gray-50 hover:bg-white focus:bg-white"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-block
                            px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
                Press /
              </kbd>
            </div>
          </div>

          {/* Quick Stats with Enhanced Icons */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickStat 
              title="Total Templates" 
              value={templates.length}
              icon={
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Box className="h-4 w-4 text-gray-600" />
                </div>
              }
            />
            <QuickStat 
              title="Production Ready" 
              value={templates.filter(t => t.phase === 'Production').length}
              icon={
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                </div>
              }
            />
            <QuickStat 
              title="In Development" 
              value={templates.filter(t => t.phase === 'Development').length}
              icon={
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Code className="h-4 w-4 text-gray-600" />
                </div>
              }
            />
            <QuickStat 
              title="Total Uses" 
              value={templates.reduce((acc, curr) => acc + curr.uses, 0)}
              icon={
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Activity className="h-4 w-4 text-gray-600" />
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
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
                  }
                }}
              />
            </div>
            {/* Add a legend manually for better control */}
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
                        },
                        generateLabels: function(chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                              const value = data.datasets[0].data[i];
                              const total = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return {
                                text: `${label} (${percentage}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].borderColor[i],
                                lineWidth: 1,
                                hidden: false,
                                index: i
                              };
                            });
                          }
                          return [];
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
                          return `Containers: ${value} (${percentage}%)`;
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
    <thead>
      <tr className="bg-gray-50/80 border-b border-gray-200">
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
                  <p className="text-sm text-gray-600 bg-gray-50/80 p-2 rounded-lg
                             overflow-hidden transition-all duration-200
                             group-hover:bg-white group-hover:shadow-md">
                    <span className="line-clamp-1 group-hover:line-clamp-none">
                      {template.description}
                    </span>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1.5 
                             text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
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

const TableHeader = ({ title}) => (
  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{title}</th>
);

const QuickStat = ({ title, value, icon }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 
                  hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      {icon}
    </div>
    <div className="text-2xl font-semibold text-gray-900">{value}</div>
  </div>
);


export default AdminTemp;