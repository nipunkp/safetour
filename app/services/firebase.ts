import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2fZR-0B3NZapXs3yc7wcpAKz_rQBXrxk",
  authDomain: "safetour-b4b7b.firebaseapp.com",
  projectId: "safetour-b4b7b",
  storageBucket: "safetour-b4b7b.firebasestorage.app",
  messagingSenderId: "408916253056",
  appId: "1:408916253056:web:a66f94d8d25df627d6c965",
  measurementId: "G-ZB098VQ2W0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInFirebase = async () => {
  try {
    await signInAnonymously(auth);

    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Firebase authenticated:", user.uid);
          resolve(true);
        }
      });
    });

  } catch (error) {
    console.log("Firebase auth error:", error);
  }
};
