// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Pour une application réelle, ces valeurs devraient être dans des variables d'environnement
const firebaseConfig = {
  apiKey: "AIzaSyDdu-PuS-LVCmYa3CuYvqudl1y-jBKCjoY",
  authDomain: "patisse-a2531.firebaseapp.com",
  projectId: "patisse-a2531",
  storageBucket: "patisse-a2531.appspot.com",
  messagingSenderId: "392267904323",
  appId: "1:392267904323:web:ae942610b0b800b6aaabf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app; 