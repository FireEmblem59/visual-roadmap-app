// src/api/firebase/firestore.js

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";

/**
 * Helper to get the reference to a user's 'roadmaps' subcollection.
 * The data structure is now: users/{userId}/roadmaps/{roadmapId}
 * @param {string} userId The ID of the currently logged-in user.
 * @returns A reference to the subcollection.
 */
const getRoadmapsCollectionRef = (userId) =>
  collection(db, "users", userId, "roadmaps");

/**
 * Fetches a list of all roadmaps for a given user.
 * This is for the dashboard view, so it primarily fetches the title and ID.
 * @param {string} userId The ID of the currently logged-in user.
 * @returns {Array} An array of roadmap objects, each with an id and title.
 */
export const getRoadmapsForUser = async (userId) => {
  if (!userId) return [];
  try {
    const roadmapsCollectionRef = getRoadmapsCollectionRef(userId);
    const querySnapshot = await getDocs(roadmapsCollectionRef);
    const roadmaps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return roadmaps;
  } catch (error) {
    console.error("Error fetching roadmaps for user: ", error);
    return [];
  }
};

/**
 * Fetches the full data (nodes, edges, title) for a single, specific roadmap.
 * @param {string} userId The ID of the currently logged-in user.
 * @param {string} roadmapId The ID of the roadmap to fetch.
 * @returns {object|null} The full roadmap data object, or null if it doesn't exist.
 */
export const getRoadmapById = async (userId, roadmapId) => {
  if (!userId || !roadmapId) return null;
  try {
    const roadmapDocRef = doc(db, "users", userId, "roadmaps", roadmapId);
    const docSnap = await getDoc(roadmapDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching roadmap by ID: ", error);
    return null;
  }
};

/**
 * Creates a new roadmap document for a user with a title and default content.
 * @param {string} userId The ID of the currently logged-in user.
 * @param {string} title The title for the new roadmap.
 * @param {object} initialContent An object containing the initial {nodes, edges}.
 * @returns {string|null} The ID of the newly created roadmap, or null on failure.
 */
export const createRoadmap = async (userId, title, initialContent) => {
  if (!userId) return null;
  try {
    const roadmapsCollectionRef = getRoadmapsCollectionRef(userId);
    const newRoadmapDoc = await addDoc(roadmapsCollectionRef, {
      title: title,
      createdAt: serverTimestamp(), // Adds a server-side timestamp
      ...initialContent, // Spreads the initial {nodes, edges} into the document
    });
    return newRoadmapDoc.id; // Return the new roadmap's unique ID
  } catch (error) {
    console.error("Error creating new roadmap: ", error);
    return null;
  }
};

/**
 * Updates an existing roadmap document with new data (e.g., new nodes/edges).
 * @param {string} userId The ID of the currently logged-in user.
 * @param {string} roadmapId The ID of the roadmap to update.
 * @param {object} data The data to save (typically {nodes, edges}).
 */
export const updateRoadmap = async (userId, roadmapId, data) => {
  if (!userId || !roadmapId) return;
  try {
    const roadmapDocRef = doc(db, "users", userId, "roadmaps", roadmapId);
    // Use { merge: true } to update fields without overwriting the entire document
    await setDoc(roadmapDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating roadmap: ", error);
  }
};

/**
 * Deletes an entire roadmap document from Firestore.
 * @param {string} userId The ID of the currently logged-in user.
 * @param {string} roadmapId The ID of the roadmap to delete.
 */
export const deleteRoadmap = async (userId, roadmapId) => {
  if (!userId || !roadmapId) return;
  try {
    const roadmapDocRef = doc(db, "users", userId, "roadmaps", roadmapId);
    await deleteDoc(roadmapDocRef);
  } catch (error) {
    console.error("Error deleting roadmap: ", error);
  }
};

/**
 * Updates just the title of an existing roadmap document.
 * @param {string} userId The ID of the currently logged-in user.
 * @param {string} roadmapId The ID of the roadmap to rename.
 * @param {string} newTitle The new title for the roadmap.
 */
export const updateRoadmapTitle = async (userId, roadmapId, newTitle) => {
  if (!userId || !roadmapId) return;
  try {
    const roadmapDocRef = doc(db, "users", userId, "roadmaps", roadmapId);
    // Use updateDoc for updating a specific field without touching the rest.
    await updateDoc(roadmapDocRef, {
      title: newTitle,
    });
  } catch (error) {
    console.error("Error updating roadmap title: ", error);
  }
};
