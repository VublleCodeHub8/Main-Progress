import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    FaUserAlt,
    FaRegChartBar,
    FaShoppingBag,
    FaFile,
    FaLightbulb,
    FaHome,
    FaCog,
    FaBug,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar({ isOpen }) {
    const token = useSelector((state) => state.misc.token);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeHover, setActiveHover] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const isActive = (path) => {
        if (path === '/') {
          return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const menuItem = [
        {
            path: "/",
            name: "Home",
            icon: <FaHome />,
            showFor: ['admin', 'dev', 'user']
        },
        {
            path: "/containers",
            name: "Containers",
            icon: <FaFile />,
            showFor: ['admin', 'dev', 'user']
        },
        {
            path: "/templates",
            name: "Templates",
            icon: <FaShoppingBag />,
            showFor: ['admin', 'dev', 'user']
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <FaLightbulb />,
            showFor: ['admin', 'dev', 'user']
        },
        {
            path: "/about",
            name: "About",
            icon: <FaUserAlt />,
            showFor: ['user']
        },  
        {
            path: "/analytics",
            name: "Analytics",
            icon: <FaRegChartBar/>,
            showFor: ['admin', 'dev', 'user']
        },
        {
            path: "/bugreport",
            name: "Bug Report",
            icon: <FaBug/>,
            showFor: ['admin', 'dev', 'user']
        }
    ];

    const filteredMenuItems = menuItem.filter(item => 
        item.showFor.includes(token?.role || 'user')
    );

    const fetchProfileData = async () => {
        try {
            const response = await fetch("http://localhost:3000/user/getprofiledata", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfileData();
        }
    }, [token]);

    // Get first letter of name for avatar
    const getNameInitial = () => {
        const name = profileData?.name || "User";
        return name.charAt(0).toUpperCase();
    };

    // Animation variants with refined parameters for smoother transitions
    const sidebarVariants = {
        expanded: {
            width: "18rem",
            transition: {
                type: "spring",
                stiffness: 200, // Reduced for smoother motion
                damping: 25,    // Adjusted for better feel
                mass: 0.8,      // Added mass for more natural movement
                velocity: 0.5   // Added initial velocity
            }
        },
        collapsed: {
            width: "5rem",
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 0.8,
                velocity: 0.5
            }
        }
    };

    const menuItemVariants = {
        expanded: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 0.8,
                delay: 0.05
            }
        },
        collapsed: {
            x: -20,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 0.8
            }
        }
    };

    // Custom easing function for smoother transitions
    const customEase = [0.25, 0.1, 0.25, 1];

    // Handle sign out
    const handleSignOut = () => {
        // Clear any auth tokens or user data from Redux/localStorage
        localStorage.removeItem('token');
        // You might want to dispatch an action to clear user state
        // dispatch(clearUserState());
        
        // Redirect to auth page
        navigate('/auth');
    };

    return (
        <motion.aside 
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 shadow-lg z-40
                ${isOpen ? "w-[18rem]" : "w-[5rem]"}`}
            initial={false}
            animate={isOpen ? "expanded" : "collapsed"}
            variants={sidebarVariants}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Toggle Button */}
            <motion.div 
                className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md cursor-pointer z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    // This would need to be connected to a parent component's state
                    // For now, we'll just log the action
                    console.log("Toggle sidebar");
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="collapse"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: 180 }}
                            transition={{ 
                                duration: 0.4,
                                ease: customEase
                            }}
                        >
                            <FaChevronLeft className="text-blue-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expand"
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: -180 }}
                            transition={{ 
                                duration: 0.4,
                                ease: customEase
                            }}
                        >
                            <FaChevronRight className="text-blue-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex flex-col h-full">
                <div className="flex-1 py-6 overflow-y-auto">
                    {filteredMenuItems.map((item, index) => (
                        <Link to={item.path} key={index} className="block">
                            <motion.div 
                                className={`px-4 py-3 my-1 mx-2 rounded-lg transition-all duration-300 ease-in-out relative
                                    ${isActive(item.path) 
                                        ? "bg-blue-500 text-white shadow-md" 
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onHoverStart={() => setActiveHover(index)}
                                onHoverEnd={() => setActiveHover(null)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isActive(item.path) && (
                                    <motion.div 
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"
                                        layoutId="activeIndicator"
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                    />
                                )}
                                <div className="flex items-center">
                                    <div className={`text-lg ${isActive(item.path) ? "text-white" : "text-gray-500"}`}>
                                        {item.icon}
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 25,
                                                    mass: 0.8,
                                                    delay: index * 0.03 // Reduced delay for faster appearance
                                                }}
                                                className="ml-3"
                                            >
                                                <span className={`font-medium whitespace-nowrap ${isActive(item.path) ? "font-semibold" : ""}`}>
                                                    {item.name}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
                
                {/* User Profile Section */}
                <div className="mt-auto border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div 
                                key="expanded-profile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 25,
                                    mass: 0.8,
                                    delay: 0.1
                                }}
                                className="p-4 relative"
                            >
                                <div className="flex items-center p-2 rounded-lg hover:bg-white/80 transition-all duration-300 group">
                                    <motion.div 
                                        className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {getNameInitial()}
                                    </motion.div>
                                    <div className="ml-3 flex-1">
                                        <motion.p 
                                            className="text-sm font-medium text-gray-800"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {profileData?.name || "User"}
                                        </motion.p>
                                        <motion.div 
                                            className="flex items-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className="flex items-center gap-1">
                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-200"></span>
                                                <span className="text-xs text-gray-600">
                                                    {token?.role === "admin" ? "Administrator" : token?.role === "dev" ? "Developer" : "User"}
                                                </span>
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>
                                <motion.div 
                                    className="mt-3 pt-3 border-t border-gray-200"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <motion.button 
                                        className="flex items-center w-full px-2 py-1.5 text-sm text-gray-600 hover:text-red-500 rounded hover:bg-red-50 transition-all duration-300"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSignOut}
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        <span>Sign Out</span>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="collapsed-profile"
                                className="p-4 flex justify-center"
                            >
                                <motion.div 
                                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {getNameInitial()}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}

export default Sidebar;
