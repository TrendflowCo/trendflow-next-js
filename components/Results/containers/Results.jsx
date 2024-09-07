import React , {useState , useEffect, useRef, useCallback} from "react";
import axios from "axios";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { logAnalyticsEvent, app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import { Box, Grid, CircularProgress, Fab, styled } from "@mui/material";
import ResultCard from "../ResultCard";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setCurrentSearch , setTotalFilters, setWishlist, setPreviousResults } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/region";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
import Sort from "../Sort";
import { muiColors } from "../../Utils/muiTheme";
import Head from "next/head";
import { handleAddTag } from "../../functions/handleAddTag";
import { countFilters } from "../../functions/countFilters";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import GlobalLoader from "../../Common/Loaders/GlobalLoader";
import { toast } from "sonner"; // Import toast from sonner
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ResultsGrid from '../ResultsGrid';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: '#3f51b5', // A more subtle blue color
  color: '#9966CC',
  padding: '1rem',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#303f9f', // Slightly darker shade for hover state
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
  },
}));

const Results = () => {
    const db = getFirestore(app);
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.region);
    const auth = getAuth(app);
    const [user, loading] = useAuthState(auth);

    const { currentSearch } = useAppSelector(state => state.search);
    const router = useRouter();
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [reloadFlag , setReloadFlag] = useState(false);
    const [failedSearch , setFailedSearch] = useState(false);
    const [lastSearch , setLastSearch] = useState('')
    const [currentPage , setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [availableBrands , setAvailableBrands] = useState([]);
    const [currentPriceRange , setCurrentPriceRange] = useState([0,10000]);
    const [searchTags , setSearchTags] = useState([]);
    const [filteredBrand , setFilteredBrand] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentSortings, setCurrentSortings] = useState({});
    const [filterModal , setFilterModal] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({});
    const [sortingModal , setSortingModal] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0 });
    const [gridLayout, setGridLayout] = useState('default');
    const [priceHistogramData, setPriceHistogramData] = useState([]);
    const [tagSectionVisible, setTagSectionVisible] = useState(true);

    const resetFiltersRef = useRef(null);

    const resetFilters = () => {
      if (resetFiltersRef.current) {
        resetFiltersRef.current();
      }
    };

    const handleResize = () => {
        setDimensions({width: window.innerWidth});
    }
    useEffect(() => {
        setDimensions({width: window.innerWidth});
        window.addEventListener("resize", handleResize, false);
    },[])
    const fetchDataToAPI = useCallback(async (filters, sortings, page = 1, limit = 20) => {
        try {
            setFailedSearch(false);
            setLoadingFlag(true);
            setTotalResults(0);

            const tags = selectedTags.length > 0 ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : '';
            const sortingParams = sortings.sortBy ? `&sortBy=${sortings.sortBy}&ascending=${sortings.ascending}` : '';
            
            let fetchedProducts = [];
            let currentPage = page;
            let metadata = null;

            while (fetchedProducts.length < limit) {
                const requestURI = `${endpoints('results')}${Object.values(filters).join('')}${sortingParams}${tags}&limit=${limit * 2}&page=${currentPage}`;
                const response = await axios.get(requestURI);
                const rsp = response.data;
                
                // Store metadata from the first response
                if (!metadata) {
                    metadata = rsp.metadata;
                }
                
                // Filter out H&M products
                const filteredBatch = rsp?.results?.filter(product => product.brand.toLowerCase() !== 'h&m') || [];
                fetchedProducts = [...fetchedProducts, ...filteredBatch];
                
                if (rsp?.results?.length < limit * 2 || currentPage > 5) break; // Prevent infinite loop
                currentPage++;
            }

            fetchedProducts = fetchedProducts.slice(0, limit); // Ensure we only have 'limit' number of products

            setLastSearch(router.query.query ? router.query.query : '');
            dispatch(setCurrentSearch(router.query.query ? router.query.query : ''));
            setFilteredBrand(router.query.brands ? router.query.brands : '');
            setSearchTags(metadata?.tags);
            
            setTotalResults(fetchedProducts.length);
            setAvailableBrands(metadata?.brands?.filter(brand => brand.toLowerCase() !== 'h&m') || []);
            if (filters.maxPrice === '' && filters.minPrice === '') {
                setCurrentPriceRange([metadata?.min_price, metadata?.max_price]);
            }
            logAnalyticsEvent('page_view', {
                page_title: 'results',
            });
            setProducts(fetchedProducts);
            setLoadingFlag(false);
        } catch (err) {
            console.error(err);
            setLoadingFlag(false);
            setFailedSearch(true);
        }
    }, []);
    useEffect(() => {
      if (router.isReady) {
        const { lan, zone } = router.query;
        if (lan) {
          dispatch(setLanguage(lan));
          localStorage.setItem('language', lan.toLowerCase());
          const filters = {
            language: `language=${lan}`,
            country: `&country=${zone}`,
            page: router.query.page ? `&page=${router.query.page}` : '',
            limit: '', // We'll set this dynamically based on the grid layout
            query: router.query.query ? `&query=${encodeURIComponent(router.query.query)}` : '',
            imageUrl: router.query.imageUrl ? `&imageUrl=${router.query.imageUrl}` : '',
            brands: router.query.brands ? `&brands=${encodeURIComponent(router.query.brands)}` : '',
            category: router.query.category ? `&category=${router.query.category}` : '',
            minPrice: router.query.minPrice ? `&minPrice=${router.query.minPrice}` : '',
            maxPrice: router.query.maxPrice ? `&maxPrice=${router.query.maxPrice}` : '',
            onSale: router.query.onSale ? `&onSale=${router.query.onSale}` : '',
            tags: router.query.tags ? `&tags=${encodeURIComponent(router.query.tags)}` : '',
          }
          setCurrentFilters(filters);
          const sortings = {
            sortBy: router.query.sortBy ? `&sortBy=${router.query.sortBy}` : '',
            ascending: router.query.ascending ? `&ascending=${router.query.ascending}` : '',
          };
          setCurrentSortings(sortings);

          let limit = 20;
          if (gridLayout === 'compact') {
            limit = 48;
          } else if (gridLayout === 'image-only') {
            limit = 144;
          }

          fetchDataToAPI(filters, sortings, 1, limit);
          dispatch(setTotalFilters(countFilters(filters)));
          
          // Set selected tags based on the URL
          if (router.query.tags) {
            setSelectedTags(router.query.tags.split(','));
          } else {
            setSelectedTags([]);
          }
        }
      }
    }, [user, router.isReady, router.query, gridLayout, dispatch, fetchDataToAPI]);

    useEffect(() => {
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setSelectedTags([]);
                setCurrentPage(1);
                setProducts([]); // Clear previous results when the query changes
                setTagSectionVisible(true); // Reset tag section visibility when the query changes
            }
        }
    }, [router.query, router.isReady]);

    useEffect(() => { // Reset selected tags when the query changes
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setSelectedTags([]); // Reset selected tags when the query changes
            }
        }
    }, [router.query, router.isReady]); // Add other dependencies as needed

    useEffect(() => { // Reset currentPage when the query changes
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setCurrentPage(1); // Reset currentPage when the query changes
            }
        }
    }, [router.query, router.isReady]); // Add other dependencies as needed

    useEffect(() => { // wishlist search
        const fetchData = async () => {
            if (user) {
                try {
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"])
                    dispatch(setWishlist(items)); // set to global state
                } catch (err) {
                    console.error(err);
                }
            }
        };
    fetchData();
    }, [user , reloadFlag]) // eslint-disable-line

    const handleChangePage = (event, newPage) => {
        let newQuery = {...router.query};
        newQuery = {...newQuery, page: newPage}
        router.push({ href: "./", query: newQuery })
    };

    const handleRefineSearch = () => {
        const tagsQuery = selectedTags.join(',');
        const newQuery = { ...router.query, tags: tagsQuery };
        router.push({
            pathname: `./results`,
            query: newQuery
        }).then(() => {
            fetchDataToAPI(currentFilters, currentSortings); // Assuming currentFilters and currentSortings are up to date
            toast.success('Search refined with selected tags.'); // Show toast notification
        });
    };

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchMoreData = async () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            let limit = 20;
            if (gridLayout === 'compact') {
                limit = 48;
            } else if (gridLayout === 'image-only') {
                limit = 144;
            }
            const updatedFilters = {
                ...currentFilters,
                page: `&page=${nextPage}`,
                limit: `&limit=${limit * 2}` // Fetch double to ensure we have enough after filtering
            };

            try {
                let fetchedProducts = [];
                let currentFetchPage = nextPage;

                while (fetchedProducts.length < limit) {
                    const rsp = await axios.get(`${endpoints('results')}${Object.values(updatedFilters).join('')}${currentSortings.sortBy ? `&sortBy=${currentSortings.sortBy}&ascending=${currentSortings.ascending}` : ''}${selectedTags.length > 0 ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : ''}`);
                    
                    // Filter out H&M products
                    const filteredBatch = rsp.data?.results?.filter(product => product.brand.toLowerCase() !== 'h&m') || [];
                    fetchedProducts = [...fetchedProducts, ...filteredBatch];
                    
                    if (rsp.data?.results?.length < limit * 2 || currentFetchPage > nextPage + 5) break; // Prevent infinite loop
                    currentFetchPage++;
                    updatedFilters.page = `&page=${currentFetchPage}`;
                }

                fetchedProducts = fetchedProducts.slice(0, limit); // Ensure we only have 'limit' number of products

                if (fetchedProducts.length > 0) {
                    setProducts(prevProducts => [...prevProducts, ...fetchedProducts]);
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

    useEffect(() => {
        console.log('Products state updated:', products.length);
        console.log('Total results:', totalResults);
        // Store the results in Redux
        dispatch(setPreviousResults(products));
        // Calculate and set price histogram data
        setPriceHistogramData(calculatePriceHistogram(products));
    }, [products, totalResults, dispatch]);

    const MemoizedResultCard = React.memo(ResultCard);

    // Add this state to control rendering
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
      if (router.query.similarProducts) {
        const similarProducts = JSON.parse(decodeURIComponent(router.query.similarProducts));
        setProducts(similarProducts);
        setTotalResults(similarProducts.length);
        // You might want to update other states or perform additional actions here
      } else {
        // Existing code to fetch products based on other criteria
      }
    }, [router.query]);

    const getGridItemProps = () => {
        switch (gridLayout) {
            case 'compact':
                return { xs: 6, sm: 4, md: 3, lg: 2, xl: 2, spacing: 1 };
            case 'image-only':
                return { xs: 4, sm: 3, md: 2, lg: 1, xl: 1, spacing: 0 };
            default:
                return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4, spacing: 2 };
        }
    };

    const gridItemProps = getGridItemProps();

    const calculatePriceHistogram = (products, bins = 10) => {
      if (products.length === 0) return [];

      const prices = products.map(product => product.price).filter(price => typeof price === 'number' && price > 0);
      if (prices.length === 0) return [];

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      // Handle the case where all prices are the same
      if (minPrice === maxPrice) {
        return [{ range: `${minPrice}-${maxPrice}`, count: prices.length }];
      }

      const binWidth = (maxPrice - minPrice) / bins;

      const histogram = Array(bins).fill(0).map((_, index) => ({
        range: `${Math.round(minPrice + index * binWidth)}-${Math.round(minPrice + (index + 1) * binWidth)}`,
        count: 0
      }));

      prices.forEach(price => {
        const binIndex = Math.min(Math.floor((price - minPrice) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < histogram.length) {
          histogram[binIndex].count++;
        }
      });

      // Remove empty bins
      return histogram.filter(bin => bin.count > 0);
    };

    useEffect(() => {
      if (router.isReady && router.query.query) {
        resetFilters();
        // ... perform search ...
      }
    }, [router.query.query]);

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', py: '24px', pb: '48px', mt: '64px' }}>
            { loadingFlag ? 
                <GlobalLoader/>
            :
                <>
                    {failedSearch ? 
                        <section className="flex flex-col w-full mt-25 mb-2">
                            <h6 className="text-sm mt-1">No results for this search</h6>
                        </section>
                    : 
                    <>
                        {isClient && (
                            <Head>
                                {lastSearch && <title>{`TrendFlow - ${enhanceText(lastSearch)}`}</title>}
                                {lastSearch && <meta name="description" content={enhanceText(lastSearch)}/>}
                                {availableBrands?.length > 0 && <meta name="brands" content={availableBrands.join(' ')}/>}
                            </Head>
                        )}
                        <section className="flex flex-col w-full mt-4 mb-2">
                            <div className='mx-5'>
                                { lastSearch && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{ enhanceText(lastSearch) }</h6> }
                                { filteredBrand && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold mt-2'>{ enhanceText(filteredBrand) }</h6> }
                            </div>
                        </section>
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
                                <div className="flex justify-center">
                                  <button 
                                    onClick={handleRefineSearch}
                                    className="
                                      bg-gradient-to-r from-trendflow-pink to-trendflow-blue
                                      text-white font-bold py-3 px-6 rounded-lg
                                      shadow-lg hover:shadow-xl transition-all duration-300
                                      transform hover:scale-105
                                      flex items-center justify-center
                                    "
                                  >
                                    <span className="mr-2">
                                      Refine Search {selectedTags.length > 0 && `(${selectedTags.length})`}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </section>
                        )}
                        <div className="flex justify-end mb-4 mr-4">
                            <button
                                onClick={() => setGridLayout('default')}
                                className={`p-2 rounded-l-lg ${gridLayout === 'default' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <GridViewIcon />
                            </button>
                            <button
                                onClick={() => setGridLayout('compact')}
                                className={`p-2 ${gridLayout === 'compact' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <ViewModuleIcon/>
                            </button>
                            <button
                                onClick={() => setGridLayout('image-only')}
                                className={`p-2 rounded-r-lg ${gridLayout === 'image-only' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                <ViewCompactIcon />
                            </button>
                        </div>
                        <div style={{ minHeight: '100vh', marginBottom: '2rem' }}>
                            {products?.length > 0 && (
                              <ResultsGrid products={products} gridLayout={gridLayout} />
                            )}
                            {console.log('Render check - products.length:', products.length, 'totalResults:', totalResults)}
                            {hasMore && (
                                <div className="flex justify-center mt-8 mb-12">
                                    <button
                                        onClick={fetchMoreData}
                                        className="bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white font-bold py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trendflow-pink"
                                        style={{
                                            clipPath: 'polygon(92% 0, 100% 25%, 100% 100%, 8% 100%, 0% 75%, 0 0)',
                                            backgroundColor: '#3f51b5', // A more subtle blue color
                                            color: '#ffffff',
                                            padding: '1rem',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                            transition: 'all 0.3s ease-in-out',
                                        }}
                                    >
                                        {loadingMore ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                See More
                                                <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            )}
                            {!hasMore && (
                                <div className="text-center mt-8 mb-12 text-gray-500">
                                    No more products to load
                                </div>
                            )}
                        </div>
                    </>
                    }
                </>
            }
            <div className="sticky top-0 z-50 bg-white shadow">
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
                <Sort 
                    sortingModal={sortingModal}
                    setSortingModal={setSortingModal}
                    deviceWidth={dimensions.width}
                />
               
            </div>
            <StyledFab
                aria-label="filter"
                onClick={() => setFilterModal(true)}
            >
                <FilterListIcon sx={{ fontSize: '2rem' }} />
            </StyledFab>
        </Box>
    )
};

export default Results;