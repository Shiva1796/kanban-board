import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/auth/Login";
import ProtectedRoute from "./components/helper-functions/ProtectedRoutes";
import Dashboard from "./components/body/DashBoard";
import HomePage from "./components/body/HomePage";
import Navbar from "./components/header/NavBar";

const App = () => {
  return (
    <div className="bg-gradient-to-tr from-black/80 to-zinc-900 h-screen w-screen font-Josefin flex flex-col items-center justify-start">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
