// src/api/firebase/firestore.js

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase.config"; // Our initialized Firestore instance

// We'll save each user's roadmap in a 'roadmaps' collection, with the document ID being their user ID.
const getRoadmapDocRef = (userId) => doc(db, "roadmaps", userId);

/**
 * Saves the user's roadmap data to Firestore.
 * @param {string} userId The user's unique ID.
 * @param {object} roadmapData An object containing the nodes and edges arrays.
 */
export const saveRoadmap = async (userId, roadmapData) => {
  if (!userId) return;
  try {
    const roadmapDocRef = getRoadmapDocRef(userId);
    // setDoc with merge: true will create the document or update it without overwriting other fields.
    await setDoc(roadmapDocRef, roadmapData, { merge: true });
  } catch (error) {
    console.error("Error saving roadmap: ", error);
  }
};

/**
 * Retrieves the user's roadmap data from Firestore.
 * @param {string} userId The user's unique ID.
 * @returns {object|null} The saved roadmap data (nodes and edges), or null if none exists.
 */
export const getRoadmap = async (userId) => {
  if (!userId) return null;
  try {
    const roadmapDocRef = getRoadmapDocRef(userId);
    const docSnap = await getDoc(roadmapDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No saved roadmap found for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error getting roadmap: ", error);
    return null;
  }
};
