import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const Popup = ({ visible, message, onClose, type = "success" }) => {
  useEffect(() => {
    if (visible) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const styles = {
    success: {
      bg: "bg-green-50 border-green-200",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: "text-green-800",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: "text-red-800",
    },
  };

  const { bg, icon, text } = styles[type];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center">
      <div
        className={`mt-4 flex items-center gap-3 ${bg} ${text} px-6 py-4 rounded-lg shadow-lg border
                   animate-slide-down backdrop-blur-sm`}
        style={{
          animation: "slideDown 0.5s ease-out, fadeIn 0.5s ease-out",
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {icon}
        </div>

        {/* Message */}
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`ml-4 rounded-full p-1 hover:bg-white/25 
                     transition-colors duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 
                     ${type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
        >
          <X className={`h-4 w-4 ${text}`} />
        </button>
      </div>
    </div>
  );
};

// Add these styles to your global CSS or tailwind.config.js
const styles = `
@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out, fadeIn 0.5s ease-out;
}
`;

export default Popup;