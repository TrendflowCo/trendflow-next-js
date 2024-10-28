import React, { useState, useEffect, useCallback } from 'react';
import { 
  Drawer, IconButton, Typography, Slider, Box, Divider, Grid, ThemeProvider, Tooltip, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/system';
import { logos } from '../Utils/logos';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/hooks';
import { toast } from 'sonner';
import { endpoints, fetchWithAuth } from '../../config/endpoints';

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: 450,
    padding: theme.spacing(3),
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
  },
}));

const CategoryButton = styled(Box)(({ theme, selected }) => ({
  margin: theme.spacing(1),
  borderRadius: 20,
  textTransform: 'capitalize',
  fontWeight: 'bold',
  padding: '8px 16px',
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  backgroundColor: selected ? 'transparent' : 'transparent',
  background: selected ? 'linear-gradient(to right, #9333ea, #10b981)' : 'transparent',
  border: `2px solid ${selected ? 'transparent' : theme.palette.grey[300]}`,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? 'transparent' : theme.palette.grey[100],
    border: `2px solid ${selected ? 'transparent' : theme.palette.grey[400]}`,
  },
}));

const BrandLogoWrapper = styled(Box)(({ theme, selected }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? '3px solid transparent' : '3px solid transparent',
  background: selected ? 'linear-gradient(to right, #9333ea, #10b981)' : 'transparent',
  boxShadow: selected ? '0 0 15px rgba(147, 51, 234, 0.5)' : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 5px 15px rgba(0,0,0,0.1)`,
  },
}));

const SaleChip = styled(Box)(({ theme, selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: 20,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected ? 'linear-gradient(to right, #9333ea, #10b981)' : 'transparent',
  border: `2px solid ${selected ? 'transparent' : theme.palette.grey[300]}`,
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? 'transparent' : theme.palette.grey[100],
  },
}));

const ActionButton = styled(Box)(({ theme, variant }) => ({
  padding: '10px 16px',
  borderRadius: 20,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  ...(variant === 'contained' ? {
    background: 'linear-gradient(to right, #9333ea, #10b981)',
    color: theme.palette.common.white,
    '&:hover': {
      background: 'linear-gradient(to right, #7e22ce, #059669)',
    },
  } : {
    border: '2px solid #9333ea',
    color: '#9333ea',
    '&:hover': {
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
    },
  }),
}));

const Filter = (props) => {
  const { 
    setFilterModal, 
    filterModal, 
    availableBrands = [], 
    currentPriceRange = [0, 1000], 
    translations = {},
    priceHistogramData = [],
    searchTags = [],
    selectedTags,
    setSelectedTags,
    setResetFiltersRef
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { country, language } = useAppSelector(state => state.region);

  const [onSaleChecked, setOnSaleChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(currentPriceRange);

  useEffect(() => {
    setSelectedTags(selectedTags);
  }, [selectedTags, setSelectedTags]);

  const categoryOptions = ['men', 'women', 'kids', 'home', 'gift'];

  const handleSetOnSale = () => {
    setOnSaleChecked(prev => !prev);
  };

  const handleChangeCategory = (category) => {
    setSelectedCategory(prev => prev === category ? '' : category);
  };

  const handleChangeBrands = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleChangePriceRange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleTagSelection = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleApplyFilter = async () => {
    let newQuery = {...router.query};
    if (selectedCategory !== '') {
      newQuery = {...newQuery, category: selectedCategory}
    }
    if (selectedBrands.length > 0) {
      newQuery = {...newQuery, brands: selectedBrands.join(',')}
    }
    if(onSaleChecked) {
      newQuery = {...newQuery, onSale:'true'}
    } else {
      delete newQuery.onSale;
    }
    if (priceRange[0] > currentPriceRange[0]) {
      newQuery = {...newQuery, minPrice: priceRange[0]}
    }
    if (priceRange[1] < currentPriceRange[1]) {
      newQuery = {...newQuery, maxPrice: priceRange[1]}
    }
    if (selectedTags.length > 0) {
      newQuery = {...newQuery, tags: selectedTags.join(',')}
    }
    newQuery = {...newQuery, page: 1}

    // Construct the new path with country and language from the Redux store
    const newPath = `/${country}/${language}/results`;

    router.push({ 
      pathname: newPath,
      query: newQuery 
    });
    setFilterModal(false);
    toast.success(translations?.results?.filters_applied || 'Filters applied successfully!');
  };

  const resetFilters = useCallback(() => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setOnSaleChecked(false);
    setPriceRange(currentPriceRange);
    setSelectedTags([]);
  }, [currentPriceRange, setSelectedCategory, setSelectedBrands, setOnSaleChecked, setPriceRange, setSelectedTags]);

  const deleteFilter = () => {
    resetFilters();
    toast.success(translations?.results?.filters_reset || 'Filters reset successfully!');
    router.push({
      pathname: `/${country}/${language}/results`,
      query: { query: router.query.query }
    });
    setFilterModal(false);
  };

  useEffect(() => {
    setResetFiltersRef(resetFilters);
  }, [setResetFiltersRef, resetFilters]);

  return (
    <ThemeProvider theme={createTheme({
      palette: {
        primary: {
          main: '#9333ea',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#10b981',
        },
      },
    })}>
      <CustomDrawer
        anchor="right"
        open={filterModal}
        onClose={() => setFilterModal(false)}
      >
        <AnimatePresence>
          {filterModal && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" className="bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">
                  {translations?.results?.filters || 'Filters'}
                </Typography>
                <IconButton onClick={() => setFilterModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translations?.results?.section || 'Section'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                  {categoryOptions.map((category) => (
                    <CategoryButton
                      key={category}
                      selected={selectedCategory === category}
                      onClick={() => handleChangeCategory(category)}
                    >
                      {translations?.results?.[category] || category}
                    </CategoryButton>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translations?.results?.brands || 'Brands'}
                </Typography>
                <Grid container spacing={2}>
                  {availableBrands.map((brand) => {
                    const brandName = brand.name || brand;
                    const logoKey = brandName.toLowerCase();
                    const isSelected = selectedBrands.includes(brandName);
                    const logoUrl = logos[logoKey];
                    console.log(`Brand: ${brandName}, Logo URL: ${logoUrl}`); // Debug log
                    return (
                      <Grid item key={brandName}>
                        <Tooltip title={brandName}>
                          <BrandLogoWrapper
                            onClick={() => handleChangeBrands(brandName)}
                            selected={isSelected}
                          >
                            {logoUrl ? (
                              <Image 
                                src={logoUrl} 
                                alt={brandName} 
                                width={60}
                                height={60}
                                objectFit="contain"
                                onError={(e) => {
                                  console.error(`Error loading image for ${brandName}`);
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Typography variant="h5">{brandName.charAt(0)}</Typography>
                            )}
                          </BrandLogoWrapper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translations?.results?.price_range || 'Price Range'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    ${priceRange[0]} - ${priceRange[1]}
                  </Typography>
                  <Tooltip title={onSaleChecked ? "Show all products" : "Show only sale products"}>
                    <SaleChip
                      onClick={handleSetOnSale}
                      selected={onSaleChecked}
                    >
                      <LocalOfferIcon sx={{ mr: 1, color: onSaleChecked ? 'white' : 'inherit', fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={onSaleChecked ? 'white' : 'inherit'}
                      >
                        {translations?.results?.sale || 'SALE'}
                      </Typography>
                    </SaleChip>
                  </Tooltip>
                </Box>
                <Box sx={{ height: 200, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceHistogramData}>
                      <XAxis dataKey="range" />
                      <YAxis hide />
                      <RechartsTooltip
                        formatter={(value, name, props) => [`${value} products`, `$${props.payload.range}`]}
                      />
                      <Bar dataKey="count" fill="#FA39BE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ px: 2, mt: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={handleChangePriceRange}
                    valueLabelDisplay="auto"
                    min={currentPriceRange[0]}
                    max={currentPriceRange[1]}
                    marks={[
                      { value: currentPriceRange[0], label: `$${currentPriceRange[0]}` },
                      { value: currentPriceRange[1], label: `$${currentPriceRange[1]}` },
                    ]}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {translations?.results?.tags || 'Tags'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {searchTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onClick={() => handleTagSelection(tag)}
                      color={selectedTags.includes(tag) ? "primary" : "default"}
                      sx={{
                        borderRadius: '16px',
                        '&:hover': {
                          backgroundColor: theme => selectedTags.includes(tag) ? theme.palette.primary.main : theme.palette.action.hover,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <ActionButton
                  variant="contained"
                  onClick={handleApplyFilter}
                >
                  <FilterAltIcon sx={{ mr: 1 }} />
                  {translations?.results?.apply_filters || 'Apply Filters'}
                </ActionButton>
                <ActionButton
                  variant="outlined"
                  onClick={deleteFilter}
                >
                  {translations?.results?.delete_filters || 'Delete Filters'}
                </ActionButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomDrawer>
    </ThemeProvider>
  );
};

export default Filter;
