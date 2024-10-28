import { Box, Button, Typography, IconButton, Tooltip, Badge, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { enhanceText } from '../../Utils/enhanceText';
import { logos } from '../../Utils/logos';
import ProductImageGallery from './ProductImageGallery';
import ExploreCarousel from './ExploreCarousel';
import ShareModal from '../../Common/ShareModal';
import GlobalLoader from '../../Common/Loaders/GlobalLoader';
import StarIcon from '@mui/icons-material/Star';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckIcon from '@mui/icons-material/Check';
import { endpoints, fetchWithAuth } from "../../../config/endpoints";
import axios from "axios";

import { languageAdapter } from "../functions/languageAdapter";

import { wishlistChange } from "./../functions/wishlistChange";
import { setWishlist } from '../../../redux/features/actions/search';
import { logAnalyticsEvent } from '../../../services/firebase';
import { toast } from 'sonner';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import { app } from "../../../services/firebase";
import WishlistManager from '../../User/Wishlist/WishlistManager';

const Explore = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const auth = getAuth(app);
    const [user, authLoading] = useAuthState(auth);
    const { translations, country, language } = useAppSelector(state => state.region);
    const { wishlist, currentSearch, previousResults } = useAppSelector(state => state.search);
    const entireSearchState = useAppSelector(state => state.search);
    
    const [currentProduct, setCurrentProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [wishlistManagerOpen, setWishlistManagerOpen] = useState(false);

    useEffect(() => {
        console.log('Router query:', router.query);
        console.log('Explore component - previousResults:', previousResults);
        console.log('Explore component - entire search state:', entireSearchState);

        const fetchData = async () => {
            if (router.query.id && router.query.lan) {
                try {
                    setLoading(true);
                    // Extract only the UUID part from the query.id
                    const idParts = router.query.id.split(' ');
                    const productId = idParts[idParts.length - 1]; // Get the last part which should be the UUID
                    
                    console.log('Extracted Product ID:', productId);

                    const apiUrl = `${endpoints('dedicatedProduct')}${productId}&language=${router.query.lan}`;
                    console.log('API URL:', apiUrl);

                    const response = await fetchWithAuth(apiUrl);
                    console.log('API Response:', response);

                    if (response && response.success) {
                        setCurrentProduct(response.product);
                        setSimilarProducts(response.similar_products);
                    } else {
                        console.error('Failed to fetch product data:', response);
                        toast.error('Failed to load product data. Please try again.');
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                    toast.error('An error occurred while fetching product data. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };
        
        if (router.query.id && router.query.lan) {
            fetchData();
        }
    }, [router.query.id, router.query.lan, entireSearchState, previousResults]);

    const handleAddWishlist = (event) => {
        event.stopPropagation();
        if (!user) {
            toast.error("You're not logged in");
            return;
        }
        setWishlistManagerOpen(true);
    };

    const handleVisitSite = () => {
        logAnalyticsEvent('select_content', {
          content_type: 'product',
          content_id: currentProduct.shop_link
        });
        window.open(currentProduct.shop_link, '_blank');
    };
    const handleCopyToClipboard = () => {
        logAnalyticsEvent('select_content', {
            content_type: 'copy_to_clipboard',
            content_id: currentProduct.shop_link
        });
        navigator.clipboard.writeText(currentProduct.shop_link);
        toast.success('Copied to clipboard')    
    };
    
    return (
        <Box className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50 pt-20 pb-8">
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
                            <section className="container mx-auto px-4 py-10">
                                <nav className="flex mb-8" aria-label="Breadcrumb">
                                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                      <Link href="/" className="text-gray-700 hover:text-trendflow-pink">Home</Link>
                                    </li>
                                    <li>
                                      <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                        <Link 
                                          href={`/${router.query.country}/${router.query.language}/results?query=${encodeURIComponent(currentSearch)}`} 
                                          className="ml-1 text-gray-700 hover:text-trendflow-pink md:ml-2"
                                        >
                                          Results
                                        </Link>
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
                                <div className="flex flex-col lg:flex-row gap-12">
                                    <motion.div 
                                        className="lg:w-1/2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ProductImageGallery images={currentProduct.img_urls} />
                                    </motion.div>
                                    <motion.div 
                                        className="lg:w-1/2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">
                                            {enhanceText(currentProduct?.name)}
                                        </h1>
                                        <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow-md">
                                            <Image
                                                src={logos[currentProduct?.brand?.toLowerCase()]}
                                                alt={currentProduct?.brand}
                                                width={100}
                                                height={40}
                                                objectFit="contain"
                                            />
                                            <span className="ml-4 text-lg font-semibold">{currentProduct?.brand}</span>
                                        </div>
                                        <motion.div 
                                            className="bg-white p-6 rounded-lg shadow-md mb-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                        >
                                            {currentProduct.sale ? (
                                                <div className="flex items-center">
                                                    <span className="text-3xl font-bold text-purple-600 mr-2">{`€ ${currentProduct.price}`}</span>
                                                    <span className="text-lg line-through text-gray-500">{`€ ${currentProduct.old_price}`}</span>
                                                    <span className="ml-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">{`${parseInt(currentProduct.discount_rate*100)}% OFF`}</span>
                                                </div>
                                            ) : (
                                                <span className="text-3xl font-bold text-purple-600">{currentProduct.price !== 0 ? `€ ${currentProduct.price}` : enhanceText(translations?.results?.no_price)}</span>
                                            )}
                                        </motion.div>
                                        <motion.div 
                                            className="bg-white p-6 rounded-lg shadow-md mb-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">{translations?.exploreSection?.highlights}</h2>
                                            <div className="grid grid-cols-2 gap-4">
                                                {currentProduct.material && (
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <span className="font-medium text-purple-600">{translations?.exploreSection?.material}: </span>
                                                        {enhanceText(currentProduct.material)}
                                                    </div>
                                                )}
                                                {currentProduct.color && (
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <span className="font-medium text-purple-600">{translations?.exploreSection?.color}: </span>
                                                        {enhanceText(currentProduct.color)}
                                                    </div>
                                                )}
                                                {currentProduct.style && (
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <span className="font-medium text-purple-600">{translations?.exploreSection?.style}: </span>
                                                        {enhanceText(currentProduct.style)}
                                                    </div>
                                                )}
                                                {currentProduct.occasion && (
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <span className="font-medium text-purple-600">{translations?.exploreSection?.occasion}: </span>
                                                        {enhanceText(currentProduct.occasion)}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                        {currentProduct?.tags?.length > 0 && (
                                            <motion.div 
                                                className="mb-6"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.8 }}
                                            >
                                                <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">{translations?.exploreSection?.relatedTags}</h2>
                                                <div className="flex flex-wrap">
                                                    {currentProduct.tags?.sort().map((itemTag, indexTag) => (
                                                        <Tooltip key={indexTag} placement="top" arrow={true}>
                                                            <button
                                                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 hover:bg-gray-300 transition-colors duration-200"
                                                                // onClick={() => handleAddTag(dispatch, currentSearch, itemTag)}
                                                            >
                                                                {enhanceText(itemTag)}
                                                            </button>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                        {currentProduct.reviews && (
                                          <motion.div 
                                            className="mb-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1 }}
                                          >
                                            <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">{translations?.exploreSection?.customerReviews}</h2>
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
                                          </motion.div>
                                        )}
                                        <motion.div 
                                            className="mt-8 bg-gradient-to-r from-purple-600 to-emerald-500 p-6 rounded-lg text-white shadow-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.2 }}
                                        >
                                            <h2 className="text-2xl font-bold mb-2">
                                                {enhanceText(translations?.exploreSection?.ctaTitle || 'Ready to make a purchase?')}
                                            </h2>
                                            <p className="mb-4 text-sm">
                                                {enhanceText(translations?.exploreSection?.ctaDescription || 'Visit our partner site to complete your purchase and enjoy this amazing product!')}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <Button
                                                    variant="contained"
                                                    startIcon={<StorefrontIcon />}
                                                    onClick={handleVisitSite}
                                                    className="bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300"
                                                >
                                                    {enhanceText(translations?.exploreSection?.visitPartnerSite || 'Visit Partner Site')}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<ShareIcon />}
                                                    onClick={() => setShareModalOpen(true)}
                                                    className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                                                >
                                                    {enhanceText(translations?.results?.share || 'Share')}
                                                </Button>
                                                <Tooltip title="Save to Wishlist">
                                                    <IconButton
                                                        onClick={(event) => handleAddWishlist(event)}
                                                        className="text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                                                    >
                                                        {wishlist.includes(currentProduct.id_item) ? (
                                                            <Badge badgeContent={<CheckIcon fontSize="small" />} color="success">
                                                                <FavoriteIcon />
                                                            </Badge>
                                                        ) : (
                                                            <BookmarkBorderIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </section>
                            {similarProducts && similarProducts.length > 0 && (
                                <section className="w-full mt-16 mb-12">
                                    <div className="max-w-7xl mx-auto px-4">
                                        <h2 className='text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent'>
                                            {translations?.exploreSection?.similarProducts}
                                        </h2>
                                        <p className="text-gray-600 text-lg mb-8">
                                            {translations?.exploreSection?.similarProductsDescription}
                                        </p>
                                        <ExploreCarousel products={similarProducts} translations={translations} />
                                    </div>
                                </section>
                            )}
                        </>
                    : 
                        <section className="container mx-auto px-4 py-10 text-center">
                            <Typography variant="h4" className="text-gray-600">
                                {translations?.noResults}
                            </Typography>
                        </section>
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

            {currentProduct && (
                <WishlistManager
                    productItem={currentProduct}
                    open={wishlistManagerOpen}
                    onClose={() => setWishlistManagerOpen(false)}
                />
            )}
        </Box>
    )
};

export default Explore;
