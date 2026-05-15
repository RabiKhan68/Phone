import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ─── Config ───────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// ─── Validation ───────────────────────────────────────────────────────────────

const REQUIRED_KEYS = Object.keys(firebaseConfig);
const missingKeys   = REQUIRED_KEYS.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingKeys.join(", ")}\n` +
    "Check your .env file and ensure all VITE_FIREBASE_* variables are set."
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);