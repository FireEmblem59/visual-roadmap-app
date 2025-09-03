// src/api/firebase/firebase.config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsf13y09yMeY3y9glikn33VDhZQVG76AQ",
  authDomain: "visual-roadmap-app.firebaseapp.com",
  projectId: "visual-roadmap-app",
  storageBucket: "visual-roadmap-app.firebasestorage.app",
  messagingSenderId: "227055351639",
  appId: "1:227055351639:web:ef34f8aea11436fff37012",
  measurementId: "G-VZ88DVH1SN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
