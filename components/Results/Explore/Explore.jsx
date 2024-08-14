import { Box, CardActions, CircularProgress, IconButton, Tooltip, Typography, Badge } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
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
import { setWishlist, setPreviousResults } from "../../../redux/features/actions/search";
import Swal from 'sweetalert2';
import { swalNoInputs } from "../../Utils/swalConfig";
import axios from "axios";
import { endpoints } from "../../../config/endpoints";
import { useRouter } from "next/router";
import { languageAdapter } from "../functions/languageAdapter";
import Head from "next/head";
import ExploreCarousel from "./ExploreCarousel";
import arrow from "../../../public/Arrow1.svg";
import { handleAddTag } from "../../functions/handleAddTag";
import GlobalLoader from "../../Common/Loaders/GlobalLoader";
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import { 
  EmailShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailIcon, 
  TwitterIcon, 
  WhatsappIcon 
} from 'react-share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ProductImageGallery from './ProductImageGallery';
import CheckIcon from '@mui/icons-material/Check';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Link from 'next/link';
import ShareModal from '../../Common/ShareModal';

const Explore = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { translations , country, language } = useAppSelector(state => state.region);
    const { wishlist , currentSearch, previousResults } = useAppSelector(state => state.search);
    console.log('Explore component - previousResults:', previousResults);
    console.log('Explore component - entire search state:', useAppSelector(state => state.search));

    const [loadingFav , setLoadingFav] = useState(false);
    const [currentProduct , setCurrentProduct] = useState({});
    const [similarProducts , setSimilarProducts] = useState([]);
    const [loading , setLoading] = useState(true);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const completeQuery = router.query.id;
            const currentArray = completeQuery.split(' ');
            const currentId = currentArray[1];
            const currentLanguage = router.query.lan;
            const languageQuery = `&language=${languageAdapter(currentLanguage)}`;
            try {
                const currentIdProduct = (await axios.get(`${endpoints('dedicatedProduct')}${currentId}${languageQuery}`)).data;
                console.log('API response:', currentIdProduct);
                setCurrentProduct(currentIdProduct.result)
                // traer los similares
                const similars = (await axios.get(`${endpoints('similarProducts')}${currentId}`)).data;
                setSimilarProducts(similars.results);
                
                // No need to fetch previous results here, they should already be in the Redux store
                
                setLoading(false);    
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        }
        
        if (router.query.id && router.query.lan) {
            fetchData();
        }
    }, [router.query.id, router.query.lan])

    const handleAddWishlist = async (event) => {
        event.stopPropagation();
        if (user) {
          setLoadingFav(true);
          const response = await wishlistChange(currentProduct.id_item , user , wishlist);
          if(response === 'added'){
            let newWishlist = [...wishlist];
            newWishlist.push(currentProduct.id);
            dispatch(setWishlist(newWishlist))
            setLoadingFav(false);
          } else if (response === 'deleted') {
            let newWishlist = [...wishlist];
            const index = newWishlist.findIndex(item => item === currentProduct.id_item);
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
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%' , flexDirection: 'column' , py: '24px' }}>
            { loading ? 
                <GlobalLoader/>
            :
                <>
                    {!loading && currentProduct?.id_item ? 
                        <>
                            <Head>
                                {currentProduct?.name && <title>{`TrendFlow - ${enhanceText(currentProduct.name)}`}</title>}
                                {currentProduct?.name && <meta name="description" content={enhanceText(currentProduct.name)}/>}
                                {currentProduct?.brand && <meta name="brand" content={enhanceText(currentProduct.brand)}/>}
                                {currentProduct?.category && <meta name="section" content={enhanceText(currentProduct.category)}/>}
                            </Head>
                            <section className="container mx-auto px-4 py-10" style={{ marginBottom: '1rem' }}>
                                <nav className="flex mb-4" aria-label="Breadcrumb">
                                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                      <Link href="/" className="text-gray-700 hover:text-trendflow-pink">Home</Link>
                                    </li>
                                    <li>
                                      <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                        <Link href="/results" className="ml-1 text-gray-700 hover:text-trendflow-pink md:ml-2">Results</Link>
                                      </div>
                                    </li>
                                    {currentProduct?.brand && (
                                      <li>
                                        <div className="flex items-center">
                                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                          <span className="ml-1 text-gray-700 md:ml-2">{enhanceText(currentProduct.brand)}</span>
                                        </div>
                                      </li>
                                    )}
                                    {currentProduct?.category && (
                                      <li>
                                        <div className="flex items-center">
                                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                          <span className="ml-1 text-gray-700 md:ml-2">{enhanceText(currentProduct.category)}</span>
                                        </div>
                                      </li>
                                    )}
                                    <li aria-current="page">
                                      <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                        <span className="ml-1 text-gray-400 md:ml-2">{enhanceText(currentProduct?.name)}</span>
                                      </div>
                                    </li>
                                  </ol>
                                </nav>
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/2 lg:pr-8">
                                        {console.log('Product images:', currentProduct.img_url)}
                                        <ProductImageGallery images={currentProduct.img_url} />
                                    </div>
                                    <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
                                        <h1 className="text-3xl font-bold mb-4">{enhanceText(currentProduct?.name)}</h1>
                                        <div className="flex items-center mb-6">
                                            <Image
                                                src={logos[currentProduct?.brand?.toLowerCase()]}
                                                alt={currentProduct?.brand}
                                                width={100}
                                                height={40}
                                                objectFit="contain"
                                            />
                                            <span className="ml-4 text-lg font-semibold">{currentProduct?.brand}</span>
                                        </div>
                                        <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                            {currentProduct.sale ? (
                                                <div className="flex items-center">
                                                    <span className="text-2xl font-bold text-trendflow-pink mr-2">{`${currentProduct.currency} ${currentProduct.price}`}</span>
                                                    <span className="text-lg line-through text-gray-500">{`${currentProduct.currency} ${currentProduct.old_price}`}</span>
                                                    <span className="ml-2 bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white px-2 py-1 rounded-full text-sm font-bold">{`${parseInt(currentProduct.discount_rate*100)}% OFF`}</span>
                                                </div>
                                            ) : (
                                                <span className="text-2xl font-bold text-trendflow-blue">{currentProduct.price !== 0 ? `${currentProduct.currency} ${currentProduct.price}` : enhanceText(translations?.results?.no_price)}</span>
                                            )}
                                        </div>
                                        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                                          <h2 className="text-xl font-semibold mb-2">{translations?.exploreSection?.highlights}</h2>
                                          <div className="grid grid-cols-2 gap-4">
                                            {currentProduct.material && (
                                              <div>
                                                <span className="font-medium">{translations?.exploreSection?.material}: </span>
                                                {enhanceText(currentProduct.material)}
                                              </div>
                                            )}
                                            {currentProduct.color && (
                                              <div>
                                                <span className="font-medium">{translations?.exploreSection?.color}: </span>
                                                {enhanceText(currentProduct.color)}
                                              </div>
                                            )}
                                            {currentProduct.style && (
                                              <div>
                                                <span className="font-medium">{translations?.exploreSection?.style}: </span>
                                                {enhanceText(currentProduct.style)}
                                              </div>
                                            )}
                                            {currentProduct.occasion && (
                                              <div>
                                                <span className="font-medium">{translations?.exploreSection?.occasion}: </span>
                                                {enhanceText(currentProduct.occasion)}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="mb-6">
                                          <h2 className="text-2xl font-semibold mb-4">{translations?.exploreSection?.description}</h2>
                                          <div className="bg-gray-100 p-4 rounded-lg">
                                            {currentProduct.desc_1 && <p className="mb-3">{enhanceText(currentProduct.desc_1)}</p>}
                                            {currentProduct.desc_2 && <p className="mb-3">{enhanceText(currentProduct.desc_2)}</p>}
                                            {currentProduct.features && (
                                              <div className="mt-4">
                                                <h3 className="text-lg font-semibold mb-2">{translations?.exploreSection?.features}</h3>
                                                <ul className="list-disc list-inside">
                                                  {currentProduct.features.map((feature, index) => (
                                                    <li key={index} className="mb-1">{enhanceText(feature)}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {currentProduct?.tags?.length > 0 && (
                                            <div className="mb-6">
                                                <h2 className="text-xl font-semibold mb-2">{translations?.exploreSection?.relatedTags}</h2>
                                                <div className="flex flex-wrap">
                                                    {currentProduct.tags?.sort().map((itemTag, indexTag) => (
                                                        <Tooltip key={indexTag} title={`Add ${itemTag} to searchbar`} placement="top" arrow={true}>
                                                            <button
                                                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 hover:bg-gray-300 transition-colors duration-200"
                                                                onClick={() => handleAddTag(dispatch, currentSearch, itemTag)}
                                                            >
                                                                {enhanceText(itemTag)}
                                                            </button>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {currentProduct.reviews && (
                                          <div className="mb-6">
                                            <h2 className="text-xl font-semibold mb-2">{translations?.exploreSection?.customerReviews}</h2>
                                            <div className="flex items-center mb-2">
                                              <StarIcon sx={{ color: '#FFC107' }} />
                                              <span className="ml-1 font-bold">{currentProduct.averageRating}</span>
                                              <span className="ml-2 text-gray-600">({currentProduct.reviews.length} {translations?.exploreSection?.reviews})</span>
                                            </div>
                                            {currentProduct.reviews.slice(0, 3).map((review, index) => (
                                              <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                                                <p className="font-medium">{review.title}</p>
                                                <p className="text-sm text-gray-600">{review.comment}</p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        <div className="mt-6 bg-gradient-to-r from-trendflow-pink to-trendflow-blue p-4 rounded-lg text-white shadow-lg">
                                          <h2 className="text-2xl font-bold mb-2">{translations?.exploreSection?.ctaTitle}</h2>
                                          <p className="mb-4 text-sm">{translations?.exploreSection?.ctaDescription}</p>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                              variant="contained"
                                              startIcon={<StorefrontIcon />}
                                              onClick={handleVisitSite}
                                              sx={{
                                                background: 'white',
                                                color: '#1A237E',
                                                fontWeight: 'bold',
                                                padding: '8px 16px',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                  background: '#E8EAF6',
                                                  color: '#303F9F',
                                                  transform: 'translateY(-2px)',
                                                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                },
                                              }}
                                            >
                                              {enhanceText(translations?.exploreSection?.visitPartnerSite)}
                                            </Button>
                                            <Button
                                              variant="outlined"
                                              startIcon={<ShareIcon />}
                                              onClick={() => setShareModalOpen(true)}
                                              sx={{
                                                borderColor: 'white',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                padding: '8px 16px',
                                                fontSize: '0.875rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                  borderColor: 'white',
                                                  background: 'rgba(255, 255, 255, 0.1)',
                                                  transform: 'translateY(-2px)',
                                                },
                                              }}
                                            >
                                              {enhanceText(translations?.results?.share)}
                                            </Button>
                                            <Tooltip 
                                              title={
                                                <React.Fragment>
                                                  <Typography color="inherit">Save to Wishlist</Typography>
                                                  <em>{"Click to save this item for later"}</em>
                                                </React.Fragment>
                                              } 
                                              arrow
                                            >
                                              <IconButton
                                                onClick={(event) => handleAddWishlist(event)}
                                                disabled={loadingFav}
                                                sx={{
                                                  color: 'white',
                                                  transition: 'all 0.3s ease',
                                                  '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    transform: 'scale(1.1)',
                                                  },
                                                }}
                                              >
                                                {loadingFav ? (
                                                  <CircularProgress size={24} color="inherit" />
                                                ) : wishlist.includes(currentProduct.id_item) ? (
                                                  <Badge badgeContent={<CheckIcon fontSize="small" />} color="success">
                                                    <FavoriteIcon />
                                                  </Badge>
                                                ) : (
                                                  <BookmarkBorderIcon />
                                                )}
                                              </IconButton>
                                            </Tooltip>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {similarProducts && similarProducts.length > 0 && (
                              <section className="w-full" style={{ padding: '1rem', marginTop: '1rem', marginBottom: '3rem' }}>
                                <div className="max-w-6xl mx-auto">
                                  <h2 className='text-trendflow-black text-2xl font-semibold mb-4' style={{ marginBottom: '0.5rem' }}>
                                    {translations?.exploreSection?.similarProducts}
                                  </h2>
                                  <p className="text-gray-600 text-sm mb-6" style={{ marginBottom: '1rem' }}>
                                    {translations?.exploreSection?.similarProductsDescription}
                                  </p>
                                  <div style={{ marginBottom: '2rem' }}>
                                    <ExploreCarousel products={similarProducts} translations={translations} />
                                  </div>
                                </div>
                              </section>
                            )}
                        </>
                    : 
                        <section>{translations?.noResults}</section>
                    }
                </>
            }

            {currentProduct && (() => {
                const shareUrl = currentProduct?.name 
                    ? `${window.location.origin}/${router.query.zone}/${router.query.lan}/results/explore/${currentProduct.name.split(' ').join('-')}%20${currentProduct.id_item}`
                    : '';
                const shareTitle = currentProduct?.name 
                    ? `Check out this product: ${currentProduct.name}`
                    : 'Check out this product';
                
                return (
                    <ShareModal
                        open={shareModalOpen}
                        onClose={() => setShareModalOpen(false)}
                        shareUrl={shareUrl}
                        shareTitle={shareTitle}
                        translations={translations}
                    />
                );
            })()}
        </Box>
    )
};

export default Explore;