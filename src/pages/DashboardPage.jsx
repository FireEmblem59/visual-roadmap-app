// src/pages/DashboardPage.jsx (Final Polished Version)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of Link for programmatic navigation
import { useAuth } from "../features/auth/AuthProvider";
import {
  getRoadmapsForUser,
  createRoadmap,
  deleteRoadmap,
  updateRoadmapTitle,
} from "../api/firebase/firestore";
import {
  initialNodes,
  initialEdges,
} from "../components/roadmap/initial-elements";
import EditModal from "../components/core/EditModal";
import ConfirmationModal from "../components/core/ConfirmationModal"; // <-- Import the new modal

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalContext, setEditModalContext] = useState(null);
  // NEW: State to control the confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // Will hold the ID of the roadmap to delete

  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (currentUser) {
        setIsLoading(true);
        const userRoadmaps = await getRoadmapsForUser(currentUser.uid);
        setRoadmaps(userRoadmaps);
        setIsLoading(false);
      }
    };
    fetchRoadmaps();
  }, [currentUser]);

  const handleModalSubmit = async (title) => {
    if (!currentUser || !title) return;
    if (editModalContext?.mode === "new") {
      const initialContent = { nodes: initialNodes, edges: initialEdges };
      const newRoadmapId = await createRoadmap(
        currentUser.uid,
        title,
        initialContent
      );
      if (newRoadmapId) {
        navigate(`/roadmap/${newRoadmapId}`);
      }
    } else if (editModalContext?.mode === "edit") {
      await updateRoadmapTitle(
        currentUser.uid,
        editModalContext.roadmap.id,
        title
      );
      setRoadmaps(
        roadmaps.map((r) =>
          r.id === editModalContext.roadmap.id ? { ...r, title } : r
        )
      );
    }
    setEditModalContext(null);
  };

  // This function now just opens the confirmation modal
  const handleDeleteClick = (roadmapId, event) => {
    event.stopPropagation(); // Prevent the card's onClick from firing
    setDeleteConfirmation(roadmapId);
  };

  // This function is called when the user confirms the deletion
  const handleConfirmDelete = async () => {
    if (deleteConfirmation && currentUser) {
      await deleteRoadmap(currentUser.uid, deleteConfirmation);
      setRoadmaps(roadmaps.filter((r) => r.id !== deleteConfirmation));
      setDeleteConfirmation(null); // Close the modal
    }
  };

  if (isLoading) {
    /* ... same as before ... */
  }

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Roadmaps</h1>
          <button
            onClick={() => setEditModalContext({ mode: "new" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            + Create New Roadmap
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.length > 0 ? (
            roadmaps.map((roadmap) => (
              // THE FIX: The entire div is now a clickable element
              <div
                key={roadmap.id}
                onClick={() => navigate(`/roadmap/${roadmap.id}`)} // Navigate on click
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col cursor-pointer"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex-grow">
                  {roadmap.title}
                </h2>
                <div className="flex justify-between items-center mt-4 border-t pt-4">
                  {/* The Open button is now just a visual cue */}
                  <span className="text-indigo-600 font-semibold">
                    Open Roadmap
                  </span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditModalContext({ mode: "edit", roadmap: roadmap });
                      }}
                      className="text-gray-500 hover:text-gray-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(roadmap.id, e)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              You don't have any roadmaps yet. Create one to get started!
            </p>
          )}
        </div>
      </div>

      <EditModal
        isOpen={!!editModalContext}
        onClose={() => setEditModalContext(null)}
        onSubmit={handleModalSubmit}
        initialValue={
          editModalContext?.mode === "edit"
            ? editModalContext.roadmap.title
            : ""
        }
        title={
          editModalContext?.mode === "edit"
            ? "Rename Roadmap"
            : "Create New Roadmap"
        }
      />

      <ConfirmationModal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Roadmap"
        message="Are you sure you want to delete this roadmap? This action is permanent and cannot be undone."
      />
    </>
  );
};

export default DashboardPage;
