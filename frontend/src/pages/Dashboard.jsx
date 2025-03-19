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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { fetchUserData, updateUserData, setEditMode } from "../store/userSlice";
import { User, Box, BarChart, Shield, Code, LogOut } from "lucide-react";


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
        // console.log(tok);
        const response = await fetch("http://localhost:3000/getuser", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tok.token,
          },
        });
        const data = await response.json();
        // console.log(data);
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
      <div className="flex flex-col h-screen bg-home_background overflow-y-hidden">
        <div className="border-b-2  border-stone-400 text-gray-600 h-16 flex items-center justify-between p-4">
          <div className="text-2xl font-bold px-5">
          <svg height="40" width="220" xmlns="http://www.w3.org/2000/svg">
  <text  y="34" fill="darkblue" stroke="darkblue" font-size="48">Terminus</text>
</svg>
          </div>

          <div className="flex items-center pr-20">
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-3 px-3 py-2 
                                    bg-white border border-gray-200 rounded-xl
                                    hover:bg-gray-50 transition-all duration-200 
                                    focus:outline-none focus:ring-2 focus:ring-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                    <AvatarImage
                      src={user?.profilePicUrl || "https://github.com/shadcn.png"}
                      alt={user?.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {token.role === "admin" ? "Administrator" : 
                       token.role === "dev" ? "Developer" : "User"}
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center 
                              group-hover:bg-gray-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-500 transform group-hover:rotate-180 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 mt-2 p-1.5 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* User Info Section - More Compact */}
                <div className="px-3 py-2 bg-gray-50 rounded-md mb-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8 ring-1 ring-white shadow-sm">
                      <AvatarImage
                        src={user?.profilePicUrl || "https://github.com/shadcn.png"}
                        alt={user?.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-white text-gray-600 px-2 py-1 rounded-md border border-gray-200 inline-block">
                    {token.role === "admin" ? "Administrator" : token.role === "dev" ? "Developer" : "User"}
                  </div>
                </div>

                {/* Main Menu Items - More Compact */}
                <div className="p-1">
                  <DropdownMenuItem onSelect={() => navigate("/profile")} 
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                             hover:bg-gray-50 rounded-md transition-all duration-200">
                    <User className="h-4 w-4 text-gray-600" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => navigate("/containers")}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                             hover:bg-gray-50 rounded-md transition-all duration-200">
                    <Box className="h-4 w-4 text-gray-600" />
                    <span>My Containers</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => navigate("/analytics")}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                             hover:bg-gray-50 rounded-md transition-all duration-200">
                    <BarChart className="h-4 w-4 text-gray-600" />
                    <span>Analytics</span>
                  </DropdownMenuItem>
                </div>

                {/* Role-based Menu Items - More Compact */}
                {(token.role === "admin" || token.role === "dev") && (
                  <>
                    <DropdownMenuSeparator className="my-1 border-gray-200" />
                    <div className="p-1">
                      {token.role === "admin" && (
                        <DropdownMenuItem onSelect={() => navigate("/admin")}
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                   hover:bg-gray-50 rounded-md transition-all duration-200">
                          <Shield className="h-4 w-4 text-gray-600" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}

                      {token.role === "dev" && (
                        <DropdownMenuItem onSelect={() => navigate("/dev")}
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                   hover:bg-gray-50 rounded-md transition-all duration-200">
                          <Code className="h-4 w-4 text-gray-600" />
                          <span>Dev Dashboard</span>
                        </DropdownMenuItem>
                      )}
                    </div>
                  </>
                )}

                {/* Logout Section - More Compact */}
                <DropdownMenuSeparator className="my-1 border-gray-200" />
                <div className="p-1">
                  <DropdownMenuItem onSelect={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                             hover:bg-red-50 text-red-600 rounded-md transition-all duration-200">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar />
          <div className="w-full h-screen justify-center flex-wrap px-20 pt-10 pb-24 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
