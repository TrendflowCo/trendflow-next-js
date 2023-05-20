import React , { useEffect } from "react";
import { app } from "../../../services/firebase";

import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
  

const Wishlist = () => {
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data
  
    useEffect(() => { // ejemplo basico para traerme los IDs de los items que tengo en mi wishlist - solo lo id
        const fetchData = async () => {
            if (user) {
                try {
                    console.log('user: ', user);
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"])
                    console.log('fetched items: ', items);

                    // con eso busco los items completos
                    // fetchData(`/search?ids='${wishlist}'`)


                } catch (err) {
                    console.error(err);
                }

            }
        };
    fetchData();
    },[user])
    return (
        <div>Wishlist!</div>
    )
};

export default Wishlist;