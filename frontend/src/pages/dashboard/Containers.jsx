import React, {useState , useEffect} from 'react';
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";



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

function  Containers(){
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchContainers = async () => {
    try {
      const tok = JSON.parse(localStorage.getItem("token"));
      console.log(tok);
      const response = await fetch("http://localhost:3000/container/listcontainers", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + tok.token,
        },
      });
      const data = await response.json();
      
      const userContainers = data.map(container => ({
        title: container.name,
        description: `Last used: ${container.lastUsed}`,
        link: `project/${container.id}`
      }));
      console.log(userContainers);
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
      <div className="mt-8 flex justify-between pr-32">
        <div>
        <h2 className="text-3xl bg-transparent font-bold">Containers</h2>
        </div>
      </div>

      <div className="rounded-sm h-auto overflow-auto">
        <div className="max-w-5xl text-black border-2 h-[700px] overflow-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : projects.length === 0 ? (
          <div>No containers available</div>
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