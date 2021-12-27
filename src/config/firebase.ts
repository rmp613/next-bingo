// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlqwWvzNiQZUfevUl9zGrJ6ptXjsCoYiA",
  authDomain: "next-bingo.firebaseapp.com",
  projectId: "next-bingo",
  storageBucket: "next-bingo.appspot.com",
  messagingSenderId: "1014214807897",
  appId: "1:1014214807897:web:d56fac29c9186c02597c48",
  measurementId: "G-EBMQFM15XP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const analytics = getAnalytics(app);
