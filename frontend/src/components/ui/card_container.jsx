import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, Loader, Plus } from "lucide-react";
import { useSelector } from 'react-redux';
import { 
  FaStar, FaStop, FaTrash, FaPlay, FaEdit, FaSpinner
}from "react-icons/fa";
import Popup from 'reactjs-popup';
import { FiX, FiSave, FiEdit3, FiRefreshCw } from "react-icons/fi";
import Swal from 'sweetalert2';

const getContainerStatus = async (containerId, token) => {
  try {
    const response = await fetch(`http://localhost:3000/container/details/${containerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch container status");
    }
    const details = await response.json();
    return {status: details.status, cpu: details.cpuUsagePercentage, memory: details.memoryUsagePercentage};
  } catch (error) {
    console.error("Error fetching container status:", error);
    return {status: "unknown", cpu: 0, memory: 0};
  }
};

export const HoverEffect = ({
  className,
  searchQuery = "",
  onRefresh = null
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [editIndex, setEditIndex] = useState(null);
  let [editTitle, setEditTitle] = useState("");
  let [hoveronAction, setHoveronAction] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    containerId: null,
    containerName: ''
  });
  // Fetch container data
  const fetchContainers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/container/listcontainers", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token.token,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch containers");
      }
      
      let data = await response.json();
      const userContainers = await Promise.all(data.map(async (container) => {
        const details = await getContainerStatus(container.id, token.token);
        return {
          id: container.id,
          title: container.name,
          lastUsed: container.lastUsed,
          link: `project/${container.id}`,
          Status: details.status,
          CPU: details.cpu,
          Memory: details.memory,
          Template: container.template,
        };
      }));
      
      setItems(userContainers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching containers:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchContainers();
  }, [token.token]);

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initiateDelete = (containerId, containerName) => {
    setDeleteConfirmation({
      isOpen: true,
      containerId,
      containerName
    });
  };

  const setContainerLoading = (containerId, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [containerId]: isLoading
    }));
  };

  const refreshData = async () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    } else {
      await fetchContainers();
    }
  };

  const handleDeleteContainer = async (containerId) => {
    try {
      setContainerLoading(containerId, true);
      
      const response = await fetch(`http://localhost:3000/container/delete/${containerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Container deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Update state to remove the deleted container
        setItems(prevItems => prevItems.filter(item => item.id !== containerId));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete container'
        });
      }
    } catch (error) {
      console.error(`Error deleting container ${containerId}`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error deleting container: ${error.message}`
      });
    } finally {
      setContainerLoading(containerId, false);
    }
  };

  const handleStopContainer = async (containerId) => {
    try {
      setContainerLoading(containerId, true);
      
      const response = await fetch(`http://localhost:3000/container/stop/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Container stopped successfully',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Update container status in the state
        setItems(prevItems => prevItems.map(item => 
          item.id === containerId 
            ? { ...item, Status: 'stopped' } 
            : item
        ));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to stop container'
        });
      }
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error stopping container: ${error.message}`
      });
    } finally {
      setContainerLoading(containerId, false);
    }
  };

  const handlePath = (link) => {
    window.location.href = link;
  };

  const handleEdit = async (index) => {
    setEditIndex(index);
    setEditTitle(filteredItems[index].title);
  };

  const handleDelete = (index) => {
    initiateDelete(filteredItems[index].id, filteredItems[index].title);
  };

  const handleStartContainer = async (containerId) => {
    try {
      setContainerLoading(containerId, true);
      
      const response = await fetch(`http://localhost:3000/container/start/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Container started successfully',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Update container status in the state
        setItems(prevItems => prevItems.map(item => 
          item.id === containerId 
            ? { ...item, Status: 'running' } 
            : item
        ));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to start container'
        });
      }
    } catch (error) {
      console.error(`Error starting container ${containerId}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error starting container: ${error.message}`
      });
    } finally {
      setContainerLoading(containerId, false);
    }
  };

  const handleStop = (index) => {
    Swal.fire({
      title: 'Stop Container',
      text: 'Are you sure you want to stop this container?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, stop it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStopContainer(filteredItems[index].id);
      }
    });
  };

  const handleStart = (index) => {
    Swal.fire({
      title: 'Start Container',
      text: 'Are you sure you want to start this container?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, start it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStartContainer(filteredItems[index].id);
      }
    });
  };

  const handleSave = async (index, formData) => {
    try {
      const containerId = filteredItems[index].id;
      setContainerLoading(containerId, true);
      
      const response = await fetch(`http://localhost:3000/container/edit/${containerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({
          title: formData.title
        }),
      });

      if (response.ok) {
        // Update container title in state
        setItems(prevItems => prevItems.map(item => 
          item.id === containerId 
            ? { ...item, title: formData.title } 
            : item
        ));
        
        // Show success message
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: 'success',
          title: 'Container name updated successfully'
        });
      } else {
        throw new Error("Failed to update container name");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message,
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setContainerLoading(filteredItems[index].id, false);
      setEditIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <FaSpinner className="animate-spin text-blue-500 w-10 h-10 mb-4" />
        <p className="text-gray-600 font-medium">Loading containers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Containers</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Containers</h2>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>
      
      <div className={cn("grid gap-4", className)}>
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => (!editIndex && !hoveronAction && !loadingStates[item.id]) && handlePath(item?.link)}
            style={{ cursor: editIndex === idx || loadingStates[item.id] ? 'default' : 'pointer' }}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
            
            <Card>
              {editIndex === idx ? (
                <EditContainerForm
                  item={item}
                  onSave={(formData) => {
                    handleSave(idx, formData);
                  }}
                  onCancel={() => setEditIndex(null)}
                  isLoading={loadingStates[item.id]}
                />
              ) : (
                <div className="p-6">
                  {loadingStates[item.id] && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                      <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-blue-500 w-8 h-8 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Processing...</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <LastUsed date={item.lastUsed} />
                    </div>

                    <div className="flex items-center space-x-8">
                      {/* Template */}
                      <div className="text-center">
                        <CardTitle className="text-sm mb-1">Template</CardTitle>
                        <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
                          <svg 
                            className="w-4 h-4 mr-1.5 text-blue-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-blue-700">{item.Template}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <CardTitle className="text-sm mb-1">Status</CardTitle>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.Status === 'running' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'}`}>
                          {item.Status}
                        </span>
                      </div>

                      {/* CPU Usage */}
                      <div className="text-center">
                        <CardTitle className="text-sm mb-1">CPU</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${item.CPU || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {item.CPU}
                          </span>
                        </div>
                      </div>

                      {/* Memory Usage */}
                      <div className="text-center">
                        <CardTitle className="text-sm mb-1">Memory</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(item.Memory / 1000) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {item.Memory}MB
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        onMouseEnter={() => setHoveronAction(true)}
                        onMouseLeave={() => setHoveronAction(false)}
                        className="flex items-center"
                      >
                        <CardActions 
                          contStatus={item.Status} 
                          onEdit={() => handleEdit(hoveredIndex)} 
                          onDelete={() => handleDelete(hoveredIndex)} 
                          onStop={() => handleStop(hoveredIndex)} 
                          onStart={() => handleStart(hoveredIndex)} 
                          isLoading={loadingStates[item.id]} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Box className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No containers found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "You don't have any containers yet. Create one to get started."}
            </p>
            <button
              onClick={() => navigate('/containers/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Create Container</span>
            </button>
          </div>
        )}
      </div>
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, containerId: null, containerName: '' })}
        onConfirm={() => {
          handleDeleteContainer(deleteConfirmation.containerId);
          setDeleteConfirmation({ isOpen: false, containerId: null, containerName: '' });
        }}
        containerName={deleteConfirmation.containerName}
        isLoading={loadingStates[deleteConfirmation.containerId]}
      />
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "relative z-20 rounded-xl bg-white border border-gray-200 shadow-sm",
        "transition-all duration-200 ease-in-out",
        "group-hover:border-blue-200 group-hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn(
      "font-semibold text-gray-900 tracking-tight",
      className
    )}>
      {children}
    </h4>
  );
};


const CardActions = ({ onEdit, onDelete, onStop, contStatus, onStart, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-24">
        <FaSpinner className="animate-spin text-blue-500 w-5 h-5" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit Container"
        disabled={isLoading}
      >
        <FaEdit className="w-5 h-5" />
      </motion.button>

      {contStatus === "running" ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Stop Container"
          disabled={isLoading}
        >
          <FaStop className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Start Container"
          disabled={isLoading}
        >
          <FaPlay className="w-5 h-5" />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDelete}
        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Container"
        disabled={isLoading}
      >
        <FaTrash className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

// Enhanced Edit Container Modal
const EditContainerForm = ({ item, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: item.title
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 relative"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-blue-500 w-8 h-8 mb-2" />
            <span className="text-sm font-medium text-gray-700">Saving changes...</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Edit Container</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Container Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Container Name
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                     bg-gray-50 hover:bg-white focus:bg-white"
            placeholder="Enter container name"
            autoFocus
            disabled={isLoading}
          />
        </div>

        {/* Container Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
              ${item.Status === 'running' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'}`}>
              {item.Status}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">CPU Usage</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${item.CPU || 0}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{item.CPU}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Memory Usage</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${(item.Memory / 1000) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{item.Memory}MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(formData)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors
                   flex items-center justify-center space-x-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <FiSave className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
          disabled={isLoading}
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
};

// Add this new component for LastUsed
const LastUsed = ({ className, date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never used';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={cn(
      "flex items-center text-sm text-gray-500",
      className
    )}>
      <svg 
        className="w-4 h-4 mr-1.5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formatDate(date)}
    </div>
  );
};

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, containerName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
         onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

        {/* Dialog */}
        <div 
          className="relative transform overflow-hidden rounded-xl bg-white px-6 py-6 text-left shadow-2xl transition-all w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <FaSpinner className="animate-spin text-blue-500 w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-gray-700">Deleting container...</span>
              </div>
            </div>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Warning Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Container
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                You are about to delete the container:
              </p>
              <p className="mt-2 text-base font-medium text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-100">
                {containerName}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. The container and all its data will be permanently removed.
              </p>
            </div>

            {/* Warning Message */}
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This will permanently delete all container data and configurations.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium 
                         text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                         transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium 
                         text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                         transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 -ml-1 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete Container
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Box = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
};
