import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logos } from '../Utils/logos';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { Skeleton, Tooltip } from '@mui/material';
import { Toaster, toast } from 'sonner';
import { analytics } from "../../services/firebase";
import { useAppSelector } from "../../redux/hooks";
import Swal from 'sweetalert2';
import { swalNoInputs } from '../Utils/swalConfig';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { CircularProgress } from "@mui/material";
import { logEvent } from 'firebase/analytics';
import { useAppDispatch } from '../../redux/hooks';
import { wishlistChange } from './functions/wishlistChange';
import { setWishlist } from '../../redux/features/actions/search';
import { useRouter } from 'next/router';
import CloudOffIcon from '@mui/icons-material/CloudOff';

const ResultCard = ({ productItem, onImageError }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.region);
  const [loadingFav , setLoadingFav] = useState(false);
  const [isLoading , setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [finalHeight , setFInalHeight] = useState(0);
  const handleShowSingleCard = () => {
    const withoutSlash = productItem.name.split('/').join('%2F');
    logEvent(analytics, 'clickSingleCard', {
      img_id: productItem.id_item
    });
    router.push(`/${router.query.zone}/${router.query.lan}/results/explore/${withoutSlash.split(' ').join('-')}%20${productItem.id_item}`)
  };
  const handleAddWishlist = async (event) => {
    event.stopPropagation();
    if (user) {
      setLoadingFav(true);
      const response = await wishlistChange(productItem.id_item , user , wishlist);
      if(response === 'added'){
        let newWishlist = [...wishlist];
        newWishlist.push(productItem.id_item);
        dispatch(setWishlist(newWishlist))
        setLoadingFav(false);
      } else if (response === 'deleted') {
        let newWishlist = [...wishlist];
        const index = newWishlist.findIndex(item => item === productItem.id_item);
        newWishlist.splice(index, 1); // 2nd parameter means remove one item only
        dispatch(setWishlist(newWishlist))
        setLoadingFav(false);
      }
    } else {
      logEvent(analytics, 'clickAddToWishlist', {
        img_id: productItem.id
      });
      Swal.fire({
        ...swalNoInputs,
        text: "You're not logged in",
        confirmButtonText: "Oh right"
      })
    }
  };
  const handleVisitSite = () => {
    let finalURI = productItem.shop_link;
    if(!productItem.shop_link.includes('http://') && !productItem.shop_link.includes('https://')) {
      finalURI = `https://${productItem.shop_link}`
    }
    logEvent(analytics, 'select_content', {
      content_type: 'product',
      content_id: finalURI
    });
    window.open(finalURI, '_blank').focus();
  };
  const handleCopyToClipboard = () => {
    logEvent(analytics, 'select_content', {
      content_type: 'copy_to_clipboard',
      content_id: productItem.shop_link
    });
    navigator.clipboard.writeText(productItem.shop_link);
    toast.success('Copied to clipboard')    
  };
  const handleMediaLoad = () => {
    setIsLoading(false);
    setFInalHeight(400);
  };
  const handleMediaError = () => {
    setIsLoading(false);
    setHasError(true);
    onImageError(productItem.id_item);
  };

  return (
    <Card 
      sx={{ height: '100%' , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , justifyContent: 'space-between' }} 
      className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
    >
      <section className='flex flex-col w-full h-full relative'>
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {isLoading && <Skeleton variant="rectangular" width={'100%'} height={400} />}
          {!hasError ? (
            <Image
              src={productItem.img_url}
              alt={productItem.name}
              layout="fill"
              objectFit="cover"
              onClick={() => {handleShowSingleCard()}}
              onLoadingComplete={handleMediaLoad}
              onError={handleMediaError}
            />
          ) : (
            <div className='h-full flex flex-col items-center justify-center bg-gray-200'>
              <CloudOffIcon fontSize='large' className='text-gray-400'/>
              <span className='text-gray-600 mt-2'>Image unavailable</span>
            </div>
          )}
        </div>
        {productItem.sale && 
          <div className='flex-none absolute shadow-xl border border-trendflow-white top-2 right-2 w-fit h-fit p-2 rounded-xl bg-gradient-to-r from-trendflow-pink to-trendflow-orange text-center'>
            <span className='text-xs md:text-sm lg:text-base font-semibold text-trendflow-white'>{translations?.results?.on_sale.toUpperCase()}</span>
          </div>
        }
        <section className='flex flex-row p-3 mt-1 w-full'>
          <div className={`flex flex-col w-2/3`}>
            <span className='text-sm md:text-base xl:text-lg pr-2 truncate'>{`${enhanceText(productItem.name)}`}</span>
            {
              productItem.sale ? 
              <div className='flex flex-row w-full'>
                <span className='font-semibold text-trendflow-pink mr-1'>{`${productItem.currency} ${productItem.price}`}</span> 
                <span className='line-through text-xs self-center'>{`${productItem.currency} ${productItem.old_price}`}</span> 
              </div>
            : 
              <span className='font-semibold'>{productItem.price !== 0 ? `${productItem.currency} ${productItem.price}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
            }
          </div>
          <div className='flex flex-row items-center justify-start w-1/3'>
            <div className='w-full h-full flex flex-col justify-center items-start'>
              <Image 
                src={logos[productItem?.brand?.toLowerCase()]} 
                alt={productItem?.brand} 
                height={0} 
                width={0} 
                sizes="100vw" 
                style={{height: 'auto' , width: '100%' , objectFit: 'contain', alignSelf:'start' }}
              />
            </div>
          </div>
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
                wishlist.includes(productItem.id_item) ? 
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
          >
            <IconButton onClick={handleVisitSite}>
            <StorefrontIcon/>
            </IconButton>
          </Tooltip>
        </CardActions>
      </section>
    </Card>
  );
}

export default ResultCard;