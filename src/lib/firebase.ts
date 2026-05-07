import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Prevent the "7 PERMISSION_DENIED" from crashing the whole app
export const checkDbConnection = async () => {
  try {
    // Attempt a tiny read to check status
    await getDoc(doc(db, "health_check", "status"));
    return true;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error("CRITICAL: Firestore API is disabled in Google Cloud Console.");
    }
    return false;
  }
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
