import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDpUSW3BJRFlscoQTZMLl1KeEQ1Nv7dm6s',
  authDomain: 'projeto-especializado.firebaseapp.com',
  databaseURL: 'https://projeto-especializado-default-rtdb.firebaseio.com/',
  projectId: 'projeto-especializado',
  storageBucket: 'projeto-especializado.appspot.com',
  messagingSenderId: '640936633193',
  appId: '1:640936633193:web:0a73702b546315e1d4d3f8',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_DB_REAL_TIME = getDatabase(FIREBASE_APP);
