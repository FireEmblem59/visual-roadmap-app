// src/components/roadmap/ContextMenu.jsx

import React from "react";

const ContextMenu = ({ x, y, onEdit, onDelete }) => {
  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white rounded-md shadow-lg z-50 border border-gray-200"
    >
      <ul className="py-1">
        <li>
          <button
            onClick={onEdit}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit Text
          </button>
        </li>
        <li>
          <button
            onClick={onDelete}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete Bubble
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
