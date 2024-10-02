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

function CreateContButton(templateDefault = 1) {
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("");

  // async function newProject() {
  //     const res = await fetch("http://localhost:3000/container/createcontainer", {
  //     method: "GET",
  //     headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token?.token,
  //     },
  //     });
  //     if (res.ok) {
  //     const data = await res.json();
  //     console.log(data);
  //     navigate(`/project/${data.containerId}`);
  //     } else if (res.status === 401) {
  //     alert("Not Authenticated!!");
  //     navigate("/login");
  //     }
  // }
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
        const templates = data.map((template, index) => ({
          name: template.name,
          id: template?.id === null ? index : template.id,
          image: template.image,
        }));
        console.log(" teok ", templates);
        setTemplates(templates);
      }
    }
    fetchTemplates();
  }, [token, navigate]);

  async function newProject() {
    const titleSchema = z
      .string()
      .min(3)
      .regex(/^[^\d]/, "Title should not start with a number");
    const templateSchema = z.string().min(1, "Template should not be null");

    console.log(title, template);
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
      console.log(data);
      navigate(`/project/${data.containerId}`);
    } else if (res.status === 401) {
      alert("Not Authenticated!!");
      navigate("/login");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TailwindcssButtons idx={2}>+ CREATE</TailwindcssButtons>
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
            <Select onValueChange={handleTemplateChange} value={template.name}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Template" />
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
            />
          </div>
        </div>
        <DialogFooter>
          <TailwindcssButtons idx={2} onClick={newProject}>
            Create
          </TailwindcssButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContButton;
