// src/pages/RoadmapPage.jsx (FINAL - With Camera Panning)

import React, { useState, useCallback, useEffect, useRef } from "react";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import ProgressBar from "../components/core/ProgressBar";
import EditModal from "../components/core/EditModal";
import ContextMenu from "../components/roadmap/ContextMenu";
import {
  initialNodes,
  initialEdges,
} from "../components/roadmap/initial-elements";
import { useAuth } from "../features/auth/AuthProvider";
import { saveRoadmap, getRoadmap } from "../api/firebase/firestore";

const RoadmapPage = () => {
  const { currentUser } = useAuth();
  const isInitialMount = useRef(true);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [modalContext, setModalContext] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // --- DATA FETCHING & SAVING (UNCHANGED) ---
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        setIsLoading(true);
        const savedRoadmap = await getRoadmap(currentUser.uid);
        if (savedRoadmap && savedRoadmap.nodes?.length > 0) {
          setNodes(savedRoadmap.nodes);
          setEdges(savedRoadmap.edges || []);
        } else {
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (isInitialMount.current || isLoading) {
      if (!isLoading) isInitialMount.current = false;
      return;
    }
    if (currentUser) {
      saveRoadmap(currentUser.uid, { nodes, edges });
    }
  }, [nodes, edges, currentUser, isLoading]);

  // --- PROGRESS CALCULATION (UNCHANGED) ---
  useEffect(() => {
    const doneNodes = nodes.filter(
      (node) => node.data.status === "done"
    ).length;
    setProgress(nodes.length > 0 ? (doneNodes / nodes.length) * 100 : 0);
  }, [nodes]);

  // --- EVENT HANDLERS (UNCHANGED) ---
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  }, []);
  const handleAddNodeInMiddle = useCallback((edgeId) => {
    setModalContext({ mode: "insert", edgeId: edgeId });
  }, []);

  // --- MODAL SUBMIT (WITH CAMERA LOGIC) ---
  const handleModalSubmit = useCallback(
    (newLabel) => {
      // This variable will hold the newly created node so we can focus on it later.
      let newNodeToFocus = null;
      const edgeStyle = {
        stroke: "#94a3b8",
        strokeWidth: 2,
        strokeDasharray: "5,5",
      };
      const uniqueId = () => "id_" + Date.now();

      if (modalContext?.mode === "new") {
        const lastNode = nodes[nodes.length - 1];
        const newNodeId = uniqueId();
        const newNode = {
          id: newNodeId,
          type: "bubble",
          data: { label: newLabel, status: "pending" },
          position: { x: lastNode ? lastNode.position.x + 250 : 100, y: 125 },
        };
        const newEdge = lastNode
          ? {
              id: `e${lastNode.id}-${newNodeId}`,
              source: lastNode.id,
              target: newNodeId,
              type: "custom",
              style: edgeStyle,
            }
          : null;

        setNodes((nds) => [...nds, newNode]);
        if (newEdge) setEdges((eds) => [...eds, newEdge]);
        newNodeToFocus = newNode; // Set the node to focus on.
      } else if (modalContext?.mode === "edit") {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === modalContext.node.id
              ? { ...node, data: { ...node.data, label: newLabel } }
              : node
          )
        );
      } else if (modalContext?.mode === "insert") {
        const edgeToSplit = edges.find((e) => e.id === modalContext.edgeId);
        if (!edgeToSplit) return;

        const sourceNode = nodes.find((n) => n.id === edgeToSplit.source);
        const sourceNodeIndex = nodes.findIndex((n) => n.id === sourceNode.id);

        const newNodeId = uniqueId();
        const newNode = {
          id: newNodeId,
          type: "bubble",
          data: { label: newLabel, status: "pending" },
          position: {
            x: sourceNode.position.x + 250,
            y: sourceNode.position.y,
          },
        };

        const shiftedNodes = nodes.map((node, index) => {
          if (index > sourceNodeIndex) {
            return {
              ...node,
              position: { ...node.position, x: node.position.x + 250 },
            };
          }
          return node;
        });

        const finalNodes = [
          ...shiftedNodes.slice(0, sourceNodeIndex + 1),
          newNode,
          ...shiftedNodes.slice(sourceNodeIndex + 1),
        ];

        const finalEdges = edges
          .filter((e) => e.id !== edgeToSplit.id)
          .concat([
            {
              id: `e${edgeToSplit.source}-${newNodeId}`,
              source: edgeToSplit.source,
              target: newNodeId,
              type: "custom",
              style: edgeStyle,
            },
            {
              id: `e${newNodeId}-${edgeToSplit.target}`,
              source: newNodeId,
              target: edgeToSplit.target,
              type: "custom",
              style: edgeStyle,
            },
          ]);

        setNodes(finalNodes);
        setEdges(finalEdges);
        newNodeToFocus = newNode; // Also set the node to focus on here.
      }

      // --- THE CAMERA FIX ---
      // This block now runs for BOTH 'new' and 'insert' modes.
      if (newNodeToFocus && reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.setCenter(
            newNodeToFocus.position.x + 100, // Offset a bit to the right of the node's center
            newNodeToFocus.position.y + 100,
            { zoom: 1, duration: 800 } // Animate the pan/zoom over 800ms
          );
        }, 100); // A small delay ensures the node has rendered before we pan to it.
      }

      setModalContext(null);
    },
    [modalContext, nodes, edges, reactFlowInstance] // <-- reactFlowInstance is now a dependency
  );

  // --- DELETION HANDLER (UNCHANGED) ---
  const handleDeleteNode = useCallback(() => {
    if (!contextMenu?.node) return;
    const { node: nodeToRemove } = contextMenu;
    const nodeIndexToRemove = nodes.findIndex((n) => n.id === nodeToRemove.id);

    const incomingEdge = edges.find((e) => e.target === nodeToRemove.id);
    const outgoingEdge = edges.find((e) => e.source === nodeToRemove.id);
    const sourceId = incomingEdge?.source;
    const targetId = outgoingEdge?.target;

    const updatedNodes = nodes
      .filter((n) => n.id !== nodeToRemove.id)
      .map((node, index) => {
        if (index >= nodeIndexToRemove) {
          return {
            ...node,
            position: { ...node.position, x: node.position.x - 250 },
          };
        }
        return node;
      });

    let updatedEdges = edges.filter(
      (e) => e.source !== nodeToRemove.id && e.target !== nodeToRemove.id
    );

    if (sourceId && targetId) {
      const newBridgeEdge = {
        id: `e${sourceId}-${targetId}`, // This ID is now safe because the old edges are gone.
        source: sourceId,
        target: targetId,
        type: "custom",
        style: { stroke: "#94a3b8", strokeWidth: 2, strokeDasharray: "5,5" },
      };
      updatedEdges.push(newBridgeEdge);
    }
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setContextMenu(null);
  }, [contextMenu, nodes, edges]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-700">
        Loading Your Roadmap...
      </div>
    );
  }

  return (
    // --- JSX IS UNCHANGED ---
    <div onClick={() => setContextMenu(null)}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 pb-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Roadmap</h1>
            <button
              onClick={() => setModalContext({ mode: "new" })}
              className="bg-indigo-600 hover-bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              + Add Step
            </button>
          </div>
          <ProgressBar progress={progress} />
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <RoadmapCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeContextMenu={onNodeContextMenu}
            setReactFlowInstance={setReactFlowInstance}
            nodesDraggable={false}
            onAddNodeInMiddle={handleAddNodeInMiddle}
          />
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => {
            setModalContext({ mode: "edit", node: contextMenu.node });
            setContextMenu(null);
          }}
          onDelete={handleDeleteNode}
        />
      )}
      <EditModal
        isOpen={!!modalContext}
        onClose={() => setModalContext(null)}
        onSubmit={handleModalSubmit}
        initialValue={
          modalContext?.mode === "edit" ? modalContext.node.data.label : ""
        }
        title={
          modalContext?.mode === "edit"
            ? "Edit Step"
            : modalContext?.mode === "insert"
            ? "Insert New Step"
            : "Add New Step"
        }
      />
    </div>
  );
};

export default RoadmapPage;
