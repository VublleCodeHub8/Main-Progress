import React, { useEffect, useState } from "react";
import AuthForm from "@/components/AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { miscActions } from "@/store/main";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogOut, User, ShieldCheck, Globe, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const newToast = useSelector((state) => state.misc.toastMsg);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.misc.token);
  const fallback = useSelector((state) => state.misc.fallback);

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (newToast) {
      if (newToast.mood === "success") {
        toast.success(newToast.msg, {
          icon: "✔️",
          className: "custom-toast-success",
        });
      } else if (newToast.mood === "fail") {
        toast.error(newToast.msg, {
          icon: "⚠️",
          className: "custom-toast-error",
        });
      }
    }
  }, [newToast]);

  function close() {
    dispatch(miscActions.setToast(null));
  }

  async function signOut() {
    if (token.token != null) {
      const tok = token.token;
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: tok,
          expiry: new Date(new Date().getTime() - 1000).toISOString(),
        })
      );
      dispatch(miscActions.setToken({ token: null, expiry: null }));
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
      </div>

      <AnimatePresence>
        {!animationComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <ShieldCheck className="text-white" size={48} />
              <h1 className="text-4xl font-bold text-white">Secure Access</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-[#1a1a1a] border-[#333] border-2 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-[#0a0a0a] py-8 px-10 border-b border-[#333]">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors duration-300"
                >
                  <Home className="h-5 w-5" />
                </Button>
                <CardTitle className="text-3xl font-bold text-center text-white flex items-center justify-center space-x-4">
                  <Globe className="text-gray-400" size={32} />
                  <span>Authentication Portal</span>
                  {token.token && (
                    <span className="text-sm text-green-500 bg-green-900/30 px-3 py-1 rounded-full">
                      Authenticated
                    </span>
                  )}
                </CardTitle>
                <div className="w-10" /> {/* Spacer for alignment */}
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="flex flex-col items-center justify-center space-y-8">
                {fallback === true ? (
                  <div className="flex items-center space-x-3 text-gray-400">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1, 
                        ease: "linear" 
                      }}
                    >
                      <ShieldCheck size={24} />
                    </motion.div>
                    <span>Securing Connection...</span>
                  </div>
                ) : token.token != null ? (
                  <div className="flex flex-col items-center space-y-8">
                    <div className="bg-[#2a2a2a] p-8 rounded-xl flex items-center space-x-6">
                      <div className="bg-blue-500/10 p-3 rounded-lg">
                        <User className="text-blue-400" size={32} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-lg font-medium text-gray-200">Welcome,</p>
                          <span className="px-3 py-1 text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            {token.email || "User"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#333] hover:border-gray-600 transition-colors duration-300">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400 font-medium">Login time:</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">
                            {token.expiry ? (
                              (() => {
                                const expiryDate = new Date(token.expiry);
                                const loginDate = new Date(expiryDate.getTime() - (30 * 24 * 60 * 60 * 1000));
                                const timeAgo = Math.floor((new Date() - loginDate) / (1000 * 60)); // minutes ago
                                
                                let timeAgoStr = '';
                                if (timeAgo < 60) {
                                  timeAgoStr = `${timeAgo} ${timeAgo === 1 ? 'minute' : 'minutes'} ago`;
                                } else if (timeAgo < 1440) {
                                  const hours = Math.floor(timeAgo / 60);
                                  timeAgoStr = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                                } else {
                                  const days = Math.floor(timeAgo / 1440);
                                  timeAgoStr = `${days} ${days === 1 ? 'day' : 'days'} ago`;
                                }

                                return (
                                  <span className="flex items-center space-x-2">
                                    <span className="text-gray-200">{loginDate.toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-blue-400/90 font-medium">{timeAgoStr}</span>
                                  </span>
                                );
                              })()
                            ) : "Unknown time"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={signOut} 
                      className="bg-transparent border-red-600 text-red-500 hover:bg-red-950/30 hover:text-red-700 hover:border-red-700 flex items-center space-x-2 px-6 py-3 transition-colors duration-300"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <AuthForm />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        onClose={close}
        draggable
        pauseOnHover
        theme="dark"
        className="custom-toast-container"
      />

      <style jsx global>{`
        body {
          background-color: black;
          color: white;
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .custom-toast-container .Toastify__toast {
          background-color: #1a1a1a;
          color: white;
          border: 1px #333;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
        
        .custom-toast-success {
          background-color: #064e3b;
          color: #6ee7b7;
        }
        
        .custom-toast-error {
          background-color: #7f1d1d;
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
}