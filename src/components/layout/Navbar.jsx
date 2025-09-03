// src/components/layout/Navbar.jsx
import React from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { userSignOut } from "../../api/firebase/auth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: App Title / Logo + Home */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
            >
              Pathfinder
            </Link>

            <Link
              to="/"
              className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 hover:text-indigo-800 rounded-md transition-colors duration-200 shadow-sm"
            >
              Home
            </Link>
          </div>

          {/* Right side: User Info + Sign Out */}
          {currentUser && (
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 hidden sm:block font-medium">
                {currentUser.displayName}
              </span>

              {currentUser.photoURL && (
                <img
                  className="h-10 w-10 rounded-full border-2 border-indigo-600"
                  src={currentUser.photoURL}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                />
              )}

              <button
                onClick={userSignOut}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
