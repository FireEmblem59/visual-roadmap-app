// src/components/roadmap/initial-elements.js

export const initialNodes = [
  {
    id: "1",
    type: "bubble",
    data: { label: "Left click on me to mark me done", status: "pending" },
    position: { x: 100, y: 125 },
  },
  {
    id: "2",
    type: "bubble",
    data: { label: "Right click on me to edit me", status: "pending" },
    position: { x: 350, y: 125 },
  },
];

const edgeStyle = {
  stroke: "#94a3b8",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};

export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: edgeStyle,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: edgeStyle,
  },
];
