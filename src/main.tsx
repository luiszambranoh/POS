import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import Inventory from "./Pages/Inventory/Inventory";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Sale from "./Pages/Sale/Sale";

const router = createHashRouter([
  {
    path: "/",
    element: <Inventory/>
  },
  {
    path: "/sale",
    element: <Sale/>
  },
  {
    path: "/sale",
    element: <div>si</div>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)