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
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    containerId: null,
    containerName: ''
  });

  const initiateDelete = (containerId, containerName) => {
    setDeleteConfirmation({
      isOpen: true,
      containerId,
      containerName
    });
  };

  const handleDeleteContainer = async (containerId) => {
    try {
      const response = await fetch(`http://localhost:3000/container/delete/${containerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        window.location.reload();
      } else {
        console.error(`Failed to delete container ${containerId}`);
      }
    } catch (error) {
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
        items[hoveredIndex].Status = "stopped";
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
        items[hoveredIndex].Status = "running";
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
          title: formData.title
        }),
      });

      if (response.ok) {
        // Update local state
        items[index].title = formData.title;
        
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
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <LastUsed date={item.lastUsed} />
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
                          onDelete={() => initiateDelete(item.id, item.name)} 
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
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, containerId: null, containerName: '' })}
        onConfirm={() => {
          handleDeleteContainer(deleteConfirmation.containerId);
          setDeleteConfirmation({ isOpen: false, containerId: null, containerName: '' });
        }}
        containerName={deleteConfirmation.containerName}
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
    title: item.title
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

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, containerName }) => {
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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
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
              >
                <svg className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete Container
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
