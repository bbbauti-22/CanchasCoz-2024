import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8sjCPBK53x9BKDe8I4T5MjjZMD1tH2fc",
  authDomain: "katrikiaplicacion.firebaseapp.com",
  projectId: "katrikiaplicacion",
  storageBucket: "katrikiaplicacion.appspot.com",
  messagingSenderId: "131447050140",
  appId: "1:131447050140:web:23d567f609bd247eb60259"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)  
});

// Inicializa Firestore
const database = getFirestore(app);

const storage = getStorage(app);

export { app, database, auth, storage };