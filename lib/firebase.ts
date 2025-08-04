'use client';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzWECp6RdTszYh5vTNlhgV-FtqwkI7g0U",
  authDomain: "expense-tracker-5cb10.firebaseapp.com",
  projectId: "expense-tracker-5cb10",
  // storageBucket: "expense-tracker-5cb10.firebasestorage.app",
  messagingSenderId: "916801779137",
  appId: "1:916801779137:web:7482d793f95a79cf362b40",
  measurementId: "G-SM41DTQMRS"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
export default app;
