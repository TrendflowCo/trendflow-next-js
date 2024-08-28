import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MESAUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let analyticsInstance = null;

export const initializeAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      const isAnalyticsSupported = await isSupported();
      if (isAnalyticsSupported) {
        analyticsInstance = getAnalytics(app);
      } else {
        console.log("Analytics is not supported in this environment");
      }
    } catch (error) {
      console.error("Error initializing analytics:", error);
    }
  }
};

export const logAnalyticsEvent = (eventName, eventParams) => {
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, eventParams);
  } else {
    console.log(`Analytics event not logged (analytics not available): ${eventName}`, eventParams);
  }
};

export const signInWithGoogle = async () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};