import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, Edit, Search, Sliders, Trash, Shield, Box, CheckCircle, Code, Activity } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Popup from '@/components/Popup';


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
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    templateId: null,
    templateName: ''
  });



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

  const initiateDelete = (templateId, templateName) => {
    setDeleteConfirmation({
      isOpen: true,
      templateId,
      templateName
    });
  };

  const deleteTemplate = async (id) => {
    try {
      const templateData = templates.find(template => template._id === id);
      if (!templateData) {
        throw new Error("Template not found");
      }

      const response = await fetch(`http://localhost:3000/dev/deleteTemplate/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        await fetch("http://localhost:3000/dev/notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({
            title: "Template Deleted",
            message: `Template "${templateData.name}" has been deleted by admin`
          }),
        });

        setTemplates(templates.filter((template) => template._id !== id));
        setPopupMessage("Template deleted successfully");
        setPopupType("success");
        setPopupVisible(true);
      } else {
        setError("Failed to delete template");
        setPopupMessage("Failed to delete template");
        setPopupType("error");
        setPopupVisible(true);
      }
    } catch (err) {
      setError("Failed to delete template");
      setPopupMessage("Failed to delete template");
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setDeleteConfirmation({ isOpen: false, templateId: null, templateName: '' });
    }
  };

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
              initiateDelete={initiateDelete}
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, templateId: null, templateName: '' })}
        onConfirm={() => deleteTemplate(deleteConfirmation.templateId)}
        templateName={deleteConfirmation.templateName}
      />

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

// Enhanced TempTable component
const TempTable = ({ token, setPopupVisible, popupMessage, popupType, popupVisible, templates, deleteTemplate, initiateDelete }) => (
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
              <td className="px-6 py-4">
                <button
                  onClick={() => initiateDelete(template._id, template.name)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                           text-red-700 bg-red-50 rounded-md hover:bg-red-100 
                           transition-colors duration-200"
                >
                  <Trash className="h-3.5 w-3.5" />
                  Delete
                </button>
                <Popup
                  message={popupMessage}
                  type={popupType}
                  visible={popupVisible}
                  onClose={() => setPopupVisible(false)}
                />
              </td>
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

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, templateName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
         onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

        {/* Dialog */}
        <div 
          className="relative transform overflow-hidden rounded-xl bg-white px-6 py-6 text-left shadow-2xl transition-all w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Warning Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Template
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                You are about to delete the template:
              </p>
              <p className="mt-2 text-base font-medium text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-100">
                {templateName}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. All data associated with this template will be permanently removed.
              </p>
            </div>

            {/* Warning Message */}
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This will also affect any containers using this template.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium 
                         text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                         transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium 
                         text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                         transition-colors duration-200"
              >
                <svg className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTemp;