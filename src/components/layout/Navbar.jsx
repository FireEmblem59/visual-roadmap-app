// src/components/layout/Navbar.jsx

import React from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { userSignOut } from "../../api/firebase/auth";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: App Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">Pathfinder</h1>
          </div>

          {/* Right side: User Info and Sign Out */}
          {currentUser && (
            <div className="flex items-center">
              <span className="text-gray-700 mr-3 hidden sm:block">
                {currentUser.displayName}
              </span>
              {currentUser.photoURL && (
                <img
                  className="h-10 w-10 rounded-full mr-4"
                  src={currentUser.photoURL}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={userSignOut}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
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
