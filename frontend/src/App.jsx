import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Wrapper from "./pages/Wrapper";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

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
        element: <Home></Home>,
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return <RouterProvider router={router} />;
}

export default App;
