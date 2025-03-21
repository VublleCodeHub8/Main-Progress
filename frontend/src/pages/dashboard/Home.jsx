import { WobbleCard } from "@/components/ui/wobble-card";
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateContButton  from  "@/components/dashboard/CreateContainer"
import {useSelector} from "react-redux";
import { Server, Command, BarChart2, Plus, Settings2 } from "lucide-react";



function Home() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.misc.token);
  const [error, setError] = useState(null);
  

const getContainerStatus = async (containerId) => { 
  const response = await fetch(`http://localhost:3000/container/details/${containerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.token}`,
    },
  });
  const details = await response.json();
  return {status : details.status, cpu : details.cpuUsagePercentage, memory : details.memoryUsagePercentage, memoryUsage : details.memoryUsage} ;
};

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
        return {
          id: container.id,
          title: container.name,
          lastUsed: container.lastUsed,
          link: `project/${container.id}`,
          Status: details.status,
          CPU: details.cpu,
          Memory: details.memory,
          MemoryUsage: details.memoryUsage,
        };
      }));
      setProjects(userContainers);
      if (data === null) {
        console.log("empytyjhbj")
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  fetchContainers();
}, []);


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-sm p-8 mb-8 border-2 border-gray-100">
        <div className="flex items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-50 rounded-xl shadow-sm border-2 border-gray-100">
                <Server className="w-7 h-7 text-gray-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Container Dashboard
                </h1>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Command className="w-4 h-4" />
                    <span className="text-sm">Manage</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BarChart2 className="w-4 h-4" />
                    <span className="text-sm">Monitor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm">Configure</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 pl-[52px] border-l-2 border-gray-100">
              Manage and monitor your container infrastructure. Create, deploy, and scale your development environments with ease.
            </p>
          </div>

          {/* Enhanced Create Container Button */}
          <div className="flex-shrink-0">
            <CreateContButton templateDefault={"undefined"}>
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-xl
                          bg-gray-900 text-white hover:bg-gray-800 
                          transition-all duration-200 group border-2 border-gray-800
                          hover:shadow-lg"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Create Container</span>
              </button>
            </CreateContButton>
          </div>
        </div>
      </div>

      <div>
        {(projects && projects.length > 0) ? (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Total Containers</h3>
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">{projects.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Running Containers</h3>
                  <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {projects.filter(p => p.Status === 'running').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Total Memory Usage</h3>
                  <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    System
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {Math.round(projects.reduce((acc, curr) => acc + (curr.MemoryUsage / 1024 / 1024 || 0), 0))}MB
                </p>
              </div>
            </div>

            {/* Recent Containers Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-gray-800">Recent Containers</h2>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Last 5
                    </span>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <TailwindcssButtons idx={1} onClick={() => navigate("/containers")}>
                      Show all
                    </TailwindcssButtons>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <HoverEffect items={projects.slice().reverse().slice(0,5)} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12">
            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Container Management!</h3>
              <p className="text-gray-500 mb-8">
                Get started by creating your first container. Click the "Create Container" button above to begin your journey.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 w-full">
                <h4 className="text-left text-gray-800 font-semibold mb-4">Quick Start Guide:</h4>
                <div className="space-y-4">
                  {[
                    'Click on "Create Container" at the top of the page',
                    "Choose your preferred container template",
                    "Configure your container settings"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 text-left">
                      <span className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 font-semibold border border-gray-200">
                        {index + 1}
                      </span>
                      <p className="text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;