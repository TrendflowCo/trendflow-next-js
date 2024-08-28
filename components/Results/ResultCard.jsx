import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, CardActions, IconButton, Typography,
  Tooltip, Box, Select, MenuItem, Button, Popover,
  TextField, Divider, Fade, Zoom, Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { logos } from '../Utils/logos';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setWishlist } from '../../redux/features/actions/search';
import { wishlistChange } from './functions/wishlistChange';
import { logAnalyticsEvent } from "../../services/firebase";
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/poppins';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import { endpoints } from '../../config/endpoints';
import ShareModal from '../Common/ShareModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists, addItemToWishlist, createWishlist } from '../../services/firebase';
import { app } from '../../services/firebase';
import { toast } from 'sonner';
import WishlistManager from '../User/Wishlist/WishlistManager';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '16px',
        },
      },
    },
  },
});

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(250, 57, 190, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(250, 57, 190, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(250, 57, 190, 0);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  paddingTop: '95%',
  overflow: 'hidden',
});

const StyledLazyLoadImage = styled(LazyLoadImage)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const BrandLogo = styled(Image)({
  maxWidth: '100%',
  height: 'auto',
  objectFit: 'contain',
});

const SaleChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing ? theme.spacing(1) : '8px',
  right: theme.spacing ? theme.spacing(1) : '8px',
  background: 'linear-gradient(to right, #FA39BE, #FE9D2B)',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(to right, #FA39BE, #FE9D2B)',
  },
}));

const InfoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '8px',
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
}));

const ProductTitle = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '0.9rem',
  lineHeight: 1.2,
  marginBottom: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const BrandLogoWrapper = styled(Box)({
  position: 'absolute',
  bottom: 8,
  left: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '4px',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '20px',
});

const WishlistButton = styled(IconButton)(({ theme, inWishlist }) => ({
  color: inWishlist ? '#FA39BE' : '#BDBDBD',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: '#FA39BE',
    animation: inWishlist ? `${pulse} 1s infinite` : 'none',
  },
}));

const PopoverContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 280,
  borderRadius: 12,
}));

const ResultCard = ({ productItem, layoutType, isCurrentProduct }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.region);
  const [loadingFav, setLoadingFav] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageUrls = Array.isArray(productItem.img_url) ? productItem.img_url : [productItem.img_url];
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState('');
  const auth = getAuth(app);
  const [userAuth] = useAuthState(auth);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isCreatingNewWishlist, setIsCreatingNewWishlist] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistManagerOpen, setWishlistManagerOpen] = useState(false);

  useEffect(() => {
    if (userAuth) {
      fetchWishlists();
    }
  }, [userAuth]);

  const fetchWishlists = async () => {
    if (userAuth) {
      const userWishlists = await getUserWishlists(userAuth.uid);
      setWishlists(userWishlists);
    }
  };

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    console.log("Opening WishlistManager with productItem:", productItem);
    setWishlistManagerOpen(true);
  };

  const handleCloseWishlistManager = () => {
    setWishlistManagerOpen(false);
  };

  const handleShowSingleCard = () => {
    const withoutSlash = productItem.name.split('/').join('%2F');
    logAnalyticsEvent('clickSingleCard', {
      img_id: productItem.id_item
    });
    router.push(`/${router.query.zone}/${router.query.lan}/results/explore/${withoutSlash.split(' ').join('-')}%20${productItem.id_item}`);
  };

  const handleAddWishlist = async (event) => {
    event.stopPropagation();
    if (user) {
      setLoadingFav(true);
      const response = await wishlistChange(productItem.id_item, user, wishlist);
      if (response === 'added' || response === 'deleted') {
        const newWishlist = response === 'added'
          ? [...wishlist, productItem.id_item]
          : wishlist.filter(item => item !== productItem.id_item);
        dispatch(setWishlist(newWishlist));
      }
      setLoadingFav(false);
    } else {
      logAnalyticsEvent('clickAddToWishlist', {
        img_id: productItem.id
      });
      // Show login prompt
    }
  };

  const handleVisitSite = () => {
    let finalURI = productItem.shop_link;
    if (!finalURI.includes('http://') && !finalURI.includes('https://')) {
      finalURI = `https://${finalURI}`;
    }
    logAnalyticsEvent('select_content', {
      content_type: 'product',
      content_id: finalURI
    });
    window.open(finalURI, '_blank').focus();
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleSearchSimilar = useCallback((itemId) => {
    console.log('handleSearchSimilar called with itemId:', itemId);
    logAnalyticsEvent('search_similar', {
      item_id: itemId
    });
    router.push(`/${router.query.zone}/${router.query.lan}/results/similar/${itemId}`);
  }, [router]);

  const springProps = useSpring({
    transform: wishlistAdded ? 'scale(1.2)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  const shareUrl = `${window.location.origin}/${router.query.zone}/${router.query.lan}/results/explore/${productItem.name.split(' ').join('-')}%20${productItem.id_item}`;
  const shareTitle = `Check out this product: ${productItem.name}`;

  const handleMouseEnter = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  if (layoutType === 'image-only') {
    return (
      <div className="w-full h-0 pb-[100%] relative overflow-hidden" onClick={handleShowSingleCard}>
        <Image
          src={imageUrls[0]}
          alt={productItem.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
    );
  }

  if (layoutType === 'compact') {
    return (
      <ThemeProvider theme={theme}>
        <StyledCard
          sx={isCurrentProduct ? {
            border: '2px solid #FA39BE',
            boxShadow: '0 4px 8px rgba(250, 57, 190, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(250, 57, 190, 0.3)',
            },
          } : {}}
        >
          <ImageWrapper
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <StyledLazyLoadImage
              src={imageUrls[currentImageIndex]}
              alt={productItem.name}
              placeholderSrc="/path/to/placeholder.jpg"
              onClick={handleShowSingleCard}
            />
            {imageUrls.length > 1 && (
              <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex' }}>
                {imageUrls.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      margin: '0 2px',
                    }}
                  />
                ))}
              </Box>
            )}
            {productItem.sale && (
              <SaleChip label={translations?.results?.on_sale.toUpperCase()} />
            )}
            {isCurrentProduct && (
              <Typography
                variant="subtitle2"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: '#FA39BE',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                Current Product
              </Typography>
            )}
            <BrandLogoWrapper>
              <BrandLogo
                src={logos[productItem?.brand?.toLowerCase()] || '/path/to/default/logo.png'}
                alt={productItem?.brand}
                width={36}
                height={18}
              />
            </BrandLogoWrapper>
            <CardActions 
              disableSpacing 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderTopLeftRadius: '12px',
                padding: '4px'
              }}
            >
              <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)}>
                <WishlistButton
                  onClick={handleWishlistClick}
                  disabled={loadingFav}
                  inWishlist={wishlist.includes(productItem.id_item)}
                  component={animated.button}
                  style={springProps}
                >
                  {wishlist.includes(productItem.id_item) ? (
                    <FavoriteIcon />
                  ) : (
                    <BookmarkIcon />
                  )}
                </WishlistButton>
              </Tooltip>
              <Tooltip title={enhanceText(translations?.results?.visit_site)}>
                <IconButton 
                  onClick={handleVisitSite} 
                  sx={{ 
                    color: '#BDBDBD',
                    '&:hover': { color: '#FA39BE' }
                  }}
                >
                  <StorefrontIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </ImageWrapper>
        </StyledCard>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledCard
        component={motion.div}
        whileHover={{ scale: 1.03 }}
        sx={{
          position: 'relative',
          ...(isCurrentProduct && {
            border: '2px solid #FA39BE',
            boxShadow: '0 4px 8px rgba(250, 57, 190, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(250, 57, 190, 0.3)',
            },
          })
        }}
      >
        <ImageWrapper
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <StyledLazyLoadImage
            src={imageUrls[currentImageIndex]}
            alt={productItem.name}
            placeholderSrc="/path/to/placeholder.jpg"
            onClick={handleShowSingleCard}
          />
          {imageUrls.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex' }}>
              {imageUrls.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    margin: '0 2px',
                  }}
                />
              ))}
            </Box>
          )}
          {productItem.sale && (
            <SaleChip label={translations?.results?.on_sale.toUpperCase()} />
          )}
          {isCurrentProduct && (
            <Typography
              variant="subtitle2"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: '#FA39BE',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              Current Product
            </Typography>
          )}
          <InfoOverlay>
            <ProductTitle>
              {enhanceText(productItem.name)}
            </ProductTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <BrandLogo
                src={logos[productItem?.brand?.toLowerCase()] || '/path/to/default/logo.png'}
                alt={productItem?.brand}
                width={50}
                height={20}
              />
              <Typography variant="body2" fontWeight="bold">
                {productItem.price !== 0 
                  ? `${productItem.currency} ${productItem.price}`
                  : enhanceText(translations?.results?.no_price)}
              </Typography>
            </Box>
          </InfoOverlay>
        </ImageWrapper>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between', padding: '8px' }}>
          <Box>
            <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)}>
              <WishlistButton
                onClick={handleWishlistClick}
                disabled={loadingFav}
                inWishlist={wishlist.includes(productItem.id_item)}
                component={animated.button}
                style={springProps}
              >
                {wishlist.includes(productItem.id_item) ? (
                  <FavoriteIcon />
                ) : (
                  <BookmarkIcon />
                )}
              </WishlistButton>
            </Tooltip>
            <Tooltip title={enhanceText(translations?.results?.visit_site)}>
              <IconButton onClick={handleVisitSite}>
                <StorefrontIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title={enhanceText(translations?.results?.search_similar)}>
              <IconButton onClick={() => handleSearchSimilar(productItem.id_item)}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={enhanceText(translations?.results?.share)}>
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
        <Zoom in={wishlistAdded}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              zIndex: 1000,
            }}
          >
            <Typography variant="body2">Added to Wishlist!</Typography>
          </Box>
        </Zoom>
        {shareModalOpen && (
          <ShareModal
            open={shareModalOpen}
            handleClose={() => setShareModalOpen(false)}
            shareUrl={shareUrl}
            title={shareTitle}
          />
        )}
        <WishlistManager
          productItem={productItem}
          open={wishlistManagerOpen}
          onClose={handleCloseWishlistManager}
        />
      </StyledCard>
    </ThemeProvider>
  );
};

export default ResultCard;