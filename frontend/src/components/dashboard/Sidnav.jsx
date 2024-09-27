import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import { 
    FaUserAlt,
    FaRegChartBar,
    FaShoppingBag,
    FaFile,
    FaLightbulb,
    FaHome
}from "react-icons/fa";
import { TailwindcssButtons } from "@/components/ui/tailwindcss-buttons";

function Sidebar () {
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);
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
            icon: <FaHome />
        },
        {
            path: "/containers",
            name: "Containers",
            icon: <FaFile />
        },
        {
            path: "/templates",
            name: "Templates",
            icon: <FaShoppingBag />
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <FaLightbulb />
        },
        {
            path: "/about",
            name: "About",
            icon: <FaUserAlt />
        },
        
    ];

    return (
        <div style={{ width: isOpen ? "w-full" : "50px" }} className="border-r-2 border-stone-400 text-slate-900 w-64 min-h-screen p-4">
            
            <nav>
                <div className='flex flex-col'>
                    {menuItem.map((item, index) => (
                        <Link to={item.path} key={index}>
                            <div className='my-2 rounded-md'>
                            <TailwindcssButtons idx={0} className="w-full" isActive={isActive(item.path)}>
                                <div className='flex flex-row items-center'>
                                    <div className="icon m-2">{item.icon}</div>
                                    <div style={{ display: isOpen ? "block" : "none" }} className="block "> {item.name} </div>
                                </div>
                            </TailwindcssButtons>
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;