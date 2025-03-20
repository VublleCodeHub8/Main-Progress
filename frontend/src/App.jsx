import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Wrapper from "./pages/Wrapper";
import Auth from "./pages/Auth";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { miscActions } from "./store/main";
import Project from "./pages/Project";
import Home from "./pages/dashboard/Home";
import DashboardLayout from "./pages/Dashboard";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import AboutUs from "./pages/dashboard/About";
import Containers from "./pages/dashboard/Containers";
import Templates from "./pages/dashboard/Templates";
import AdminWrapper from "./pages/AdminWrapper";
import AdminPage from "./pages/admin/page";
import DevWrapper from "./pages/DevWrapper";
import DevPage from "./pages/dev/devpage";
import Analytics from "./pages/dashboard/Analytics";
import DevEdit from "./pages/dev/devedit";
import AdminTemp from "./pages/admin/adminTemp";
import AdminTempEdit from "./pages/admin/adminTempEdit";
import BugReportForm from "./pages/dashboard/BugReport";
import ContactUs from "./pages/dashboard/ContactUs";
import Documentation from "./pages/dashboard/Documentation";
import BugReports from "./pages/admin/bugReports";
import ContainerHistory from "./pages/admin/containerHistory";
import AdminContactUs from "./pages/admin/adminContactUs";
const router = createBrowserRouter([
  {
    path: "auth",
    element: <Auth></Auth>,
  },
  {
    path: "",
    element: <Wrapper />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "about",
            element: <AboutUs />,
          },
          {
            path: "contact",
            element: <ContactUs />,
          },
          {
            path: "documentation",
            element: <Documentation />,
          },
          {
            path: "containers",
            element: <Containers />,
          },
          {
            path: "templates",
            element: <Templates />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "analytics",
            element: <Analytics />
          },
          // {
          //   path : "settings",
          //   element : <Settings/>
          // }
          {
            path: "bugreport",
            element: <BugReportForm />,
          }
        ],
      },
      {
        path: "project/:projectId",
        element: <Project />,
      },
      {
        // admin wrapper
        path: "/admin",
        element: <AdminWrapper />,
        children: [
          {
            path: "",
            element: <AdminPage />,
          },
          {
            path: "templates",
            element: <AdminTemp />,
          },
          {
            path: "templates/edit",
            element: <AdminTempEdit />,
          },
          {
            path: "bugreports",
            element: <BugReports />,
          },
          {
            path: "containerhistory",
            element: <ContainerHistory />,
          },
          {
            path: "contactus",
            element: <AdminContactUs />,
          }
        ],
      },
      {
        // Dev wrapper
        path: "/dev",
        element: <DevWrapper />,
        children: [
          {
            path: "",
            element: <DevPage />,
          },
          {
            path: "editor",
            element: <DevEdit />,
          }
        ],
      },
    ],
  },
]);

let timer;

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.misc.token);

  // console.log(token);

  useEffect(() => {
    async function checkForLogin() {
      dispatch(miscActions.setFallback(true));
      const userDetails =
        localStorage.getItem("token") != ""
          ? JSON.parse(localStorage.getItem("token"))
          : null;
      if (userDetails && new Date(userDetails.expiry) > new Date()) {
        await logIn();
      } else if (userDetails && !(new Date(userDetails.expiry) > new Date())) {
        await logOut();
      }
      dispatch(miscActions.setFallback(false));
      setLoading(false);
    }
    checkForLogin();
  }, [token]);

  async function logOut() {
    const tok = JSON.parse(localStorage.getItem("token"));
    // console.log(tok);
    const res = await fetch("http://localhost:3000/auth/signout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tok.token,
      },
    });
    if (res.ok) {
      localStorage.removeItem("token");
      dispatch(miscActions.setToken({ token: null, expiry: null }));
      dispatch(miscActions.setLogin(false));
      clearTimeout(timer);
    } else {
      return null;
    }
  }

  async function logIn() {
    const userDetails = JSON.parse(localStorage.getItem("token"));
    // console.log(userDetails);
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userDetails.token,
      },
    });
    if (res.ok) {
      if (timer) {
        clearTimeout(timer);
      }
      const expiryTime =
        new Date(userDetails.expiry).getTime() - new Date().getTime();
      // console.log(expiryTime);
      timer = setTimeout(
        () => {
          logOut();
        },
        expiryTime > 2147483647 ? 2147483647 : expiryTime
      );
      if (userDetails.token != token.token) {
        dispatch(miscActions.setLogin(true));
        dispatch(miscActions.setToken(userDetails));
      }
    } else {
      logOut();
    }
  }
  if (loading === true) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex h-screen w-screen justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            {/* Spinner and Text */}
            <div className="space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto">
                  <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-blue-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Authentication in Progress
                </h2>
                <p className="text-gray-600 mb-4">
                  Please wait while we verify your credentials
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="animate-loading-bar bg-blue-500 h-full rounded-full"></div>
              </div>

              {/* Status Messages */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">⚡</span>
                  Securing connection
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <span className="animate-bounce mr-2">🔒</span>
                  Verifying credentials
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <RouterProvider router={router} />;
  }
}

export default App;
