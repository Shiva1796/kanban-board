import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./components/auth/Login";
import ProtectedRoute from "./components/helper-functions/ProtectedRoutes";
import KanbanBoard from "./components/body/KanbanBoard";
import HomePage from "./components/body/HomePage";
import Navbar from "./components/header/NavBar";

const App = () => {
  return (
    <div className="bg-gradient-to-tr from-black/80 to-slate-800 h-screen w-screen font-Josefin flex flex-col items-center justify-start">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
