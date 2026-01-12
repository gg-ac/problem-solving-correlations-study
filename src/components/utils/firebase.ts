"use client"
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";

export const isLocalhost = Boolean(
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  ))
);

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "cogntive-correlations-project.firebaseapp.com",
  projectId: "cogntive-correlations-project",
  storageBucket: "cogntive-correlations-project.firebasestorage.app",
  messagingSenderId: "899412483472",
  appId: "1:899412483472:web:8a630d8e2d75a648c92715"

};
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const auth = getAuth(app);
// Do not persist the authentication state after refresh 
setPersistence(auth, inMemoryPersistence)

// Initialise Firebase emulators for local testing
if (isLocalhost) {
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
} 

export {app, storage, auth}