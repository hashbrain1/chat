import React from "react";
import Home from "./Pages/Home";
import Chat from "./Components/Chat";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Components/AppLayout";
import About from "./Pages/About";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
            {
          path: "/about",
          element: <About />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
