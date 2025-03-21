import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo or Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </motion.div>

          {/* Headings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              TERMINUS
            </h1>
            <p className="text-xl text-gray-500">Where Code Meets Cloud</p>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-gray-400 mt-8 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A powerful cloud development environment that revolutionizes how you code. 
            Build, test, and deploy with unprecedented ease and efficiency.
          </motion.p>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              { 
                icon: "⚡", 
                title: "Lightning Fast", 
                desc: "Zero setup time, instant development environment" 
              },
              { 
                icon: "🔒", 
                title: "Secure Platform", 
                desc: "Enterprise-grade security for your code" 
              },
              { 
                icon: "🚀", 
                title: "Rapid Deployment", 
                desc: "From development to production in minutes" 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleAuth}
              className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/10"
            >
              Launch Terminus
            </button>
            <button
              onClick={handleAuth}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
            >
              Explore Features
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 text-center p-6 text-gray-500 text-sm backdrop-blur-sm bg-black/50"
      >
        <p>© 2024 Terminus. The Future of Cloud Development.</p>
      </motion.div>
    </div>
  );
};

export default Landing;
