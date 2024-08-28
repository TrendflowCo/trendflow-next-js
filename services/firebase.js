import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, updateDoc, getDocs, query, where, arrayUnion, getDoc, serverTimestamp } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_MESAUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD9lXuyCBrNt-ypOEvLRirxGFD7QddJzLk",
  authDomain: "trendflow-429722.firebaseapp.com",
  projectId: "trendflow-429722",
  storageBucket: "trendflow-429722.appspot.com",
  messagingSenderId: "908136706043",
  appId: "1:908136706043:web:7df3f49807b29ccc5de55e",
  measurementId: "G-0BQ974LN5F"
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

export const db = getFirestore(app);

export const createWishlist = async (userId, name) => {
  try {
    if (!(await checkOnlineStatus())) {
      throw new Error("No internet connection");
    }
    console.log("Creating wishlist for user:", userId, "with name:", name);
    const wishlistRef = collection(db, "wishlists");
    const newWishlist = await addDoc(wishlistRef, {
      userId,
      name,
      items: [],
      createdAt: serverTimestamp()
    });
    console.log("Wishlist created with ID:", newWishlist.id);
    return newWishlist.id;
  } catch (error) {
    console.error("Error creating wishlist:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.message) {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const addItemToWishlist = async (wishlistId, item) => {
  try {
    console.log("Adding item to wishlist. WishlistID:", wishlistId, "Item:", item);
    if (!item || !item.id_item) {
      throw new Error("Invalid item: missing id_item");
    }
    const wishlistRef = doc(db, "wishlists", wishlistId);
    
    // First, let's check if the wishlist document exists
    const wishlistDoc = await getDoc(wishlistRef);
    if (!wishlistDoc.exists()) {
      throw new Error("Wishlist document does not exist");
    }
    
    console.log("Wishlist document found. Updating...");
    await updateDoc(wishlistRef, {
      items: arrayUnion(item)
    });
    console.log("Item successfully added to wishlist");
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    throw error;
  }
};

export const getUserWishlists = async (userId) => {
  try {
    const wishlistRef = collection(db, "wishlists");
    const q = query(wishlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user wishlists:", error);
    throw error;
  }
};

export const getWishlistItems = async (wishlistId) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    const wishlistDoc = await getDoc(wishlistRef);
    if (wishlistDoc.exists()) {
      const wishlistData = wishlistDoc.data();
      return wishlistData.items || [];
    } else {
      throw new Error("Wishlist not found");
    }
  } catch (error) {
    console.error("Error getting wishlist items:", error);
    throw error;
  }
};

const checkOnlineStatus = async () => {
  try {
    const online = await fetch("/favicon.ico");
    return online.status >= 200 && online.status < 300;
  } catch (err) {
    return false;
  }
};

if (await checkOnlineStatus()) {
  // Perform Firestore operation
} else {
  console.error("No internet connection");
  // Handle offline state
}

export const testFirestoreConnection = async () => {
  try {
    const testDoc = await addDoc(collection(db, "test_collection"), {
      test: "data"
    });
    console.log("Test document written with ID: ", testDoc.id);
    await deleteDoc(doc(db, "test_collection", testDoc.id));
    console.log("Test document successfully deleted");
    return true;
  } catch (error) {
    console.error("Error testing Firestore connection:", error);
    return false;
  }
};

testFirestoreConnection().then(isConnected => {
  if (isConnected) {
    console.log("Firestore connection successful");
  } else {
    console.error("Failed to connect to Firestore");
  }
});