import React from "react";

const Popup = ({ visible, message, onClose, type = "success" }) => {
  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 ${bgColor} ${textColor} p-4 rounded shadow-lg`}
    >
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-2 bg-white text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
      >
        Close
      </button>
    </div>
  );
};

export default Popup;