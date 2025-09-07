import React from "react";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Components/AppLayout";
import About from "./Pages/About";
import ChatApp from "./Components/ChatApp";
import ProductDescription from "./Pages/ProductDescription";
import WalletProvider from "./Wallet/WalletProvider";
import WalletButton from "./Wallet/WalletButton";

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
          path: "/product",
          element: <ProductDescription />,
        },
        {
          path: "/chat",
          element: <ChatApp />,
        },
      ],
    },
  ]);
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
};

export default App;
