import React, { useState, useEffect } from "react";
import { HoverEffect } from "@/components/dashboard/TemplateCard";
// export const projects = [
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
//     {
//       title: "Amazon",
//       description:
//         "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
//       link: "#",
//     },
//     {
//       title: "Microsoft",
//       description:
//         "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
//       link: "#",
//     },
//   ];

const Templates = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        console.log(tok);
        const response = await fetch("http://localhost:3000/getAllTemplates", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        const data = await response.json();

        const userContainers = data.map((container) => ({
          title: container.name,
          description: `This is an image of : ${container.image}`,
          link: `project`,
        }));
        console.log(userContainers);
        setProjects(userContainers);
        if (data === null) {
          console.log("empytyjhbj");
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTemplates();
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
      <div className="mt-8 flex flex-col gap-3  pr-32">
        <div className="flex ">
          <h1 className="text-5xl bg-transparent ">Containers</h1>
        </div>
        <div className="flex ">
          <h2 className="text-xl bg-transparent ">
            Use Templates as the starting point for your next project.
          </h2>
        </div>
        <div className="flex ">
          <h2 className="text-2xl mt-6 bg-transparent font-bold ">
            What do you want to build?
          </h2>
        </div>
      </div>

      <div className="rounded-sm h-auto overflow-auto">
        <div className="max-w-5xl text-black">
          <HoverEffect items={projects} />
        </div>
        {/* Add more containers as needed */}
      </div>
    </div>
  );
};

export default Templates;
