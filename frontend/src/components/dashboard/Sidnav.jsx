import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import { 
    FaUserAlt,
    FaRegChartBar,
    FaShoppingBag,
    FaFile,
    FaLightbulb,
    FaHome,
    FaCog,
    FaBug
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
        // {
        //     path: "/about",
        //     name: "About",
        //     icon: <FaUserAlt />
        // },
        {
            path: "/analytics",
            name: "Analytics",
            icon: <FaRegChartBar/>
        
        },
        {
            path : "/bugreport",
            name : "Bug Report",
            icon : <FaBug/>
        }
        
    ];

    return (
        <div style={{ width: isOpen ? "w-full" : "115px" }} className="border-r-2 border-stone-400 text-slate-900 w-[18rem] p-4">
            
                <div className='flex flex-col'>
                    {menuItem.map((item, index) => (
                        <Link to={item.path} key={index}>
                            <div className='my-2 rounded-md'>
                            <TailwindcssButtons idx={0} className="w-full " isActive={isActive(item.path)}>
                                <div className='flex flex-row items-center text-2xl hover:font-bold' >
                                    <div className="icon m-2 ">{item.icon}</div>
                                    <div style={{ display: isOpen ? "block" : "none" }} className="block pl-2"> {item.name} </div>
                                </div>
                            </TailwindcssButtons>
                            </div>
                        </Link>
                    ))}
                </div>
    
        </div>
    );
}

export default Sidebar;