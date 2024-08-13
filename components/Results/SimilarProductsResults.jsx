import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { endpoints } from "../../config/endpoints";
import { Box, Typography, CircularProgress, Grid, Paper, ExpandLessIcon, ExpandMoreIcon } from '@mui/material';
import Image from 'next/image';
import ResultCard from './ResultCard';
import { languageAdapter } from '../Results/functions/languageAdapter';
import { setPreviousResults } from '../../redux/features/actions/search';
import { enhanceText } from '../Utils/enhanceText';
import { toast } from 'sonner';
import Head from 'next/head';
import { logos } from '../Utils/logos';

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

  useEffect(() => {
    const fetchData = async () => {
      if (id && lan) {
        try {
          setLoading(true);
          const languageQuery = `&language=${languageAdapter(lan)}`;
          const currentIdProduct = (await axios.get(`${endpoints('dedicatedProduct')}${id}${languageQuery}`)).data;
          setCurrentProduct(currentIdProduct.result);

          const similars = (await axios.get(`${endpoints('similarProducts')}${id}`)).data;
          setSimilarProducts(similars.results || []);
          setSearchTags(similars.tags || []);
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
        const newSimilars = (await axios.get(`${endpoints('similarProducts')}${id}&page=${nextPage}`)).data;
        if (newSimilars.results && newSimilars.results.length > 0) {
          setSimilarProducts(prev => [...prev, ...newSimilars.results]);
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

  const handleAddTag = useCallback((currentTags, setTags, tag) => {
    setTags(currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    );
  }, []);

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

  if (!currentProduct) {
    return (
      <Box sx={{ padding: 4, paddingTop: '64px' }}>
        <Typography>No product found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, paddingTop: '84px' }}>
      <Head>
        <title>{`TrendFlow - Similar to ${currentProduct.name}`}</title>
        <meta name="description" content={`Products similar to ${currentProduct.name}`} />
      </Head>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4, borderRadius: '12px', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#333', 
                marginRight: 1,
                background: 'linear-gradient(45deg, #FA39BE, #FE9D2B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Similar to
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#333', 
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}>
                {enhanceText(currentProduct.name)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
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
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box
            sx={{
              border: '2px solid #FA39BE',
              borderRadius: '8px',
              padding: 2,
              height: '100%',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <ResultCard
              productItem={currentProduct}
              layoutType="default"
              isCurrentProduct={true}
            />
          </Box>
        </Grid>
        {filteredSimilarProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id_item}>
            <ResultCard
              productItem={product}
              layoutType="default"
              isCurrentProduct={false}
            />
          </Grid>
        ))}
      </Grid>

      {searchTags?.length > 0 && (
        <section className='mx-5 mt-6 mb-4'>
          <div className="flex justify-between items-center mb-3">
            <h6 className='text-black text-xl font-semibold'>
              {tagSectionVisible ? 'Refine Your Search' : 'Search Results'}
            </h6>
            <button 
              onClick={() => setTagSectionVisible(!tagSectionVisible)}
              className="text-trendflow-blue hover:text-trendflow-pink transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              {tagSectionVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          {tagSectionVisible && (
            <>
              <div className="flex flex-row flex-wrap w-full mb-4">
                {searchTags.sort().map((tag, index) => (
                  <button 
                    key={index}
                    className={`
                      px-4 py-2 mb-2 mr-2 rounded-full text-sm font-medium
                      transition-all duration-300 ease-in-out
                      ${selectedTags.includes(tag) 
                        ? 'bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white shadow-md transform scale-105' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                    `}
                    onClick={() => handleAddTag(selectedTags, setSelectedTags, tag)}
                  >
                    {enhanceText(tag)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRefineSearch}
                className="bg-trendflow-blue text-white px-4 py-2 rounded-full hover:bg-trendflow-pink transition-colors duration-300"
              >
                Refine Search
              </button>
            </>
          )}
        </section>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={fetchMoreData}
            className="bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white font-bold py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trendflow-pink"
            style={{
              clipPath: 'polygon(92% 0, 100% 25%, 100% 100%, 8% 100%, 0% 75%, 0 0)',
              backgroundColor: '#3f51b5',
              color: '#ffffff',
              padding: '1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {loadingMore ? 'Loading...' : 'See More'}
          </button>
        </div>
      )}
    </Box>
  );
};

export default SimilarProductsResults;