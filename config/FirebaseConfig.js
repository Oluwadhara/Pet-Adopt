// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-f91a3.firebaseapp.com",
  projectId: "pet-adopt-f91a3",
  storageBucket: "pet-adopt-f91a3.appspot.com",
  messagingSenderId: "621351210095",
  appId: "1:621351210095:web:d76092f6a3f692f0ee119a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);