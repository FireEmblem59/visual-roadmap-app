// src/components/roadmap/BubbleNode.jsx

import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const BubbleNode = ({ data }) => {
  const { label, status } = data;
  const isDone = status === "done";
  const borderClasses = isDone ? "border-teal-500" : "border-slate-400";
  const textClasses = isDone ? "text-slate-400" : "text-slate-800";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !border-white !bg-teal-500"
      />
      <div
        className={`bg-white rounded-full w-48 h-48 flex items-center justify-center text-center p-2 shadow-xl shadow-slate-300/60 ${borderClasses}`}
      >
        <p className={`font-bold text-lg px-2 ${textClasses}`}>{label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border-2 !border-white !bg-teal-500"
      />
    </>
  );
};

export default memo(BubbleNode);
