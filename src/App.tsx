import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ProfileProvider } from "./components/context/ProfileContext";
import ProjectBoard from "./components/ProjectBoard";
import TeamDashboard from "./components/TeamDashboard";

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  return (
    <Router>
      <ProfileProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Home Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="min-h-screen bg-gray-50">
                  <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
                    {user?.role === "admin" ? <ProjectBoard /> : <TeamDashboard />}
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </ProfileProvider>
    </Router>
  );
};


export default App;

