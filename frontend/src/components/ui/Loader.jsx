import React from 'react';

const Loader = ({ title = "Loading", description = "Please wait while we fetch the data" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b ">
      <div className="text-center p-8 rounded-xl bg-white shadow-2xl transform hover:scale-105 transition-all duration-500">
        <div className="flex flex-col items-center gap-6">
          {/* Enhanced Loader Animation */}
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-24 h-24 border-8 border-gray-200 rounded-full animate-[spin_3s_linear_infinite]"></div>
            
            {/* Middle spinning ring */}
            <div className="absolute top-2 left-2 w-20 h-20 border-6 border-black border-t-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
            
            {/* Inner spinning ring */}
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-blue-500 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            
            {/* Center pulsing dot */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-black rounded-full animate-[pulse_1s_ease-in-out_infinite]">
              <div className="absolute top-0 left-0 w-full h-full bg-black rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Enhanced Loading Text */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 animate-pulse">
              {title}
              <span className="animate-[bounce_1s_ease-in-out_infinite]">.</span>
              <span className="animate-[bounce_1s_ease-in-out_infinite] delay-100">.</span>
              <span className="animate-[bounce_1s_ease-in-out_infinite] delay-200">.</span>
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite] delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite] delay-200"></div>
            </div>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[progressBar_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Loader; 