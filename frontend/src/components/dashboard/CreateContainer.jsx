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
import { motion } from "framer-motion";
import { Box, Server, Clock, Check } from "lucide-react";

const CreateContButton = ({ templateDefault = 1, className, children }) => {
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
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Create Container
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure your new development environment
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Select Template
              </Label>
              {template && (
                <span className="text-xs text-gray-500">
                  {templates.find(t => t.image === template)?.name}
                </span>
              )}
            </div>
            <Select onValueChange={handleTemplateChange} value={template}>
              <SelectTrigger className="w-full border-2 h-11 transition-all duration-200 hover:border-gray-400 focus:border-gray-600 focus:ring-0">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent className="border-2">
                <SelectGroup>
                  <SelectLabel className="text-gray-500">Available Templates</SelectLabel>
                  {templates.map((template) => (
                    <SelectItem 
                      key={template.name} 
                      value={template.image}
                      className="focus:bg-gray-50 cursor-pointer py-3 px-4 m-1 rounded-lg
                                data-[state=checked]:bg-gray-50 group transition-all duration-200"
                    >
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        {/* Template Header with improved spacing */}
                        <div className="flex items-center">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center
                                          group-hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                              <Server className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-800 truncate">
                              {template.name}
                            </span>
                          </div>
                          {/* Added minimum gap between name and price */}
                          <div className="ml-6 flex-shrink-0">
                            <div className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                              ${template.price}/hr
                            </div>
                          </div>
                        </div>

                        {/* ... rest of template item content ... */}
                      </motion.div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Container Name */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Container Name
            </Label>
            <Input
              id="title"
              placeholder="Enter container name"
              className="border-2 h-11 transition-all duration-200 hover:border-gray-400 focus:border-gray-600 focus:ring-0"
              onChange={handleTitleChange}
              value={title}
            />
          </div>

          {/* Price Information */}
          {template && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Hourly Rate</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  ${templates.find((t) => t.image === template)?.price || "N/A"}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-2">
          <button
            onClick={() => {setIsLoading(true); newProject();}}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 
              ${isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Container...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Create Container</span>
              </div>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContButton;
