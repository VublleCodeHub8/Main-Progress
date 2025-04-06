import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HoverEffect } from "@/components/ui/card_container";
import { Plus } from "lucide-react";

export default function Home() {
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  async function newProject() {
    try {
      const res = await fetch("http://localhost:3000/container/createcontainer", {
        method: "POST",
        body: JSON.stringify({ template: "node" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.token,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        navigate(`/project/${data.containerId}`);
      } else if (res.status === 401) {
        alert("Not Authenticated!!");
      } else {
        alert("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project.");
    }
  }

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Terminus</h1>
          <p className="text-gray-600">Manage your development containers easily</p>
        </div>
        <button 
          onClick={newProject}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2.5 rounded-lg
                  bg-blue-600 text-white hover:bg-blue-700 
                  transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Your Recent Containers</h2>
        <HoverEffect 
          key={refreshTrigger}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
