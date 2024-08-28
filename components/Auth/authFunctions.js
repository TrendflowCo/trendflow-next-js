import { GoogleAuthProvider , signInWithPopup , getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, updateProfile, signOut, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { query , getDocs, collection , where , addDoc , getFirestore } from "firebase/firestore";
import Swal from "sweetalert2";
import { app, logAnalyticsEvent } from "../../services/firebase";
import { toast } from 'sonner';
import { signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword } from "firebase/auth";

// Initialize auth and db
const auth = getAuth(app);
const db = getFirestore(app);
// initialize google auth provider
const googleProvider = new GoogleAuthProvider();

export const signInGoogleExternal = async () => { // basic sign in function
  try {
      const result = await signInWithPopup(auth,googleProvider);
      const user = result.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid)); // bring all users with their UID
      const docs = await getDocs(q);
      if (docs.docs.length === 0) { // If theres no user with the current UID
        try {
          await addDoc(collection(db, "users"), { // create a user with the current UID
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
          });
          // event login
          logAnalyticsEvent('sign_up', {
            method: 'google'
          }); 
          toast.success(`Logged as ${user.displayName}`)    
          
        } catch (err) {
          console.error('Login failed: ' , err);
        }
      } else {
        try {
          // event login
          logAnalyticsEvent('login', {
            method: 'google'
          });  
          toast.success(`Logged as ${user.displayName}`)    
        } catch (error) {
          console.error('failed log event: ', error);
          logAnalyticsEvent('exception', {
            description: 'login_signup_google_error'
          });      
        }
      }
  } catch(error) {
    console.error('error at google auth: ', error);
    Swal.fire({
      icon: 'error',
      text: 'Error with Google log in'
    });
    try {
      // event login
      logAnalyticsEvent('exception', {
        description: 'login_signup_google_error'
      });
    } catch(error) {
      console.error('failed log event: ', error);
    }
  }
}

export const sendSignInLink = async (email, password) => {
  try {
    // Check if the email is already in use
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      throw new Error('This email is already in use. Please try logging in instead.');
    }

    const actionCodeSettings = {
      url: `${window.location.origin}/finishSignUp?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    localStorage.setItem('passwordForSignIn', password); // Store password temporarily
    toast.success('Verification link sent to your email', { id: 'signInLinkSent' });
  } catch (error) {
    console.error('Error sending verification link:', error);
    toast.error(error.message || 'Failed to send verification link', { id: 'signInLinkError' });
    throw error;
  }
};

export const completeSignInWithEmailLink = async () => {
  console.log("Starting completeSignInWithEmailLink...");
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = localStorage.getItem('emailForSignIn');
    let password = localStorage.getItem('passwordForSignIn');
    
    console.log("Email from localStorage:", email);
    console.log("Password exists:", !!password);

    if (!email || !password) {
      throw new Error('Email and password are required to complete sign-up');
    }
    
    try {
      console.log("Attempting to sign in with email link...");
      await signInWithEmailLink(auth, email, window.location.href);
      
      console.log("Email link sign-in successful, attempting to create new account...");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        logAnalyticsEvent('sign_up', { method: 'email_link' });
        return userCredential.user;
      } catch (createError) {
        if (createError.code === 'auth/email-already-in-use') {
          console.log("Email already in use, attempting to sign in...");
          const signInResult = await firebaseSignInWithEmailAndPassword(auth, email, password);
          logAnalyticsEvent('login', { method: 'email_link' });
          return signInResult.user;
        } else {
          throw createError;
        }
      }
    } catch (error) {
      console.error('Error during sign-in/sign-up:', error);
      throw error;
    } finally {
      console.log("Cleaning up localStorage...");
      localStorage.removeItem('emailForSignIn');
      localStorage.removeItem('passwordForSignIn');
    }
  } else {
    console.error("Invalid verification link");
    throw new Error('Invalid verification link');
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
    logAnalyticsEvent('login', {
      method: 'email_password'
    });
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    logAnalyticsEvent('exception', {
      description: 'login_error'
    });
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    logAnalyticsEvent('logout', {
      method: 'user_initiated'
    });
    // You might want to clear any user-related state here
  } catch (error) {
    console.error('Error signing out:', error);
    logAnalyticsEvent('exception', {
      description: 'logout_error'
    });
    throw error;
  }
};