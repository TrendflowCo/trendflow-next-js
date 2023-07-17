import { Box, CardActions, CardMedia, CircularProgress, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setFocusedCard } from "../../../redux/features/actions/search";
import { logos } from "../../Utils/logos";
import Image from "next/image";
import { enhanceText } from "../../Utils/enhanceText";
import { Toaster, toast } from "sonner";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../services/firebase";
import { wishlistChange } from "./../functions/wishlistChange";
import { setWishlist } from "../../../redux/features/actions/search";
import axios from "axios";
import { endpoints } from "../../../config/endpoints";
import { useRouter } from "next/router";
import SimilarCard from "./SimilarCard";
import { setLanguage } from "../../../redux/features/actions/language";

const Explore = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { focusedCard } = useAppSelector(state => state.search);
    const { translations } = useAppSelector(state => state.language);
    const { wishlist } = useAppSelector(state => state.search);
    const [loadingFav , setLoadingFav] = useState(false);
    const [currentProduct , setCurrentProduct] = useState({});
    const [similarProducts , setSimilarProducts] = useState([]);
    const [loading , setLoading] = useState(true);
    const [ready , setReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const completeQuery = router.query.id;
            const currentArray = completeQuery.split(' ');
            const currentId = currentArray[1];
            // const currentId = router.query.id;
            const currentLanguage = router.query.lan;
            // traer el de la query
            try {
                const currentIdProduct = (await axios.get(`${endpoints('byIds')}${currentId}`)).data;
                setCurrentProduct(currentIdProduct.results[0])
                // traer los similares
                const similars = (await axios.get(`${endpoints('similarProducts')}${currentId}`)).data;
                setSimilarProducts(similars.results);
                dispatch(setLanguage(currentLanguage)); // write redux variable - avoid refresh
                setLoading(false);    
            } catch (err) {
                setLoading(false);
            }
        }
        setLoading(true);
        if (router.query.id && router.query.lan) {
            fetchData();
        }
    },[router.query.id]) //eslint-disable-line


    const handleAddWishlist = async (event) => {
        event.stopPropagation();
        if (user) {
          setLoadingFav(true);
          const response = await wishlistChange(currentProduct.id , user , wishlist);
          if(response === 'added'){
            let newWishlist = [...wishlist];
            newWishlist.push(currentProduct.id);
            dispatch(setWishlist(newWishlist))
            setLoadingFav(false);
          } else if (response === 'deleted') {
            let newWishlist = [...wishlist];
            const index = newWishlist.findIndex(item => item === currentProduct.id);
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
          content_id: currentProduct.shop_link
        });
        window.open(currentProduct.shop_link, '_blank');
    };
    const handleCopyToClipboard = () => {
        logEvent(analytics, 'select_content', {
            content_type: 'copy_to_clipboard',
            content_id: currentProduct.shop_link
        });
        navigator.clipboard.writeText(currentProduct.shop_link);
        toast.success('Copied to clipboard')    
    };
    
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
            { loading ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            :
                <>
                    {!loading && currentProduct.id ? 
                        <>
                            <div className='flex flex-row items-between justify-between lg:justify-between mx-5'>
                                <Image
                                    src={logos[currentProduct?.brand?.toLowerCase()]} 
                                    alt={currentProduct?.brand} 
                                    sizes="100vw" 
                                    height={0} 
                                    width={0} 
                                    style={{height: '32px' , width: 'auto' , objectFit: 'contain', alignSelf:'center' }}
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-start mt-4">
                                <CardMedia
                                    component="img"
                                    image={currentProduct.img_url}
                                    alt={currentProduct.name}
                                    sx={{ maxHeight:'70vh', width:'90%', objectFit:'scale-down' }}
                                />
                            </div>
                            <section className='flex flex-row items-center justify-between p-4 w-full'>
                                <div className="flex flex-col w-full">
                                    <div className={`flex flex-col ${currentProduct.old_price_float !== currentProduct.price_float ? 'w-[70%]' : 'w-full'}`}>
                                        <span className='pr-2'>{`${enhanceText(currentProduct.name)}`}</span>
                                        {
                                        currentProduct.old_price_float !== currentProduct.price_float ? 
                                        <div className='flex flex-row w-full'>
                                            <span className='font-semibold text-dokuso-pink mr-1'>{`$${currentProduct.price_float}`}</span> 
                                            <span className='font-semibold line-through'>{`$${currentProduct.old_price_float}`}</span> 
                                        </div>
                                        : 
                                        <span className='font-semibold'>{currentProduct.price_float !== 0 ? `$${currentProduct.price_float}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
                                        }
                                    </div>
                                    {/* On sale checking */}
                                    {currentProduct.old_price_float !== currentProduct.price_float && 
                                        <div className='flex-none w-fit h-fit py-2 px-4 rounded-xl bg-gradient-to-r from-dokuso-pink to-dokuso-orange text-center'>
                                        <span className='text-lg font-bold text-dokuso-white'>{translations?.results?.on_sale.toUpperCase()}</span>
                                        </div>
                                    }
                                </div>
                                <div className='flex flex-col h-fit flex-none'>
                                    <Toaster richColors/>
                                    <CardActions disableSpacing>
                                    <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)} placement="bottom" arrow={true} onClick={(event) => {handleAddWishlist(event)}}>
                                        <IconButton>
                                        { loadingFav ?
                                            <CircularProgress style={{'color': "#FA39BE"}} size={24} thickness={4}/> 
                                        :
                                            wishlist.includes(currentProduct.id) ? 
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
                                </div>
                            </section>
                            {
                                similarProducts?.length > 0 &&
                                <section className="w-full px-4 mt-8">
                                    <h6 className='text-dokuso-black text-lg md:text-xl leading-10 font-semibold'>Related products</h6>
                                    <div className="flex flex-row w-full overflow-x-auto scrollbar mt-4 mb-16 pb-8">
                                        {similarProducts?.map((item , index) => <SimilarCard key={index} productItem={item}/>)}
                                    </div>
                                    
                                </section>
                            }
                        </>
                    : 
                        <section>No results for this search</section>
                    }
                </>
            }

        </Box>
    )
};

export default Explore;