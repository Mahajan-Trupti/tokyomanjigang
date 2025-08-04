import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// IMPORTANT: Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyBuSINbbbb-k03CdwvoHMFVLM3RoDxsQc4", // Replace with your actual API Key
  authDomain: "backend-proj-84526.firebaseapp.com", // Replace with your actual Auth Domain
  projectId: "backend-proj-84526", // Replace with your actual Project ID
  appId: "1:909887069356:web:0d7d8cd650729abdc8d309", // Replace with your actual App ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export helpers
export {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};