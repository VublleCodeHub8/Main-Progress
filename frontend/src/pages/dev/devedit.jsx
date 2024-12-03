import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Power, Edit, Search } from "lucide-react";

const DevEdit = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
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
      const response = await fetch("http://localhost:3000/dev/getAllTemplates", {
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
      }
      setNewTemplate({ name: "", image: "", phase: "", description: "", price: "" });
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };



  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    console.log(selectedTemplate)
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
      }
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === updateTemplate.id ? { ...template, ...updateTemplate } : template // 
        )
      );
      setSelectedTemplate(null);
      setUpdateTemplate({ name: "", phase: "", description: "", price: "" });
    } catch (error) {
      console.error("Error updating template:", error.message);
    }
  };

  const filteredTemplates = templates.filter((template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  }))

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-4xl font-bold">Developer Dashboard</h1>
        </Link>
        <div className="flex gap-4">
          <Link
            to="/auth"
            className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            <Power className="h-4 w-4" />
            Logout
          </Link>
          <Link
            to="/dev"
            className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Edit className="h-4 w-4" />
            Dev
          </Link>
          {/* Admin Page Button */}
          {token.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <Edit className="h-4 w-4" />
              Admin Page
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex items-center rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
        <Search className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by template name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 w-full border-none outline-none focus:ring-0"
        />
      </div>

      {/* Forms */}
      <div className="flex gap-8">
        {/* Create Template Form */}
        <div className="w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Create New Template</h2>
          <form onSubmit={handleCreateTemplate}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Image </label>
              <input
                type="text"
                value={newTemplate.image}
                onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phase</label>
              <select
                value={newTemplate.phase}
                onChange={(e) => setNewTemplate({ ...newTemplate, phase: e.target.value })}
                className="w-full border p-2 rounded"
                required
              >
                <option value="" disabled>Select Phase</option>
                <option value="Development">Development</option>
                <option value="Production">Production</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full border p-2 rounded"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={newTemplate.price}
                onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create
            </button>
          </form>
        </div>

        {/* Update Template Form */}
        <div className="w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Update Existing Template</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Template</label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateSelection}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Template --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTemplate && (
            <form onSubmit={handleUpdateTemplate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={updateTemplate.name}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phase</label>
                <select
                  type="text"
                  value={updateTemplate.phase}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, phase: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="" disabled>Select Phase</option>
                  <option value="Development">Development</option>
                  <option value="Production">Production</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={updateTemplate.description}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, description: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={updateTemplate.price}
                  onChange={(e) => setUpdateTemplate({ ...updateTemplate, price: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevEdit;
