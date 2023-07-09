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
import { Tooltip } from '@mui/material';
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
import { setFocusedCard } from '../../redux/features/actions/search';
import { useAppDispatch } from '../../redux/hooks';
import { wishlistChange } from './functions/wishlistChange';
import { setWishlist } from '../../redux/features/actions/search';

const ResultCard = ({productItem }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.language);
  const [loadingFav , setLoadingFav] = useState(false);
  const handleShowSingleCard = () => {
    dispatch(setFocusedCard(productItem));
    // use dialog from MUI
  };
  const handleAddWishlist = async (event) => {
    event.stopPropagation();
    if (user) {
      setLoadingFav(true);
      const response = await wishlistChange(productItem.id , user , wishlist);
      if(response === 'added'){
        let newWishlist = [...wishlist];
        newWishlist.push(productItem.id);
        dispatch(setWishlist(newWishlist))
        setLoadingFav(false);
      } else if (response === 'deleted') {
        let newWishlist = [...wishlist];
        const index = newWishlist.findIndex(item => item === productItem.id);
        newWishlist.splice(index, 1); // 2nd parameter means remove one item only
        dispatch(setWishlist(newWishlist))
        setLoadingFav(false);
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
          sx={{ height: 400 , objectFit: 'cover' , cursor: 'pointer' }}
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