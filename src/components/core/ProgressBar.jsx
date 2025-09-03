// src/components/core/ProgressBar.jsx

import React from "react";

const ProgressBar = ({ progress = 0 }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-slate-700">Progress</span>
        <span className="text-sm font-medium text-slate-700">
          {Math.round(clampedProgress)}%
        </span>
      </div>
      {/* The outer container of the bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        {/* The inner bar that shows the progress */}
        <div
          className="bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
