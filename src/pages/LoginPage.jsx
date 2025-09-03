// src/pages/LoginPage.jsx

import React from "react";
import { signInWithGoogle } from "../api/firebase/auth";

// A simple SVG icon for our app
const AppIcon = () => (
  <svg
    className="w-16 h-16 text-indigo-600 mx-auto mb-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2L12 6" />
    <path d="M12 18L12 22" />
    <path d="M4.93 4.93L7.76 7.76" />
    <path d="M16.24 16.24L19.07 19.07" />
    <path d="M2 12L6 12" />
    <path d="M18 12L22 12" />
    <path d="M4.93 19.07L7.76 16.24" />
    <path d="M16.24 7.76L19.07 4.93" />
  </svg>
);

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <AppIcon />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Pathfinder
        </h1>
        <p className="text-gray-600 mb-8">
          Your visual guide to achieving your goals.
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google icon"
            className="w-6 h-6 mr-3 bg-white rounded-full p-0.5"
          />
          Sign in with Google
        </button>
      </div>
      <footer className="mt-8 text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Pathfinder. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
