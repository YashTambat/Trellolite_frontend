import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform"
          >
            TrelloLite
          </Link>

          {/* Right side */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
