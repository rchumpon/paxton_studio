import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Store the admin JWT token
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          {/* Pass setToken to Navbar for logout */}
          <Navbar setToken={setToken} />
          <hr className="border-b" />

          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-primary text-base">
              <Routes>
                {/* Redirect homepage to Add Product */}
                <Route path="/" element={<Navigate to="/add" replace />} />
                {/* Admin pages */}
                <Route path="/add" element={<Add token={token} />} />
                <Route
                  path="/edit/:productId"
                  element={<Edit token={token} />}
                />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default App;
