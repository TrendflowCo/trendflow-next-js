import { CardActions, CardMedia, CircularProgress, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector , useAppDispatch } from "../../redux/hooks";
import { setFocusedCard } from "../../redux/features/actions/search";
import { logos } from "../Utils/logos";
import Image from "next/image";
import { enhanceText } from "../Utils/enhanceText";
import { toast } from "sonner";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../services/firebase";
import { wishlistChange } from "./functions/wishlistChange";
import { setWishlist } from "../../redux/features/actions/search";

const SingleCard = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { focusedCard } = useAppSelector(state => state.search);
    const { translations } = useAppSelector(state => state.language);
    const { wishlist } = useAppSelector(state => state.search);
    const [loadingFav , setLoadingFav] = useState(false);


    const handleAddWishlist = async (event) => {
        event.stopPropagation();
        if (user) {
          setLoadingFav(true);
          const response = await wishlistChange(focusedCard.id , user , wishlist);
          if(response === 'added'){
            let newWishlist = [...wishlist];
            newWishlist.push(focusedCard.id);
            dispatch(setWishlist(newWishlist))
            setLoadingFav(false);
          } else if (response === 'deleted') {
            let newWishlist = [...wishlist];
            const index = newWishlist.findIndex(item => item === focusedCard.id);
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
          content_id: focusedCard.shop_link
        });
        window.open(focusedCard.shop_link, '_blank');
    };
    const handleCopyToClipboard = () => {
        logEvent(analytics, 'select_content', {
            content_type: 'copy_to_clipboard',
            content_id: focusedCard.shop_link
        });
        navigator.clipboard.writeText(focusedCard.shop_link);
        toast.success('Copied to clipboard')    
    };
    
    return (
        <>
            {focusedCard?.id && <div className="h-full w-full bg-dokuso-black absolute top-0 left-0 z-10 bg-opacity-30"></div>}
            <div className={`fixed inset-0 w-fit h-fit max-w-[95vw] max-h-[95vh] mx-auto my-auto rounded-[16px] flex flex-col bg-dokuso-white border-l border-l-stamm-gray shadow-2xl z-20 ease-in-out duration-500 ${focusedCard?.id ? 'shadow-[-10px_0px_30px_10px_rgba(0,0,0,0.3)] scale-100' : 'shadow-none scale-0'}`}>
                { focusedCard?.id && 
                    <>
                        <div className="flex flex-row justify-end" >
                            <IconButton onClick={() => {dispatch(setFocusedCard({}))}}>
                                <CloseIcon fontSize="medium"/>
                            </IconButton>
                        </div>
                        <section className='flex flex-col mb-4 w-full h-fit overflow-y-auto scrollbar'>
                            <div className='flex flex-row items-center justify-start items-start w-full h-14 lg:h-20 px-4'>
                                    <Image 
                                    src={logos[focusedCard?.brand?.toLowerCase()]} 
                                    alt={focusedCard?.brand} 
                                    height={0} 
                                    width={0} 
                                    sizes="100vw" 
                                    style={{height: '75%' , width: '35%' , objectFit: 'contain', alignSelf:'center' }}
                                    />
                            </div>
                            <div className="w-full flex flex-col items-center justify-start">
                                <CardMedia
                                    component="img"
                                    image={focusedCard.img_url}
                                    alt={focusedCard.name}
                                    sx={{ maxHeight:'70vh', width:'90%', objectFit:'scale-down' }}
                                />
                            </div>
                            <section className="my-4 px-4 flex flex-col w-full">
                                <p>{enhanceText(focusedCard.name)}</p>
                                <div className="flex flex-row w-full justify-between">
                                    {
                                        focusedCard.old_price_float !== focusedCard.price_float ? 
                                        <div className='flex flex-row w-full'>
                                            <span className='font-semibold text-dokuso-pink mr-1'>{`$${focusedCard.price_float}`}</span> 
                                            <span className='font-semibold line-through'>{`$${focusedCard.old_price_float}`}</span> 
                                        </div>
                                        : 
                                        <span className='font-semibold'>{focusedCard.price_float !== 0 ? `$${focusedCard.price_float}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
                                    }
                                    <section className='flex flex-col h-fit flex-none'>
                                        <CardActions disableSpacing>
                                        <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)} placement="bottom" arrow={true} onClick={(event) => {handleAddWishlist(event)}}>
                                            <IconButton>
                                            { loadingFav ?
                                                <CircularProgress style={{'color': "#FA39BE"}} size={24} thickness={4}/> 
                                            :
                                                wishlist.includes(focusedCard.id) ? 
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
                                </div>
                            </section>
                        </section>
                    </>
                }
            </div>
        </>
    )
};

export default SingleCard;