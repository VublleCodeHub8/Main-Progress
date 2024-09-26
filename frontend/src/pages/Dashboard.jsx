import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidnav";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const useAuth = () => {
  const token = useSelector((state) => state.misc.token);
  const isAuthenticated = token.token != null;
  return { isAuthenticated };
};

function DashboardLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.misc.token);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    navigate("/auth");
  };
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tok = JSON.parse(localStorage.getItem("token"));
        console.log(tok);
        const response = await fetch("http://localhost:3000/getuser", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        const data = await response.json();
        console.log(data);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // useEffect(() => {
  //   // Dummy user data
  //   const dummyUserData = {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //   };

  //   // Simulate an API call with a timeout
  //   const timer = setTimeout(() => {
  //     setUserData(dummyUserData);
  //     setLoading(false);
  //   }, 1000);

  //   // Cleanup the timer on component unmount
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      <div className="flex flex-col h-screen bg-home_background">
        <div className="border-b-2 border-stone-400 h-16 text-gray-600 flex items-center justify-end p-4">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center focus:outline-none">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="ml-2">{userData?.username}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-48">
                <DropdownMenuItem onSelect={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/containers")}>
                  My Containers
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 justify-center flex-wrap px-56 py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
