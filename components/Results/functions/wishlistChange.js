import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { logAnalyticsEvent } from "../../../services/firebase";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { swalNoInputs } from "../../Utils/swalConfig";
import { app } from "../../../services/firebase";

const db = getFirestore(app);

export const wishlistChange = async (id , user , wishlist) => {
    try {
        if (!wishlist.includes(id)) { // if the image is not included yet, add it
          await addDoc(collection(db, "wishlist"), {
            uid: user.uid,
            img_id: id,
          })
          // log add to wishlist
          logAnalyticsEvent('clickAddToWishlist', {
            img_id: id
          });
          toast.success('Added item to wishlist');
          return 'added'
        } else { // delete if it exists
          // log remove from wishlist
          logAnalyticsEvent('clickRemoveFromWishlist', {
            img_id: id
          });
          const q = query(collection(db, "wishlist"), where("img_id", "==", id)); // bring the query with the one with this img_id
          const querySnapshot = await getDocs(q); // load it
          let requestedFavourite = {};
          querySnapshot.forEach((doc) => {
            requestedFavourite = {...doc.data(), id: doc.id} // include it here
          })
          if(requestedFavourite.id) {
            await deleteDoc(doc(db, "wishlist", requestedFavourite.id));
            toast.success('Removed item from wishlist')
            return 'deleted'
          } else {
            Swal.fire({
              ...swalNoInputs,
              text: "Impossible to delete this item",
              confirmButtonText: "Damn"
            });
            return false
          }
        }
      } catch (err) {
        console.error(err);
        return false
      }
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to update wishlist');
    return false;
  }
};