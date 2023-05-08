import { GoogleAuthProvider , signInWithPopup } from "firebase/auth";
import { query , getDocs, collection , where , addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const provider = new GoogleAuthProvider();
export const signInGoogleExternal = async (auth,db) => { // basic sign in function
  try {
      const result = await signInWithPopup(auth,provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid)); // bring all users with their UID
      const docs = await getDocs(q);
      if (docs.docs.length === 0) { // If theres no user with the current UID
        await addDoc(collection(db, "users"), { // create a user with the current UID
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
        console.log('Signed up with Google - Added new user')
        // event login - add later
        // logEvent(analytics, 'sign_up', {
        //   method: 'google'
        // });
      } else {
        console.log('Logged in with Google - Existing user');
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
