import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Wrapper from "./pages/Wrapper";
import Auth from "./pages/Auth";
import { useDispatch, useSelector } from "react-redux";
import { miscActions } from "./store/main";
import Project from "./pages/Project";
import About from "./pages/dashboard/About";
import Containers from "./pages/dashboard/Containers";
import Templates from "./pages/dashboard/Templates";
import Documentation from "./pages/dashboard/Documentation";
import Sidebar from './components/dashboard/Sidnav';
import Home from './pages/dashboard/Home';
import Analytics from './pages/dashboard/Analytics';
import DashboardLayout from "./pages/Dashboard";
import { Avatar } from '@chakra-ui/react';

const router = createBrowserRouter([
  {
    path: "auth",
    element: <Auth />,
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
            index: true,
            element: <Home />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
        
          {
            path: "about",
            element: <About />,

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
            path: "documentation",
            element: <Documentation />, 
          }
        ],
      },
      {
        path: "project",
        element: <Project />,
      },
    ],
  },
]);


let timer;

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.misc.token);

  console.log(token);

  useEffect(() => {
    async function checkForLogin() {
      dispatch(miscActions.setFallback(true));
      const userDetails = JSON.parse(localStorage.getItem("token"));
      if (userDetails && new Date(userDetails.expiry) > new Date()) {
        await logIn();
      } else if (userDetails && !(new Date(userDetails.expiry) > new Date())) {
        await logOut();
      }
      dispatch(miscActions.setFallback(false));
    }
    checkForLogin();
  }, [token]);

  async function logOut() {
    const tok = JSON.parse(localStorage.getItem("token"));
    console.log(tok);
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
      console.log(expiryTime);
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

  return <RouterProvider router={router} />;
}

export default App;
