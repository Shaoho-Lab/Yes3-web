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
  apiKey: 'AIzaSyA1duIais2Ajh1Bb_RJEpvohIFtVV_7_iM',
  authDomain: 'lyon-protocol.firebaseapp.com',
  projectId: 'lyon-protocol',
  storageBucket: 'lyon-protocol.appspot.com',
  messagingSenderId: '1068234459652',
  appId: '1:1068234459652:web:24a1a911abf6ef55b7c351',
  measurementId: 'G-2G4XBVEFNG',
}

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
