
import { WobbleCard } from "@/components/ui/wobble-card";
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { HoverEffect } from "@/components/ui/card_container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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

function Home() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className=" ">
      <Dialog>
      <DialogTrigger asChild>
        <TailwindcssButtons idx={2} > + CREATE</TailwindcssButtons>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>
            Make a new template for your containers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="name" className="text-right">
              Template
            </Label>
            <Select >
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select Template" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Title
            </Label>
            <Input id="title"  className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
        <TailwindcssButtons idx={2} >Create</TailwindcssButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      {/* Add recent activity content */}
      </div>
    <div>
      <div className="mt-8 flex justify-between pr-32">
        <div>
        <h2 className="text-xl bg-transparent font-bold">Recent Containers</h2>
        </div>
        <div>
        <TailwindcssButtons idx={1} onClick={() => window.location.href = '/containers'}>
          {"Show all"}
        </TailwindcssButtons>
        </div>
      </div>
      
      <div className="rounded-sm h-auto overflow-auto">
        <div className="max-w-5xl text-black">
        <HoverEffect items={projects} />
        </div>
        {/* Add more containers as needed */}
      </div>
      </div>
    </div>
    );
}

export default Home;