import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyD0bjybmutq_VvRsgsR_bQSxBFOyhQxWeg",
  authDomain: "area-do-corretor.firebaseapp.com",
  databaseURL: "https://area-do-corretor-default-rtdb.firebaseio.com",
  projectId: "area-do-corretor",
  storageBucket: "area-do-corretor.appspot.com",
  messagingSenderId: "522767526316",
  appId: "1:522767526316:web:3dd4bb235364a94472b209"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app)
const storage = getStorage(app)


export {auth, database, app, storage}