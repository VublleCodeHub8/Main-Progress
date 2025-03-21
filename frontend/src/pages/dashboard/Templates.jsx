import React, { useState, useEffect } from "react";
import { HoverEffect } from "@/components/dashboard/TemplateCard";
import { motion } from "framer-motion";
import { Search, Server, Filter, ArrowUpDown } from "lucide-react";


// Add this gradient text component
const GradientText = ({ children, className = "" }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 ${className}`}>
    {children}
  </span>
);

const Templates = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, price

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        // console.log(tok);
        const response = await fetch("http://localhost:3000/getAllTemplates", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        let data = await response.json();
        data = data.filter((container) => container.phase === "Production");

        const userContainers = data.map((container) => ({
          title: container.name,
          description: container.description,
          link: `project`,
          image: container.image,
          price: container.price,
        }));
        // console.log(userContainers);
        setProjects(userContainers);
        if (data === null) {
          // console.log("empytyjhbj");
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredAndSortedProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="p-8">
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative"
      >
        {/* Background decoration */}
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-100 rounded-full opacity-50 blur-3xl" />
        
        {/* Main header content */}
        <div className="relative">
          {/* Title section */}
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-xl shadow-sm">
              <Server className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-500 uppercase tracking-wider mb-1"
              >
                Browse Our Collection
              </motion.div>
              <h1 className="text-5xl font-bold">
                <GradientText>Templates</GradientText>
              </h1>
            </div>
          </div>

          {/* Description section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 max-w-3xl"
          >
            <p className="text-xl text-gray-600 leading-relaxed">
              Use Templates as the starting point for your next project. Choose from our curated collection 
              of pre-configured development environments designed to accelerate your workflow.
            </p>
            
            {/* Key features */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pre-configured environments
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick deployment
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Production ready
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced "What do you want to build?" section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-bold mb-2">
              <GradientText>What do you want to build?</GradientText>
            </h2>
            <p className="text-gray-500">
              {searchQuery 
                ? `Found ${filteredAndSortedProjects.length} templates matching your search`
                : 'Search our template library to find the perfect starting point'}
            </p>
          </div>

          {/* Existing search and filter controls */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 
                          focus:outline-none focus:border-gray-400 
                          transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border-2 
                          focus:outline-none focus:border-gray-400 
                          transition-all duration-200 cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
              <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" />
              <span className="text-gray-600">Loading templates...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center h-64">
            <div className="bg-red-50 rounded-xl p-8 max-w-md text-center">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Templates</h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <div className="flex justify-center h-64">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery ? "No matching templates" : "No templates available"}
              </h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search terms" : "Check back later for new templates"}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HoverEffect items={filteredAndSortedProjects} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Templates;
