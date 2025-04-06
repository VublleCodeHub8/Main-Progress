import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    FaUserAlt,
    FaRegChartBar,
    FaShoppingBag,
    FaFile,
    FaLightbulb,
    FaHome,
    FaCog,
    FaBug
} from "react-icons/fa";

function Sidebar({ isOpen }) {
    const token = useSelector((state) => state.misc.token);
    const location = useLocation();
    
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

    return (
        <aside 
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-300 ease-in-out z-40
                ${isOpen ? "w-[12rem]" : "w-[5rem]"}`}
        >
            {/* Navigation Items */}
            <div className="flex-1 py-4 h-full">
                {filteredMenuItems.map((item, index) => (
                    <Link to={item.path} key={index} className="block">
                        <div className={`px-4 py-4 my-1 mx-2 rounded-md transition-all duration-300 ease-in-out
                            ${isActive(item.path) 
                                ? "bg-blue-50 text-blue-600" 
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <div className="flex items-center">
                                <div className={`text-lg ${isActive(item.path) ? "text-blue-600" : "text-gray-500"}`}>
                                    {item.icon}
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"}`}>
                                    <span className={`font-medium whitespace-nowrap ${isActive(item.path) ? "font-semibold" : ""}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* User Profile Section */}
            {isOpen && (
                <div className="p-4 border-t border-gray-200 mt-auto">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaUserAlt className="text-gray-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">
                                {token?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {token?.role || "User"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
