import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { endpoints, fetchWithAuth } from "../../config/endpoints";
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import Image from 'next/image';
import { languageAdapter } from '../Results/functions/languageAdapter';
import { setPreviousResults } from '../../redux/features/actions/search';
import { enhanceText } from '../Utils/enhanceText';
import { toast } from 'sonner';
import Head from 'next/head';
import { logos } from '../Utils/logos';
import ResultsGrid from './ResultsGrid';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import Filter from './Filter';
import { handleAddTag } from '../functions/handleAddTag';

const SimilarProductsResults = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, lan } = router.query;
  const translations = useSelector(state => state.region.translations);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tagSectionVisible, setTagSectionVisible] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [gridLayout, setGridLayout] = useState('default');
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0 });
  const [availableBrands, setAvailableBrands] = useState([]);
  const [currentPriceRange, setCurrentPriceRange] = useState([0, 10000]);
  const [priceHistogramData, setPriceHistogramData] = useState([]);
  const resetFiltersRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && lan) {
        try {
          setLoading(true);
          const languageQuery = `&language=${languageAdapter(lan)}`;
          const currentIdProductResponse = await fetchWithAuth(`${endpoints('dedicatedProduct')}${id}${languageQuery}`);
          setCurrentProduct(currentIdProductResponse.result);

          const similarsResponse = await fetchWithAuth(`${endpoints('similarProducts')}${id}`);
          setSimilarProducts(similarsResponse.results || []);
          setSearchTags(similarsResponse.tags || []);

          // Extract available brands
          const brands = [...new Set((similarsResponse.results || []).map(product => product.brand))];
          setAvailableBrands(brands);

          // Calculate price range
          const prices = (similarsResponse.results || []).map(product => product.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setCurrentPriceRange([minPrice, maxPrice]);

          // Generate price histogram data
          const histogramData = generatePriceHistogramData(prices, 10); // 10 bins
          setPriceHistogramData(histogramData);

        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, lan]);

  const fetchMoreData = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      try {
        const newSimilarsResponse = await fetchWithAuth(`${endpoints('similarProducts')}${id}&page=${nextPage}`);
        if (newSimilarsResponse.results && newSimilarsResponse.results.length > 0) {
          setSimilarProducts(prev => [...prev, ...newSimilarsResponse.results]);
          setCurrentPage(nextPage);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching more data:', err);
        toast.error('Failed to load more products. Please try again.');
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleRefineSearch = () => {
    const tagsQuery = selectedTags.join(',');
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tags: tagsQuery }
    }).then(() => {
      // Fetch new data with selected tags
      toast.success('Search refined with selected tags.');
    });
  };

  useEffect(() => {
    dispatch(setPreviousResults(similarProducts));
  }, [similarProducts, dispatch]);

  // Filter out the current product from similar products
  const filteredSimilarProducts = similarProducts.filter(
    product => product.id_item !== currentProduct.id_item
  );

  const handleResize = () => {
    setDimensions({width: window.innerWidth});
  }

  useEffect(() => {
    setDimensions({width: window.innerWidth});
    window.addEventListener("resize", handleResize, false);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price', label: 'Price' },
    { value: 'brand', label: 'Brand' },
  ];

  const handleSortChange = (option) => {
    setSortBy(option.value);
    setIsSortMenuOpen(false);
    applySort(option.value, sortDirection);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    applySort(sortBy, newDirection);
  };

  const applySort = (sort, direction) => {
    const newQuery = {
      ...router.query,
      sortBy: sort,
      ascending: direction === 'asc' ? 'true' : 'false',
      page: '1'
    };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  };

  const resetFilters = () => {
    if (resetFiltersRef.current) {
      resetFiltersRef.current();
    }
  };

  const generatePriceHistogramData = (prices, bins) => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const binSize = (max - min) / bins;
    const histogramData = Array(bins).fill(0).map((_, i) => ({
      range: `${(min + i * binSize).toFixed(2)} - ${(min + (i + 1) * binSize).toFixed(2)}`,
      count: 0
    }));

    prices.forEach(price => {
      const binIndex = Math.min(Math.floor((price - min) / binSize), bins - 1);
      histogramData[binIndex].count++;
    });

    return histogramData;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4, paddingTop: '64px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        <Head>
          <title>{`TrendFlow - Similar to ${currentProduct?.name}`}</title>
          <meta name="description" content={`Products similar to ${currentProduct?.name}`} />
        </Head>

        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">
            Similar to {enhanceText(currentProduct?.name)}
          </h1>
          <div className="flex items-center mb-4">
            <Typography variant="body1" sx={{ marginRight: 1, color: '#666' }}>
              from
            </Typography>
            <Image
              src={logos[currentProduct?.brand?.toLowerCase()] || '/path/to/default/logo.png'}
              alt={currentProduct?.brand}
              width={80}
              height={32}
              objectFit="contain"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => setFilterModal(true)}
              className="px-4 py-2 bg-white text-purple-600 rounded-full font-medium text-sm shadow hover:shadow-md transition-all duration-300 flex items-center"
            >
              <FilterListIcon className="mr-2" />
              Filter
            </button>
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="px-4 py-2 bg-white text-emerald-600 rounded-full font-medium text-sm shadow hover:shadow-md transition-all duration-300 flex items-center"
              >
                <SortIcon className="mr-2" />
                {sortBy ? enhanceText(sortOptions.find(o => o.value === sortBy).label) : 'Sort'}
                <KeyboardArrowDownIcon className={`ml-1 transition-transform duration-300 ${isSortMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortMenuOpen && (
                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option)}
                        className={`${
                          sortBy === option.value ? 'bg-emerald-100 text-emerald-900' : 'text-gray-700'
                        } group flex w-full items-center px-4 py-2 text-sm hover:bg-emerald-50 transition-colors duration-300`}
                        role="menuitem"
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span 
                            onClick={(e) => { e.stopPropagation(); toggleSortDirection(); }}
                            className="ml-auto"
                          >
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setGridLayout('default')}
                className={`p-2 rounded-full ${gridLayout === 'default' ? 'bg-white shadow' : ''}`}
              >
                <GridViewIcon />
              </button>
              <button
                onClick={() => setGridLayout('compact')}
                className={`p-2 rounded-full ${gridLayout === 'compact' ? 'bg-white shadow' : ''}`}
              >
                <ViewModuleIcon />
              </button>
              <button
                onClick={() => setGridLayout('image-only')}
                className={`p-2 rounded-full ${gridLayout === 'image-only' ? 'bg-white shadow' : ''}`}
              >
                <ViewCompactIcon />
              </button>
            </div>
          </div>
        </section>

        {searchTags?.length > 0 && (
          <motion.section 
            className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent">
                  {tagSectionVisible ? 'Refine Your Search' : 'Search Results'}
                </h2>
                <Button 
                  onClick={() => setTagSectionVisible(!tagSectionVisible)}
                  className="text-purple-600 hover:text-emerald-500 transition-colors duration-300"
                  startIcon={tagSectionVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {tagSectionVisible ? 'Hide' : 'Show'}
                </Button>
              </div>
              {tagSectionVisible && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {searchTags.sort().map((tag, index) => {
                      const isTagApplied = selectedTags.includes(tag);
                      return (
                        <motion.button 
                          key={index}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium
                            transition-all duration-300 ease-in-out
                            ${isTagApplied
                              ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-md' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                          onClick={() => handleAddTag(selectedTags, setSelectedTags, tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {enhanceText(tag)}
                        </motion.button>
                      );
                    })}
                  </div>
                  <motion.div 
                    className="flex justify-center mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={handleRefineSearch}
                      variant="contained"
                      color="primary"
                      startIcon={<FilterListIcon />}
                      className="
                        bg-gradient-to-r from-purple-600 to-emerald-500
                        text-white font-bold py-3 px-6 rounded-lg
                        shadow-lg hover:shadow-xl transition-all duration-300
                        transform hover:scale-105
                      "
                    >
                      Refine Search {selectedTags.length > 0 && `(${selectedTags.length})`}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        <ResultsGrid 
          products={[currentProduct, ...filteredSimilarProducts]} 
          gridLayout={gridLayout}
          currentProductId={currentProduct?.id_item}
        />

        {hasMore && (
          <div className="flex justify-center mt-8 mb-12">
            <button
              onClick={fetchMoreData}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              {loadingMore ? 'Loading...' : 'See More'}
              <ExpandMoreIcon className="ml-2" />
            </button>
          </div>
        )}

        <Filter 
          setFilterModal={setFilterModal} 
          filterModal={filterModal}
          availableBrands={availableBrands}
          currentPriceRange={currentPriceRange}
          deviceWidth={dimensions.width}
          priceHistogramData={priceHistogramData}
          searchTags={searchTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          setResetFiltersRef={(resetFunc) => {
            resetFiltersRef.current = resetFunc;
          }}
        />
      </div>
    </div>
  );
};

export default SimilarProductsResults;
