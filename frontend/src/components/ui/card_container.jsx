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

  const handleSave =  async (index) => {
    console.log(editTitle);
    const response = await fetch(`http://localhost:3000/container/edit/${items[index].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        title: editTitle
      }),
    });

    if (response.ok) {
      alert("Container updated successfully");
      items[index].title = editTitle;
    } else {
      alert("Failed to update container");
    }
    setEditIndex(null);
  };

  return (
    <div>
      <div className={cn("flex flex-wrap py-2 border-1 border-neutral-800", className)}>
        {items.map((item, idx) => (
          <div
            key={item?.link}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => (!editIndex && !hoveronAction) && handlePath(item?.link)}
            style={{ cursor: editIndex === idx ? 'default' : 'pointer' }}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full bg-neutral-300 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            
            <Card>
              {editIndex === idx ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleSave(idx)}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <div>
                   <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  </div>
                  <div>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>{item.Status}</CardDescription>
                  </div>
                  <div>
                  <CardTitle>CPU</CardTitle>
                  <CardDescription>{item.CPU}</CardDescription>
                  </div>
                  <div>
                  <CardTitle>Memory</CardTitle>
                  <CardDescription>{item.Memory}</CardDescription>
                  </div>
                  <div
                  onMouseEnter={() => setHoveronAction(true)}
                  onMouseLeave={() => setHoveronAction(false)}><CardActions contStatus={item.Status} onEdit={() => handleEdit(hoveredIndex)} onDelete={() => handleDelete(hoveredIndex)} onStop={()=> handleStop(hoveredIndex)} onStart={()=> handleStart(hoveredIndex)} />
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-white border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}>
      <div className="relative z-50"></div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children
}) => {
  return (
    <h4 className={cn("text-zinc-900 font-bold tracking-wide", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children
}) => {
  return (
    <p
      className={cn(" text-zinc-600 tracking-wide leading-relaxed text-sm z-50", className)}>
      {children}
    </p>
  );
};

const CardActions = ({ onEdit, onDelete, onStop, contStatus, onStart }) => {
  return (
    <div className="flex justify-end m-2 p-1">
      <button
        onClick={onEdit}
        className="text-slate-600 hover:text-slate-900 p-1 mr-3 rounded transform transition-transform duration-200 hover:scale-125"
      >
        <FaEdit className="w-6 h-6" />
      </button>
      {contStatus === "running" ? (
        <button
          onClick={onStop}
          className="text-slate-600 hover:text-slate-900 p-1 mr-3 rounded transform transition-transform duration-200 hover:scale-125"
        >
          <FaStop className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={onStart}
          className="text-slate-600 hover:text-slate-900 p-1 mr-3 rounded transform transition-transform duration-200 hover:scale-125"
        >
          <FaPlay className="w-6 h-6" />
        </button>
      )}
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900 p-1 rounded transform transition-transform duration-200 hover:scale-125"
      >
        <FaTrash className="w-6 h-6" />
      </button>
    </div>
  );
};
