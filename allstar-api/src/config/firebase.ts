// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "anime-allstar.firebaseapp.com",
  projectId: "anime-allstar",
  storageBucket: "anime-allstar.appspot.com",
  messagingSenderId: "217305712714",
  appId: "1:217305712714:web:4cb0c5c53c2a93fc3e7eb3",
  measurementId: "G-8PMXEE8ZYZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
