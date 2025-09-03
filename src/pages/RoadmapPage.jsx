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

  // --- DATA FETCHING ---
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

  // --- DATA SAVING ---
  useEffect(() => {
    if (isInitialMount.current || isLoading) {
      if (!isLoading) isInitialMount.current = false;
      return;
    }
    if (currentUser) {
      saveRoadmap(currentUser.uid, { nodes, edges });
    }
  }, [nodes, edges, currentUser, isLoading]);

  // --- PROGRESS CALCULATION ---
  useEffect(() => {
    const doneNodes = nodes.filter(
      (node) => node.data.status === "done"
    ).length;
    setProgress(nodes.length > 0 ? (doneNodes / nodes.length) * 100 : 0);
  }, [nodes]);

  // --- EVENT HANDLERS ---
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

  const handleModalSubmit = useCallback(
    (newLabel) => {
      let newNodeId;
      if (modalContext?.mode === "new") {
        const lastNode = nodes[nodes.length - 1];
        newNodeId =
          nodes.length > 0 ? (parseInt(lastNode.id) + 1).toString() : "1";
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
              type: "smoothstep",
              style: {
                stroke: "#94a3b8",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
            }
          : null;
        setNodes((nds) => [...nds, newNode]);
        if (newEdge) setEdges((eds) => [...eds, newEdge]);
      } else if (modalContext?.mode === "edit") {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === modalContext.node.id
              ? { ...node, data: { ...node.data, label: newLabel } }
              : node
          )
        );
      }
      setModalContext(null);

      if (modalContext?.mode === "new" && reactFlowInstance) {
        setTimeout(() => {
          const node = reactFlowInstance.getNode(newNodeId);
          if (node) {
            reactFlowInstance.setCenter(
              node.position.x + 100,
              node.position.y + 100,
              { zoom: 1, duration: 800 }
            );
          }
        }, 100);
      }
    },
    [nodes, reactFlowInstance, modalContext]
  );

  const handleDeleteNode = useCallback(() => {
    if (!contextMenu?.node) return;
    const nodeToRemove = contextMenu.node;
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
        id: `e${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: "smoothstep",
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
    <div onClick={() => setContextMenu(null)}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 pb-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Roadmap</h1>
            <button
              onClick={() => setModalContext({ mode: "new" })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
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
        title={modalContext?.mode === "edit" ? "Edit Step" : "Add New Step"}
      />
    </div>
  );
};

export default RoadmapPage;
