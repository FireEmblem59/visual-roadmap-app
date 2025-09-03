// src/components/layout/MainLayout.jsx

import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {/* The content of our pages will be injected here */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
