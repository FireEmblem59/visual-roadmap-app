// src/components/roadmap/RoadmapCanvas.jsx

import React, { useCallback, useMemo } from "react";
import ReactFlow, { Controls, Background, ReactFlowProvider } from "reactflow";
import BubbleNode from "./BubbleNode";
import CustomEdge from "./CustomEdge";

const nodeTypes = { bubble: BubbleNode };

const RoadmapCanvas = ({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onNodeContextMenu,
  setReactFlowInstance,
  nodesDraggable,
  onAddNodeInMiddle,
}) => {
  const onNodeClick = useCallback(
    (event, clickedNode) => {
      // This logic for toggling status remains the same and works correctly.
      setNodes((currentNodes) => {
        const clickedNodeIndex = currentNodes.findIndex(
          (node) => node.id === clickedNode.id
        );
        const clickedNodeStatus = currentNodes[clickedNodeIndex].data.status;
        if (clickedNodeStatus === "done") {
          return currentNodes.map((node, index) => {
            if (index >= clickedNodeIndex) {
              return { ...node, data: { ...node.data, status: "pending" } };
            }
            return node;
          });
        } else {
          const isFirstNode = clickedNodeIndex === 0;
          const previousNode = currentNodes[clickedNodeIndex - 1];
          if (
            isFirstNode ||
            (previousNode && previousNode.data.status === "done")
          ) {
            const newNodes = [...currentNodes];
            newNodes[clickedNodeIndex] = {
              ...newNodes[clickedNodeIndex],
              data: { ...newNodes[clickedNodeIndex].data, status: "done" },
            };
            return newNodes;
          }
        }
        return currentNodes;
      });
    },
    [setNodes]
  );

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );
  const edgesWithData = edges.map((edge) => ({
    ...edge,
    type: "custom",
    data: {
      ...edge.data,
      onAddNode: onAddNodeInMiddle,
    },
  }));

  return (
    <div style={{ height: "75vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithData}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onInit={setReactFlowInstance}
        nodesDraggable={nodesDraggable}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const CanvasWrapper = (props) => (
  <ReactFlowProvider>
    <RoadmapCanvas {...props} />
  </ReactFlowProvider>
);

export default CanvasWrapper;
