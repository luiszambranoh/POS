import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import Inventory from "./Pages/Inventory/Inventory";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Sale from "./Pages/Sale/Sale";
import Home from "./Pages/Home/Home";

const router = createHashRouter([
  {
    path: "/inventory",
    element: <Inventory/>
  },
  {
    path: "/sale",
    element: <Sale/>
  },
  {
    path: "/",
    element: <Home/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)