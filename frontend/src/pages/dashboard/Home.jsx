
import { WobbleCard } from "@/components/ui/wobble-card";
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateContButton  from  "@/components/dashboard/CreateContainer"



function Home() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

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
          description: `Last used: ${container.lastUsed}`,
          link: `project/${container.id}`,
          Status: details.status,
          CPU: details.cpu,
          Memory: details.memory,
        };
      }));
      // userContainers = addContainerDetails(userContainers);
      // console.log(userContainers);
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
  // const data = [
  //   {
  //     title: "Stripe",
  //     description:
  //       "A technology company that builds economic infrastructure for the internet.",
  //     link: "#",
  //   },
  //   {
  //     title: "Netflix",
  //     description:
  //       "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
  //     link: "#",
  //   },
  //   {
  //     title: "Google",
  //     description:
  //       "A multinational technology company that specializes in Internet-related services and products.",
  //     link: "#",
  //   },
  //   {
  //     title: "Meta",
  //     description:
  //       "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
  //     link: "#",
  //   },
  //   // {
  //   //   title: "Amazon",
  //   //   description:
  //   //     "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
  //   //   link: "https://amazon.com",
  //   // },
  //   // {
  //   //   title: "Microsoft",
  //   //   description:
  //   //     "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
  //   //   link: "https://microsoft.com",
  //   // },
  // ];
  // setProjects(data);

  // fetchProjects();
}, []);


  return (
    <div>
      <div className=" ">
        <CreateContButton templateDefault = {"undefined"}>
          <TailwindcssButtons idx={2} > + Create Container</TailwindcssButtons>
        </CreateContButton>    
      {/* Add recent activity content */}
      </div>
    <div>
      {(projects && projects.length > 0 && (
        <div>
          <div className="mt-8 flex justify-between">
            <div>
              <h2 className="text-xl bg-transparent font-bold">Recent Containers</h2>
            </div>
            <div>
              <TailwindcssButtons idx={1} onClick={() => navigate("/containers")}>
                Show all
              </TailwindcssButtons>
            </div>
          </div>
          
          <div className="rounded-sm h-auto overflow-auto">
            <div className="justify-center content-center text-black border-2">
              <HoverEffect items={projects.slice().reverse().slice(0,5)} />
            </div>
            {/* Add more containers as needed */}
          </div>
        </div>
      )) || (
        <div className="flex flex-col items-center justify-center h-[400px] rounded-lg m-12">
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
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Container Management!</h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Get started by creating your first container. Click the "Create Container" button above to begin your journey.
          </p>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">1.</span>
              <p>Click on "+ Create Container" at the top of the page</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2">2.</span>
              <p>Choose your preferred container template</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2">3.</span>
              <p>Configure your container settings</p>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    );
}

export default Home;