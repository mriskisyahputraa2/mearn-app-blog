// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mearn-blog-c104f.firebaseapp.com",
  projectId: "mearn-blog-c104f",
  storageBucket: "mearn-blog-c104f.appspot.com",
  messagingSenderId: "601335669659",
  appId: "1:601335669659:web:529cf802c55e7e1d57373e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
