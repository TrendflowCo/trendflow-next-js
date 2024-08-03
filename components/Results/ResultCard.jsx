import React, { useState } from 'react';
import { Card, CardContent, CardActions, IconButton, Typography, Tooltip, Chip, Box, Fade } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search'; // Import the search icon
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
import axios from 'axios'; // Ensure axios is imported
import { endpoints } from '../../config/endpoints';

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
  background: 'linear-gradient(to right, #FA39BE, #FE9D2B)', // TrendFlow gradient
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(to right, #FA39BE, #FE9D2B)', // Keep the same gradient on hover
  },
}));

const ResultCard = ({ productItem, reloadFlag, setReloadFlag, layoutType }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.search);
  const { translations } = useAppSelector(state => state.region);
  const [loadingFav, setLoadingFav] = useState(false);

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

  const handleCopyToClipboard = () => {
    logEvent(analytics, 'select_content', {
      content_type: 'copy_to_clipboard',
      content_id: productItem.shop_link
    });
    navigator.clipboard.writeText(productItem.shop_link);
    // Show success toast
  };

  const handleSearchSimilar = async (productId) => {
    try {
      const response = await axios.get(`${endpoints('similarProducts')}${productId}`);
      const similarProducts = response.data;
      router.push({
        pathname: '/results',
        query: { similarProducts: JSON.stringify(similarProducts) }
      });
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
      // Optionally handle errors, e.g., show an error message
    }
  };

  if (layoutType === 'image-only') {
    return (
      <div className="w-full h-0 pb-[100%] relative overflow-hidden">
        <img
          src={productItem.img_url}
          alt={productItem.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledCard>
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
        </ImageWrapper>
        {layoutType === 'default' && (
          <>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {enhanceText(productItem.name)}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  {productItem.sale ? (
                    <>
                      <Typography variant="body1" color="error" fontWeight="bold">
                        {`${productItem.currency} ${productItem.price}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {`${productItem.currency} ${productItem.old_price}`}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" fontWeight="bold">
                      {productItem.price !== 0 ? `${productItem.currency} ${productItem.price}` : enhanceText(translations?.results?.no_price)}
                    </Typography>
                  )}
                </Box>
                <BrandLogo
                  src={logos[productItem?.brand?.toLowerCase()]}
                  alt={productItem?.brand}
                  width={50}
                  height={50}
                />
              </Box>
            </CardContent>
            <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
              <Tooltip title={enhanceText(translations?.results?.add_to_wishlist)}>
                <IconButton onClick={handleAddWishlist} disabled={loadingFav}>
                  <BookmarkIcon color={wishlist.includes(productItem.id_item) ? "primary" : "action"} />
                </IconButton>
              </Tooltip>
              <Tooltip title={enhanceText(translations?.results?.copy_to_clipboard)}>
                <IconButton onClick={handleCopyToClipboard}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Search similar products">
                <IconButton onClick={() => handleSearchSimilar(productItem.id_item)}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={enhanceText(translations?.results?.visit_site)}>
                <IconButton onClick={handleVisitSite}>
                  <StorefrontIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </>
        )}
      </StyledCard>
    </ThemeProvider>
  );
};

export default ResultCard;