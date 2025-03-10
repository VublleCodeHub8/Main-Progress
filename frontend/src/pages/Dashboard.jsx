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
import { fetchUserData, updateUserData, setEditMode } from "../store/userSlice";


const useAuth = () => {
  const token = useSelector((state) => state.misc.token);
  const isAuthenticated = token.token != null;
  return { isAuthenticated };
};

function DashboardLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.misc.token);
  const { user, status, isEditMode } = useSelector((state) => state.user);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  useEffect(() => {
      if (token) {
        dispatch(fetchUserData(token));
      }
    }, [dispatch, token]);

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

  return (
    <>
      <div className="flex flex-col h-screen bg-home_background">
        <div className="border-b-2  border-stone-400 text-gray-600 h-16 flex items-center justify-between p-4">
          <div className="text-2xl font-bold px-5">
          <svg height="40" width="220" xmlns="http://www.w3.org/2000/svg">
  <text  y="34" fill="darkblue" stroke="darkblue" font-size="48">Terminus</text>
</svg>
          </div>

          <div className="flex items-center pr-20">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center focus:outline-none text-2xl font-bold border-2 bg-white  border-slate-400 rounded-md p-1 ">
              
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.profilePicUrl || "https://via.placeholder.com/150"}
                    alt="@shadcn" 
                    className="rounded-lg w-12 h-12"
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div className="ml-1 border-l-2 border-x-slate-400 px-1">{user?.username}</div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-48 ">
                <DropdownMenuItem onSelect={() => navigate("/profile")} className="text-lg">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/containers")} className="text-lg">
                  My Containers
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/analytics")} className="text-lg">
                  Analytics
                </DropdownMenuItem>
                {/* <DropdownMenuItem onSelect={() => navigate("/settings")} className="text-lg">
                  Settings
                </DropdownMenuItem> */}
                <DropdownMenuItem onSelect={handleLogout} className="text-lg">
                  Logout
                </DropdownMenuItem>
                {token.role === "admin" && (
                  <>
                  <DropdownMenuItem onSelect={() => navigate("/admin")} className="text-lg">
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/dev")} className="text-lg">
                    Dev Dashboard
                  </DropdownMenuItem>
                  </>
                )}
                {token.role === "dev" && (
                
                  <DropdownMenuItem onSelect={() => navigate("/dev")} className="text-lg">
                    Dev Dashboard
                  </DropdownMenuItem>
                
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar />
          <div className="w-full justify-center flex-wrap px-20 py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
