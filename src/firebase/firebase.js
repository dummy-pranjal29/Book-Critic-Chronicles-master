import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTTxr7yNe3xBYnVKkg_RTWHNY2-enXIVI",
  authDomain: "book-a1a0e.firebaseapp.com",
  projectId: "book-a1a0e",
  storageBucket: "book-a1a0e.appspot.com",
  messagingSenderId: "980721425186",
  appId: "1:980721425186:web:5d38a9430d5bfc2bb7237b",
  measurementId: "G-V85K6R307E"
};

// Initializing firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const booksRef=collection(db, "books");
export const reviewsRef=collection(db, "reviews");
export const usersRef=collection(db, "users");

export default app;