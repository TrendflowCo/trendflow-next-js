import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logos } from '../Utils/logos';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { Menu, MenuItem, Tooltip } from '@mui/material';
import { Toaster, toast } from 'sonner';
import { collection , addDoc , getDocs, query , where , getFirestore , deleteDoc , doc } from "firebase/firestore";
import { analytics, app } from "../../services/firebase";
import { useAppSelector } from "../../redux/hooks";
import Swal from 'sweetalert2';
import { swalNoInputs } from '../Utils/swalConfig';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { CircularProgress } from "@mui/material";
import { logEvent } from 'firebase/analytics';

const ResultCard = ({productItem , reloadFlag , setReloadFlag }) => {
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.language);
  const db = getFirestore(app);
  const [loadingFav , setLoadingFav] = useState(false);
  const [showFocused , setShowFocused] = useState(false);
  const handleShowSingleCard = () => {
    console.log('showing card: ' , productItem);
    // use dialog from MUI
    setShowFocused(true);
  };
  const handleAddWishlist = async (event) => {
    event.stopPropagation();
    if (user) {
      setLoadingFav(true);
      try {
        if (!wishlist.includes(productItem.id)) { // if the image is not included yet, add it
          await addDoc(collection(db, "wishlist"), {
            uid: user.uid,
            img_id: productItem.id,
          })
          // log add to wishlist
          logEvent(analytics, 'addToWishlist', {
            img_id: productItem.id
          });
        } else { // delete if it exists
          // log remove from wishlist
          logEvent(analytics, 'removeFromWishlist', {
            img_id: productItem.id
          });
          const q = query(collection(db, "wishlist"), where("img_id", "==", productItem.id)); // bring the query with the one with this img_id
          const querySnapshot = await getDocs(q); // load it
          let requestedFavourite = {};
          querySnapshot.forEach((doc) => {
            requestedFavourite = {...doc.data(), id: doc.id} // include it here
          })
          if(requestedFavourite.id) {
            await deleteDoc(doc(db, "wishlist", requestedFavourite.id));
          } else {
            Swal.fire({
              ...swalNoInputs,
              text: "Impossible to delete this item",
              confirmButtonText: "Damn"
            });
          }
        }
        setReloadFlag(!reloadFlag); // reload wishlist
        setLoadingFav(false);
      } catch (err) {
        setLoadingFav(false);
        console.error(err);
      }
    } else {
      Swal.fire({
        ...swalNoInputs,
        text: "You're not logged in",
        confirmButtonText: "Oh right"
      })
    }
  };
  const handleVisitSite = () => {
    logEvent(analytics, 'select_content', {
      content_type: 'product',
      content_id: productItem.shop_link
    });
    window.open(productItem.shop_link, '_blank');
  };
  const handleCopyToClipboard = () => {
    logEvent(analytics, 'select_content', {
      content_type: 'copy_to_clipboard',
      content_id: productItem.shop_link
    });
    navigator.clipboard.writeText(productItem.shop_link);
    toast.success('Copied to clipboard')    
  };

  return (
    <Card 
      sx={{ height: 650 , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , justifyContent: 'space-between' }} 
      className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
    >
      <section className='flex flex-col w-full h-full'>
        <div className='flex flex-row items-center justify-start w-full h-20 py-2 px-4'>
          <div className='w-full h-full flex flex-col justify-center items-start'>
            <Image 
              src={logos[productItem?.brand?.toLowerCase()]} 
              alt={productItem?.brand} 
              height={0} 
              width={0} 
              sizes="100vw" 
              style={{height: '75%' , width: '35%' , objectFit: 'contain', alignSelf:'start' }}
            />
          </div>
        </div>
        <CardMedia
          component="img"
          image={productItem.img_url}
          alt={productItem.name}
          sx={{ height: 400 , objectFit: 'cover' }}
          onClick={() => {handleShowSingleCard()}}
        />
        <section className='flex flex-row p-4 w-full'>
          <div className={`flex flex-col ${productItem.old_price_float !== productItem.price_float ? 'w-[70%]' : 'w-full'}`}>
            <span className='pr-2 truncate'>{`${enhanceText(productItem.name)}`}</span>
            {
              productItem.old_price_float !== productItem.price_float ? 
              <div className='flex flex-row w-full'>
                <span className='font-semibold text-dokuso-pink mr-1'>{`$${productItem.price_float}`}</span> 
                <span className='font-semibold line-through'>{`$${productItem.old_price_float}`}</span> 
              </div>
            : 
              <span className='font-semibold'>{productItem.price_float !== 0 ? `$${productItem.price_float}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
            }
          </div>
          {/* On sale checking */}
          {productItem.old_price_float !== productItem.price_float && 
            <div className='flex-none w-[30%] h-fit p-2 rounded-xl bg-gradient-to-r from-dokuso-pink to-dokuso-orange text-center'>
              <span className='text-lg font-bold text-dokuso-white'>{translations?.results?.on_sale.toUpperCase()}</span>
            </div>
          }
        </section>
      </section>
      <section className='flex flex-col h-fit w-full flex-none'>
        <Toaster richColors/>
        <CardActions disableSpacing>
          <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)} placement="bottom" arrow={true} onClick={(event) => {handleAddWishlist(event)}}>
            <IconButton>
              { loadingFav ?
                <CircularProgress style={{'color': "#FA39BE"}} size={24} thickness={4}/> 
              :
                wishlist.includes(productItem.id) ? 
                <FavoriteIcon style={{'color': "#FA39BE"}} /> : 
                <FavoriteBorderOutlinedIcon/>
              }
            </IconButton>
          </Tooltip>
          <Tooltip 
            title={enhanceText(translations?.results?.copy_to_clipboard)} 
            placement="bottom" 
            arrow={true}  
            onClick={handleCopyToClipboard}
          >
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={enhanceText(translations?.results?.visit_site)}  
            placement="bottom" 
            arrow={true}  
            onClick={handleVisitSite}
          >
            <IconButton>
            <StorefrontIcon/>
            </IconButton>
          </Tooltip>
        </CardActions>
      </section>
    </Card>
  );
}

export default ResultCard;