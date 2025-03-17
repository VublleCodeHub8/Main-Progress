import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const CreateContButton = ({ templateDefault = 1, className, children }) =>{
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState(templateDefault);
  const [isLoading, setIsLoading] = useState(false);
  const handleTemplateChange = (value) => {
    setTemplate(value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    async function fetchTemplates() {
      const res = await fetch("http://localhost:3000/getAllTemplates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        let templates = data.map((template, index) => ({
          name: template.name,
          id: template?.id === null ? index : template.id,
          image: template.image,
          price: template.price,
          phase: template.phase,
        }));
        templates = templates.filter((template) => template.phase === "Production");
        // templates.unshift({ name: "Select Template", id: "", image: "undefined", price: 0, phase: "Production" });
        // console.log(" teok ", templates);
        setTemplates(templates);
      }
    }
    fetchTemplates();
  }, [token]);

  async function newProject() {
    try {
      const titleSchema = z
        .string()
        .min(3)
        .regex(/^[^\d]/, "Title should not start with a number")
        .regex(/^[a-zA-Z0-9 ]*$/, "Title should only contain alphanumeric characters");
      const templateSchema = z.string().min(1, "Template should not be null");

      try {
        titleSchema.parse(title);
        templateSchema.parse(template);

      } catch (e) {
        alert(e.errors[0].message);
        return;
      }

      const res = await fetch("http://localhost:3000/container/createcontainer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.token,
          title: title,
          template: template,
        },
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/project/${data.containerId}`);
      } else if (res.status === 401) {
        alert("Not Authenticated!!");
        navigate("/login");
      } else {
        alert("Error creating container");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating container");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Container</DialogTitle>
          <DialogDescription>
            Make a new template for your containers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="name" className="text-right">
              Template
            </Label>
            <Select onValueChange={handleTemplateChange} value={template}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Templates</SelectLabel>
                  {templates.map((template) => (
                    <SelectItem key={template.name} value={template.image}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3"
              onChange={handleTitleChange}
              value={title}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price:
            </Label>
            <div className="col-span-3">
              {templates.find((t) => t.image === template)?.price || "N/A"} / per hour
            </div>
          </div>
        </div>
        <DialogFooter>
          <TailwindcssButtons 
            idx={2} 
            onClick={()=>{setIsLoading(true); newProject();}}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Creating</span>
                <span className="animate-[bounce_1s_infinite]">...</span>
              </>
            ) : (
              "Create"
            )}
          </TailwindcssButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContButton;
