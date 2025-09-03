// src/api/firebase/auth.js

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase.config"; // Our initialized auth service

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    console.log("User signed in: ", user);
    return user;
  } catch (error) {
    // Handle Errors here.
    console.error("Error during Google sign-in: ", error);
    return null;
  }
};

export const userSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
