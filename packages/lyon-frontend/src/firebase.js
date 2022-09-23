import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getDatabase,
  ref as databaseRef,
  set as databaseSet,
  onValue as databaseOnValue,
  get as databaseGet,
  child as databaseChild,
  off as databaseOff,
  query as databaseQuery,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  arrayUnion,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query as firestoreQuery,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1duIais2Ajh1Bb_RJEpvohIFtVV_7_iM",
  authDomain: "lyon-protocol.firebaseapp.com",
  projectId: "lyon-protocol",
  storageBucket: "lyon-protocol.appspot.com",
  messagingSenderId: "1068234459652",
  appId: "1:1068234459652:web:24a1a911abf6ef55b7c351",
  measurementId: "G-2G4XBVEFNG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export {
  arrayUnion,
  storage,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  database,
  databaseRef,
  databaseSet,
  databaseOnValue,
  databaseGet,
  databaseChild,
  databaseOff,
  databaseQuery,
  orderByChild,
  equalTo,
  firestore,
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  firestoreQuery,
  orderBy,
};

