import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore, 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { logEvent, getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { setLogLevel as setFirestoreLogLevel } from "firebase/firestore";
setFirestoreLogLevel('debug');

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
let app;
let db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {});
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { app, db };

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


// // Enable offline persistence
// enableIndexedDbPersistence(db).catch((err) => {
//     if (err.code == 'failed-precondition') {
//         console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
//     } else if (err.code == 'unimplemented') {
//         console.warn('The current browser does not support all of the features required to enable persistence');
//     }
// });

export const createWishlist = async (userId, name) => {
  try {
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
    console.error("Error in createWishlist function:", error);
    throw error;
  }
};

export const addItemToWishlist = async (wishlistId, item) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    await updateDoc(wishlistRef, {
      items: arrayUnion(item)
    });
    console.log("Item added to wishlist:", wishlistId);
    return true;
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    throw error;
  }
};

export const getUserWishlists = async (userId) => {
  try {
    const wishlistsRef = collection(db, "wishlists");
    const q = query(wishlistsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user wishlists:", error);
    throw error;
  }
};

export const getWishlistDetails = async (wishlistId) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    const wishlistDoc = await getDoc(wishlistRef);
    if (wishlistDoc.exists()) {
      return { id: wishlistDoc.id, ...wishlistDoc.data() };
    } else {
      throw new Error("Wishlist not found");
    }
  } catch (error) {
    console.error("Error getting wishlist details:", error);
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

export const shareWishlist = async (wishlistId, email, isPublic) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (!wishlistDoc.exists()) {
      throw new Error("Wishlist not found");
    }

    const wishlistData = wishlistDoc.data();
    let sharedWith = wishlistData.sharedWith || [];

    if (!sharedWith.includes(email)) {
      sharedWith.push(email);
    }

    await updateDoc(wishlistRef, {
      sharedWith,
      isPublic: isPublic
    });

    // Send email invitation (you'll need to implement this separately)
    // await sendEmailInvitation(email, wishlistId);

    console.log("Wishlist shared successfully");
    return true;
  } catch (error) {
    console.error("Error sharing wishlist:", error);
    throw error;
  }
};

const checkOnlineStatus = async () => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (!wishlistDoc.exists()) {
      throw new Error("Wishlist not found");
    }

    const wishlistData = wishlistDoc.data();
    let sharedWith = wishlistData.sharedWith || [];

    if (!sharedWith.includes(email)) {
      sharedWith.push(email);
    }

    await updateDoc(wishlistRef, {
      sharedWith,
      isPublic: isPublic
    });

    // Send email invitation (you'll need to implement this separately)
    // await sendEmailInvitation(email, wishlistId);

    console.log("Wishlist shared successfully");
    return true;
  } catch (error) {
    console.error("Error sharing wishlist:", error);
    throw error;
  }
};

const checkOnlineStatus = async () => {
  if (typeof window === 'undefined') {
    // Server-side: assume online
    return true;
  }
  
  if (!navigator.onLine) return false;
  
  try {
    const online = await fetch("/favicon.ico", {
      method: "HEAD",
      cache: "no-cache"
    });
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

export const updateWishlistPrivacy = async (wishlistId, isPublic) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    await updateDoc(wishlistRef, { isPublic });
    return { id: wishlistId, isPublic };
  } catch (error) {
    console.error("Error updating wishlist privacy:", error);
    throw error;
  }
};

export const inviteCollaborator = async (wishlistId, collaboratorEmail) => {
  try {
    const wishlistRef = doc(db, "wishlists", wishlistId);
    const wishlistDoc = await getDoc(wishlistRef);

    if (!wishlistDoc.exists()) {
      throw new Error("Wishlist not found");
    }

    const wishlistData = wishlistDoc.data();
    let collaborators = wishlistData.collaborators || [];

    if (!collaborators.includes(collaboratorEmail)) {
      collaborators.push(collaboratorEmail);
      await updateDoc(wishlistRef, { collaborators });
    }

    // Send email invitation (you'll need to implement this separately)
    // await sendEmailInvitation(collaboratorEmail, wishlistId);

    console.log("Collaborator invited successfully");
    return true;
  } catch (error) {
    console.error("Error inviting collaborator:", error);
    throw error;
  }
};