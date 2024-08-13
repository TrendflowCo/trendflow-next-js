import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardActions, IconButton, Typography, Tooltip, Chip, Box, Fade } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/system';
import Image from 'next/image';
import { enhanceText } from '../Utils/enhanceText';
import { logos } from '../Utils/logos';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setWishlist } from '../../redux/features/actions/search';
import { wishlistChange } from './functions/wishlistChange';
import { logEvent } from 'firebase/analytics';
import { analytics } from "../../services/firebase";
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/poppins';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import { endpoints } from '../../config/endpoints';
import ShareModal from '../Common/ShareModal';

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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
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

const ResultCard = ({ productItem, reloadFlag, setReloadFlag, layoutType, isCurrentProduct }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.region);
  const [loadingFav, setLoadingFav] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShowSingleCard = () => {
    const withoutSlash = productItem.name.split('/').join('%2F');
    logEvent(analytics, 'clickSingleCard', {
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
      logEvent(analytics, 'clickAddToWishlist', {
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
    logEvent(analytics, 'select_content', {
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
    logEvent(analytics, 'search_similar', {
      item_id: itemId
    });
    router.push(`/${router.query.zone}/${router.query.lan}/results/similar/${itemId}`);
  }, [router]);

  const shareUrl = `${window.location.origin}/${router.query.zone}/${router.query.lan}/results/explore/${productItem.name.split(' ').join('-')}%20${productItem.id_item}`;
  const shareTitle = `Check out this product: ${productItem.name}`;

  if (layoutType === 'image-only') {
    return (
      <div className="w-full h-0 pb-[100%] relative overflow-hidden" onClick={handleShowSingleCard}>
        <Image
          src={productItem.img_url}
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
          <ImageWrapper>
            <StyledLazyLoadImage
              src={productItem.img_url}
              alt={productItem.name}
              placeholderSrc="/path/to/placeholder.jpg"
              onClick={handleShowSingleCard}
            />
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
                <IconButton 
                  onClick={handleAddWishlist} 
                  disabled={loadingFav} 
                  sx={{ 
                    color: wishlist.includes(productItem.id_item) ? '#FA39BE' : '#BDBDBD',
                    '&:hover': { color: '#FA39BE' }
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
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
        sx={isCurrentProduct ? {
          border: '2px solid #FA39BE',
          boxShadow: '0 4px 8px rgba(250, 57, 190, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(250, 57, 190, 0.3)',
          },
        } : {}}
      >
        <ImageWrapper>
          <StyledLazyLoadImage
            src={productItem.img_url}
            alt={productItem.name}
            placeholderSrc="/path/to/placeholder.jpg"
            onClick={handleShowSingleCard}
          />
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
        {layoutType === 'default' && (
          <CardActions disableSpacing sx={{ marginTop: '4px', padding: '8px' }}>
            <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)}>
              <IconButton onClick={handleAddWishlist} disabled={loadingFav} size="small">
                <BookmarkIcon color={wishlist.includes(productItem.id_item) ? "primary" : "action"} fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={enhanceText(translations?.results?.share)}>
              <IconButton onClick={handleShare} size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Search similar products">
              <IconButton onClick={(e) => { e.preventDefault(); handleSearchSimilar(productItem.id_item); }} size="small">
                <SearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={enhanceText(translations?.results?.visit_site)}>
              <IconButton onClick={handleVisitSite} size="small">
                <StorefrontIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
      </StyledCard>
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        translations={translations}
      />
    </ThemeProvider>
  );
};

export default ResultCard;