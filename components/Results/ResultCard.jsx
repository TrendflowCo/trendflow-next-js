import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, CardActions, IconButton, Typography,
  Tooltip, Box, Zoom
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { logos } from '../Utils/logos';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logAnalyticsEvent } from "../../services/firebase";
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ShareModal from '../Common/ShareModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists } from '../../services/firebase';
import { app } from '../../services/firebase';
import { toast } from 'sonner';
import WishlistManager from '../User/Wishlist/WishlistManager';
import 'react-lazy-load-image-component/src/effects/blur.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9333ea',
    },
    secondary: {
      main: '#10b981',
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
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  paddingTop: '100%',
  overflow: 'hidden',
});

const StyledLazyLoadImage = styled(LazyLoadImage)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const BrandLogo = styled(Image)({
  maxWidth: '100%',
  height: 'auto',
  objectFit: 'contain',
});

const SaleChip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  background: 'linear-gradient(to right, #9333ea, #10b981)',
  color: '#ffffff',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
}));

const InfoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '12px',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  transform: 'translateY(100%)',
  '.MuiCard-root:hover &': {
    transform: 'translateY(0)',
  },
}));

const ProductTitle = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1rem',
  lineHeight: 1.2,
  marginBottom: '8px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const BrandLogoWrapper = styled(Box)({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '24px',
});

const WishlistButton = styled(IconButton)(({ theme, inWishlist }) => ({
  color: inWishlist ? theme.palette.primary.main : theme.palette.grey[400],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
    animation: inWishlist ? `${pulse} 1s infinite` : 'none',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: theme.palette.secondary.main,
    transform: 'scale(1.1)',
  },
}));

const ResultCard = ({ productItem, layoutType, isCurrentProduct }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.region);
  const [loadingFav, setLoadingFav] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageUrls = Array.isArray(productItem.img_urls) ? productItem.img_urls : [productItem.img_urls];
  const [wishlists, setWishlists] = useState([]);
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistManagerOpen, setWishlistManagerOpen] = useState(false);

  const fetchWishlists = useCallback(async () => {
    if (user) {
      const userWishlists = await getUserWishlists(user.uid);
      setWishlists(userWishlists);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchWishlists();
    }
  }, [user, fetchWishlists]);

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    if (user) {
      console.log("Opening WishlistManager with productItem:", productItem);
      setWishlistManagerOpen(true);
    } else if (loading) {
      toast.info("Please wait while we check your login status");
    } else {
      toast.error("Please log in to add items to your wishlist");
    }
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
              // placeholderSrc="/path/to/placeholder.jpg"
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
            <SaleChip>{translations?.results?.on_sale.toUpperCase()}</SaleChip>
          )}
          {isCurrentProduct && (
            <Typography
              variant="subtitle2"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '8px',
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
              width={40}
              height={20}
            />
          </BrandLogoWrapper>
          <InfoOverlay>
            <ProductTitle>
              {enhanceText(productItem.name)}
            </ProductTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: 'primary.main' }}>
                {productItem.price !== 0 
                  ? `€ ${productItem.price}`
                  : enhanceText(translations?.results?.no_price)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {productItem?.brand}
              </Typography>
            </Box>
          </InfoOverlay>
        </ImageWrapper>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between', padding: '12px' }}>
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
              <ActionButton onClick={handleVisitSite}>
                <StorefrontIcon />
              </ActionButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title={enhanceText(translations?.results?.search_similar)}>
              <ActionButton onClick={() => handleSearchSimilar(productItem.id_item)}>
                <SearchIcon />
              </ActionButton>
            </Tooltip>
            <Tooltip title={enhanceText(translations?.results?.share)}>
              <ActionButton onClick={handleShare}>
                <ShareIcon />
              </ActionButton>
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