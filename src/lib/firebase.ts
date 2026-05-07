import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
let dbInstance;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("Falling back to default Firestore database on client.");
  dbInstance = getFirestore(app);
}
export const db = dbInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Prevent the "7 PERMISSION_DENIED" from crashing the whole app
export const checkDbConnection = async (maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      // Attempt a tiny read to check status
      const healthDoc = await getDoc(doc(db, "health_check", "status"));
      console.log(`Firestore connection test (attempt ${retries + 1}) completed. Exists:`, healthDoc.exists());
      return true;
    } catch (error: any) {
      console.error(`Firestore Health Check attempt ${retries + 1} Failed:`, error.message);
      if (error.code === 'permission-denied') {
        console.error("CRITICAL: Firestore API is disabled or Security Rules are blocking health_check.");
      }
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }
  }
  return false;
};

async function testConnection() {
  try {
    // Only test if we're actually logged in to avoid rules blocking us
    if (auth.currentUser) {
      // Just check our own user doc
      await getDocFromServer(doc(db, 'users', auth.currentUser.uid));
    }
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
