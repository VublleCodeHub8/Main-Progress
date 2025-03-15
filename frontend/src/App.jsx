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
        <div className="flex h-screen w-screen  justify-center items-center">
          Checking Authentication....
        </div>
      </>
    );
  } else {
    return <RouterProvider router={router} />;
  }
}

export default App;
