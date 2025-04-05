import React, { useState, useEffect } from 'react';
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";
import { Loader2, Search, Server, Box, Activity, RefreshCw, Plus, InfoIcon } from "lucide-react";
import CreateContButton from "@/components/dashboard/CreateContainer";
import Loader from '@/components/ui/Loader';

const getContainerStatus = async (containerId) => {
  const tok = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(`http://localhost:3000/container/details/${containerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tok.token}`,
    },
  });
  const details = await response.json();
  return {status : details.status, cpu : details.cpuUsagePercentage, memory : details.memoryUsagePercentage} ;
};

function Containers() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        const response = await fetch("http://localhost:3000/container/listcontainers", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        let data = await response.json();
        const userContainers = await Promise.all(data.map(async (container) => {
          const details = await getContainerStatus(container.id);
          const temp = await fetch(`http://localhost:3000/container/templateName/${container.id}`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + tok.token,
            },
          });
          const templateData = await temp.json();
          return {
            id: container.id,
            title: container.name,
            lastUsed: container.lastUsed,
            link: `project/${container.id}`,
            Status: details.status,
            CPU: details.cpu,
            Memory: details.memory,
            Template: templateData.templateName,
          };
        }));
        setProjects(userContainers);
        if (data === null) {
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchContainers();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Enhanced Header Section */}
      <div className="mb-6 space-y-6">
        {/* Main Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl shadow-sm">
              <Server className="w-7 h-7 text-gray-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Development Containers
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor your containerized development environments
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Info Cards with reduced size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Environments Card */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 
                          hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300">
                <Server className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-base">Active Environments</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.Status === 'running').length}
                  </p>
                  <p className="text-xs text-gray-500">Active containers</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-green-600">
                    {((projects.filter(p => p.Status === 'running').length / Math.max(projects.length, 1)) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">utilization</p>
                </div>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(projects.filter(p => p.Status === 'running').length / Math.max(projects.length, 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Total Containers Card */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 
                          hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300">
                <Box className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-base">Total Containers</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.length}
                  </p>
                  <p className="text-xs text-gray-500">Total containers</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span>{projects.filter(p => p.Status !== 'running').length} stopped</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>{projects.filter(p => p.Status === 'running').length} running</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 
                          hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-base">System Status</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">All Systems Operational</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Last checked: Just now</p>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Docker Service</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">API Connection</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Network Status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar - Updated with CreateContButton */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search containers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border-2 rounded-xl
                        focus:outline-none focus:border-gray-400 
                        transition-all duration-200
                        placeholder:text-gray-400 text-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5
                          hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Replace the buttons section with CreateContButton */}
          <div className="flex gap-3">
            <CreateContButton>
              <button 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                          bg-gray-900 text-white hover:bg-gray-800 
                          transition-all duration-200 w-full md:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>New Container</span>
              </button>
            </CreateContButton>
          </div>
        </div>

        {/* Quick Info */}
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <InfoIcon className="w-4 h-4" />
          <span>
            Containers are isolated development environments that package your code and dependencies.
          </span>
        </div>
      </div>

      <div className="rounded-sm h-auto overflow-auto">
        <div className="text-black border-2 h-[700px] overflow-auto justify-center">
          {loading ? (
            <Loader 
              title="Loading Containers" 
              description="Please wait while we fetch your containers" 
            />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Error: {error.message}
              </h3>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className="w-32 h-32 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? "No matching containers found" : "No Containers Found"}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Start by creating your first container"
                }
              </p>
            </div>
          ) : (
            <HoverEffect items={filteredProjects} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Containers;