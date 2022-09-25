import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  child as databaseChild,
  equalTo,
  get as databaseGet,
  getDatabase,
  off as databaseOff,
  onValue as databaseOnValue,
  orderByChild,
  query as databaseQuery,
  ref as databaseRef,
  set as databaseSet,
} from 'firebase/database'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query as firestoreQuery,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCJJZE0JC-lsrZD_CSReuRY9rJXgkT26z8",
  authDomain: "yes3-84f98.firebaseapp.com",
  projectId: "yes3-84f98",
  storageBucket: "yes3-84f98.appspot.com",
  messagingSenderId: "919227672022",
  appId: "1:919227672022:web:62be9be2b60df320acf077",
  measurementId: "G-G08T4JSXMB"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)
const database = getDatabase(app)
const firestore = getFirestore(app)

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
}
