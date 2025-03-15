import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Power, Edit, Search, Shield, Plus, Save, Box, Activity } from "lucide-react";
import Popup from "@/components/Popup";
import { set } from "react-hook-form";

const AdminTempEdit = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const [updateTemplate, setUpdateTemplate] = useState({
    id: "",
    name: "",
    phase: "",
    description: "",
    price: "",
  });
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    image: "",
    phase: "",
    description: "",
    price: "",
  });

  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchTemplates = async () => {
      const currRole = token.role;
      const endpoint = currRole === 'admin' ? "http://localhost:3000/dev/getAllTemplates" : `http://localhost:3000/dev/getUserTemplates/${token.email}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      const data = await response.json();
      const mockTemplates = data.map((template) => ({
        id: template._id,
        name: template.name,
        phase: template.phase,
        description: template.description,
        price: template.price,
      }));
      setTemplates(mockTemplates);
    };
    fetchTemplates();
  }, [token]);

  const handleTemplateSelection = (e) => {
    const templateId = e.target.value;
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(templateId);
    if (template) {
      setUpdateTemplate({
        name: template.name,
        phase: template.phase,
        description: template.description,
        price: template.price,
      });
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/dev/addNewTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`, // If you use token-based auth
        },
        body: JSON.stringify(newTemplate),
      });
      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.statusText}`);
        setPopupMessage("Failed to create template");
        setPopupType("error");
        setPopupVisible(true);
      }
      setPopupMessage("Template created successfully");
      setPopupType("success");
      setPopupVisible(true);
      setNewTemplate({ name: "", image: "", phase: "", description: "", price: "" });
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    } catch (error) {
      console.error("Error creating template:", error);
      setPopupMessage("Failed to create template");
      setPopupType("error");
      setPopupVisible(true);
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    // console.log(selectedTemplate)
    updateTemplate.id = selectedTemplate;
    try {
      const response = await fetch("http://localhost:3000/dev/updateTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify(updateTemplate),
      });
      if (!response.ok) {
        throw new Error(`Failed to update template: ${response.statusText}`);
        setPopupMessage("Failed to update template");
        setPopupType("error");
        setPopupVisible(true);
      }
      setPopupMessage("Template updated successfully");
      setPopupType("success");
      setPopupVisible(true);
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === updateTemplate.id ? { ...template, ...updateTemplate } : template // 
        )
      );
      setSelectedTemplate(null);
      setUpdateTemplate({ name: "", phase: "", description: "", price: "" });
    } catch (error) {
      console.error("Error updating template:", error.message);
      setPopupMessage("Failed to update template");
      setPopupType("error");
      setPopupVisible(true);
    }
  };

  const filteredTemplates = templates.filter((template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {/* Header Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-800 to-black 
                           flex items-center justify-center shadow-md">
                <Edit className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Template Editor
                </h1>
                <p className="text-gray-500">
                  Manage and modify container templates
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/templates"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-gray-100 rounded-lg hover:bg-gray-200 
                       transition-all duration-200 shadow-sm hover:shadow group"
            >
              <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Templates
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-all duration-200 shadow-sm hover:shadow group"
            >
              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Dashboard
            </Link>
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                       bg-black rounded-lg hover:bg-gray-800 
                       transition-all duration-200 shadow-sm hover:shadow group"
            >
              <Power className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Logout
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-12 py-2.5 text-sm
                       border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent
                       placeholder-gray-400 transition-all duration-200
                       bg-gray-50 hover:bg-white focus:bg-white"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-block
                          px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
              Press /
            </kbd>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Template Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 
                      transition-all duration-300 hover:shadow-md">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Plus className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Create Template</h2>
                <p className="text-sm text-gray-500 mt-1">Add a new container template</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleCreateTemplate} className="p-6 space-y-6">
            <EnhancedFormField
              label="Template Name"
              type="text"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              placeholder="Enter template name"
              icon={<Edit className="h-4 w-4" />}
            />
            <EnhancedFormField
              label="Image Name"
              type="text"
              value={newTemplate.image}
              onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
              placeholder="Enter image name"
              icon={<Box className="h-4 w-4" />}
            />
            <EnhancedFormField
              label="Development Phase"
              type="select"
              value={newTemplate.phase}
              onChange={(e) => setNewTemplate({ ...newTemplate, phase: e.target.value })}
              options={[
                { value: "", label: "Select Phase", disabled: true },
                { value: "Development", label: "Development" },
                { value: "Production", label: "Production" },
                { value: "Testing", label: "Testing" }
              ]}
              icon={<Activity className="h-4 w-4" />}
            />
            <EnhancedFormField
              label="Description"
              type="textarea"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              placeholder="Enter template description"
              icon={<Edit className="h-4 w-4" />}
            />
            <EnhancedFormField
              label="Price (per hour)"
              type="number"
              value={newTemplate.price}
              onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
              placeholder="0.00"
              icon={<span className="text-sm font-medium">$</span>}
            />
            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 
                       transition-all duration-200 flex items-center justify-center gap-2
                       focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </button>
          </form>
        </div>

        {/* Update Template Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 
                      transition-all duration-300 hover:shadow-md">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Save className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Update Template</h2>
                <p className="text-sm text-gray-500 mt-1">Modify existing template</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <EnhancedFormField
              label="Select Template"
              type="select"
              value={selectedTemplate || ""}
              onChange={handleTemplateSelection}
              options={[
                { value: "", label: "-- Select Template --" },
                ...templates.map(template => ({
                  value: template.id,
                  label: template.name
                }))
              ]}
              icon={<Search className="h-4 w-4" />}
            />
            
            {selectedTemplate && (
              <form onSubmit={handleUpdateTemplate} className="space-y-6 animate-fadeIn">
                <EnhancedFormField
                  label="Template Name"
                  type="text"
                  value={updateTemplate.name}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                  icon={<Edit className="h-4 w-4" />}
                />
                <EnhancedFormField
                  label="Development Phase"
                  type="select"
                  value={updateTemplate.phase}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, phase: e.target.value })}
                  options={[
                    { value: "", label: "Select Phase", disabled: true },
                    { value: "Development", label: "Development" },
                    { value: "Production", label: "Production" },
                    { value: "Testing", label: "Testing" }
                  ]}
                  icon={<Activity className="h-4 w-4" />}
                />
                <EnhancedFormField
                  label="Description"
                  type="textarea"
                  value={updateTemplate.description}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, description: e.target.value })}
                  placeholder="Enter template description"
                  icon={<Edit className="h-4 w-4" />}
                />
                <EnhancedFormField
                  label="Price (per hour)"
                  type="number"
                  value={updateTemplate.price}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, price: e.target.value })}
                  placeholder="0.00"
                  icon={<span className="text-sm font-medium">$</span>}
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 
                           transition-all duration-200 flex items-center justify-center gap-2
                           focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <Save className="h-4 w-4" />
                  Update Template
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={popupType}
      />
    </div>
  );
};

// Enhanced FormField component
const EnhancedFormField = ({ label, type, value, onChange, options, placeholder, icon }) => {
  const baseClassName = `w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-700 
                        focus:border-black focus:outline-none focus:ring-1 focus:ring-black 
                        transition-all duration-200 bg-white hover:bg-gray-50/50
                        ${icon ? 'pl-10' : ''}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        {type === 'select' ? (
          <select 
            value={value} 
            onChange={onChange} 
            className={`${baseClassName} appearance-none`}
            required
          >
            {options.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClassName} min-h-[100px] resize-y`}
            required
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseClassName}
            required
          />
        )}
      </div>
    </div>
  );
};

// Add this to your CSS
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;

export default AdminTempEdit;