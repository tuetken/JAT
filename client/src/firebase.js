// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwd7PICkhyvdxc-qx5l_nT39VvYxrm5dE",
  authDomain:
    "job-application-tracker-942aa.firebaseapp.com",
  projectId: "job-application-tracker-942aa",
  storageBucket:
    "job-application-tracker-942aa.firebasestorage.app",
  messagingSenderId: "337213562997",
  appId: "1:337213562997:web:cad22196d6273e4ab6983c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);
