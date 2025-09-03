// src/components/roadmap/CustomEdge.jsx

import React from "react";
import { getSmoothStepPath, EdgeText } from "reactflow";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data, // We will pass our 'add node' function in here
}) => {
  // This function calculates the SVG path for the line
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleAddNode = (event) => {
    // Stop the event from bubbling up to the canvas
    event.stopPropagation();
    data.onAddNode(id);
  };

  return (
    <>
      {/* The main, visible edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* A wider, invisible path to make hovering easier */}
      <path
        id={id}
        style={{ ...style, strokeWidth: 20, stroke: "transparent" }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* This is the container for our '+' button */}
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20} // Center the button on the path
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex items-center justify-center h-full w-full">
          <button
            className="w-8 h-8 bg-indigo-600 rounded-full text-white text-lg font-bold shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            onClick={handleAddNode}
            title="Add a step in the middle"
          >
            +
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
