// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
const firebaseConfig = {
  apiKey: "AIzaSyAnglBsbVzbsAXSqHU5kXF66HWWNrPQ1K0",
  authDomain: "valleystate-5f593.firebaseapp.com",
  projectId: "valleystate-5f593",
  storageBucket: "valleystate-5f593.appspot.com",
  messagingSenderId: "709783097907",
  appId: "1:709783097907:web:3e2b332cc12f5d44500946"

};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();