import React from 'react';
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";



const projects = [
    {
      title: "Stripe",
      description:
        "A technology company that builds economic infrastructure for the internet.",
      link: "#",
    },
    {
      title: "Netflix",
      description:
        "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
      link: "#",
    },
    {
      title: "Google",
      description:
        "A multinational technology company that specializes in Internet-related services and products.",
      link: "#",
    },
    {
      title: "Meta",
      description:
        "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
      link: "#",
    },
    // {
    //   title: "Amazon",
    //   description:
    //     "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    //   link: "https://amazon.com",
    // },
    // {
    //   title: "Microsoft",
    //   description:
    //     "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    //   link: "https://microsoft.com",
    // },
  ];

function  Containers(){
    return (
        <div>
        <div className="mt-8 flex justify-between pr-32">
          <div>
          <h2 className="text-3xl bg-transparent font-bold">Containers</h2>
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
}

export default Containers;