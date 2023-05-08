import { GoogleAuthProvider , signInWithPopup } from "firebase/auth";
const provider = new GoogleAuthProvider();
export const signInGoogleExternal = async (auth) => { // basic sign in function
  try {
      const result = await signInWithPopup(auth,provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
  } catch(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
  }
}
