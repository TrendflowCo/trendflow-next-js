import { GoogleAuthProvider , signInWithPopup , getAuth } from "firebase/auth";
import { query , getDocs, collection , where , addDoc , getFirestore } from "firebase/firestore";
import Swal from "sweetalert2";
// import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "../../services/firebase";

// Initialize analytics component
// const analytics = getAnalytics(app);

// Initialize auth and db
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
export const signInGoogleExternal = async () => { // basic sign in function
  try {
      const result = await signInWithPopup(auth,googleProvider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
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
          // event login - add later
          // logEvent(analytics, 'sign_up', {
          //   method: 'google'
          // }); 
        } catch (err) {
          console.error(err);
        }
      } else {
        // event login - add later
        // logEvent(analytics, 'login', {
        //   method: 'google'
        // });  
      }
  } catch(error) {
    console.error('error at google auth: ', error);
    Swal.fire({
      icon: 'error',
      text: 'Error with Google log in'
    });
    // event login - add later
    // logEvent(analytics, 'exception', {
    //   description: 'login_signup_google_error'
    // });
  }
}
