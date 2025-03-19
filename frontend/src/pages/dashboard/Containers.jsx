import React, {useState , useEffect} from 'react';
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";
import {  Loader2} from "lucide-react";

// const projects = [
//     {
//       title: "Stripe",
//       description:
//         "A technology company that builds economic infrastructure for the internet.",
//       link: "#",
//     },
//     {
//       title: "Netflix",
//       description:
//         "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
//       link: "#",
//     },
//     {
//       title: "Google",
//       description:
//         "A multinational technology company that specializes in Internet-related services and products.",
//       link: "#",
//     },
//     {
//       title: "Meta",
//       description:
//         "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
//       link: "#",
//     },
//     // {
//     //   title: "Amazon",
//     //   description:
//     //     "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
//     //   link: "https://amazon.com",
//     // },
//     // {
//     //   title: "Microsoft",
//     //   description:
//     //     "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
//     //   link: "https://microsoft.com",
//     // },
//   ];

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



function  Containers(){
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchContainers = async () => {
    try {
      const tok = JSON.parse(localStorage.getItem("token"));
      // console.log(tok);
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
          
        };
      }));
      // console.log(userContainers);
      setProjects(userContainers);
      if (data === null) {
        // console.log("empytyjhbj")
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  fetchContainers();}, []);
    return (
      <div>
      <div className="mt-8 flex justify-between pr-32">
        <div>
        <h2 className="text-3xl bg-transparent font-bold">Containers</h2>
        </div>
      </div>

      <div className="rounded-sm h-auto overflow-auto">
        <div className=" text-black border-2 h-[700px] overflow-auto justify-center ">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="text-gray-600 font-medium">Loading containers...</span>
          </div>
        </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error: {error.message}</h3>
          </div>
        ) : projects.length === 0 ? (
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Containers Found</h3>
            <p className="text-gray-500">Start by creating your first container</p>
          </div>
        ) : (
          <HoverEffect items={projects} />
        )}
        </div>
        {/* Add more containers as needed */}
      </div>
      </div>
    );
}

export default Containers;