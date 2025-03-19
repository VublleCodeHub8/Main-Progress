import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Trash, Edit  } from "lucide-react";
import { useSelector } from 'react-redux';
import { 
  FaStar, FaStop, FaTrash, FaPlay, FaEdit
}from "react-icons/fa";
import Popup from 'reactjs-popup';
import { FiX, FiSave, FiEdit3 } from "react-icons/fi";
import Swal from 'sweetalert2';



export const HoverEffect = ({
  items,
  className
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [editIndex, setEditIndex] = useState(null);
  let [editTitle, setEditTitle] = useState("");
  let [hoveronAction, setHoveronAction] = useState(false);
  const token = useSelector((state) => state.misc.token);
  const navigate = useNavigate();

  const handleDeleteContainer = async (containerId) => {
    try {
      const response = await fetch(`http://localhost:3000/container/delete/${containerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      // console.log(response);
      if (response.ok) {
        // Fetch the latest data to refresh the page 
        // await fetchData();
      } else {
        console.error(`Failed to delete container ${containerId}`);
      }
    } catch {
      console.error(`Error deleting container ${containerId}`, error);
    }
  };
  const handleStopContainer = async (containerId) => {
    try {
      // wait for the response before fetching the latest data
      const response = await fetch(`http://localhost:3000/container/stop/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      // console.log(response);
      if (response.ok) {
        alert("Container stopped successfully");
        items[index].Status = "stopped";
      } else {
        console.error(`Failed to stop container ${containerId}`);
      }
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
    }
  };

  const handlePath = (link) => {
    window.location.href = link;
  };

  const handleEdit = async (index) => {
    setEditIndex(index);
    setEditTitle(items[index].title);

  };

  const handleDelete = (index) => {
    // Implement delete functionality here
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Perform the delete action here
      // console.log(`Delete item at index ${index} with title ${items[index].id} `);
      handleDeleteContainer(items[index].id);
      items.splice(index, 1);
      alert('Item deleted successfully');
    }
  };

  const handleStartContainer = async (containerId) => {
    try {
      const response = await fetch(`http://localhost:3000/container/start/${containerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        alert("Container started successfully");
        items[index].Status = "running";
      } else {
        console.error(`Failed to start container ${containerId}`);
      }
    } catch (error) {
      console.error(`Error starting container ${containerId}:`, error);
    }
  };

  const handleStop = (index) => {
    // Implement stop functionality here
    if (window.confirm('Are you sure you want to stop this item?')) {
      // console.log(`status item at index ${index} with title ${items[index].id} `);
      handleStopContainer(items[index].id);
      alert('Item stopped successfully');
      items[index].Status = "stopped";
      // console.log(items[index].Status);
    }
  };

  const handleStart = (index) => {
    // Implement start functionality here
    if (window.confirm('Are you sure you want to start this item?')) {
      // console.log(`status item at index ${index} with title ${items[index].id} `);
      handleStartContainer(items[index].id);
    }
  };

  const handleSave = async (index, formData) => {
    try {
      const response = await fetch(`http://localhost:3000/container/edit/${items[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description
        }),
      });

      if (response.ok) {
        // Update local state
        items[index].title = formData.title;
        items[index].description = formData.description;
        
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
          title: 'Container updated successfully'
        });
      } else {
        throw new Error("Failed to update container");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message,
        confirmButtonColor: '#3B82F6'
      });
    }
    setEditIndex(null);
  };

  return (
    <div>
      <div className={cn("grid gap-4", className)}>
        {items.map((item, idx) => (
          <motion.div
            key={item?.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => (!editIndex && !hoveronAction) && handlePath(item?.link)}
            style={{ cursor: editIndex === idx ? 'default' : 'pointer' }}
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
                />
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </div>

                    <div className="flex items-center space-x-8">
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
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

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn(
      "text-gray-500 tracking-wide leading-relaxed",
      className
    )}>
      {children}
    </p>
  );
};

const CardActions = ({ onEdit, onDelete, onStop, contStatus, onStart }) => {
  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit Container"
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
      >
        <FaTrash className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

// Enhanced Edit Container Modal
const EditContainerForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || ''
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Edit Container</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
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
          />
        </div>

        {/* Container Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                     bg-gray-50 hover:bg-white focus:bg-white min-h-[100px]"
            placeholder="Enter container description"
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
        >
          <FiSave className="w-4 h-4" />
          <span>Save Changes</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
};
