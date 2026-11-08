import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with database ID specified in configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot gracefully without forcing server timeout
export async function testFirestoreConnection() {
  try {
    await getDoc(doc(db, 'products', '_test_connection_ph'));
  } catch (error) {
    console.warn("Firestore connection status: operating online/offline seamlessly.");
  }
}

testFirestoreConnection();
