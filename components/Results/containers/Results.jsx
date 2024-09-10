import React , {useState , useEffect, useRef, useCallback} from "react";
import axios from "axios";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { logAnalyticsEvent, app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import { Box, Grid, CircularProgress, Fab, styled, Select, MenuItem } from "@mui/material";
import ResultCard from "../ResultCard";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setCurrentSearch , setTotalFilters, setWishlist, setPreviousResults } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/region";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
    const [dimensions, setDimensions] = useState({ width: 0 });
    const [gridLayout, setGridLayout] = useState('default');
    const [priceHistogramData, setPriceHistogramData] = useState([]);
    const [tagSectionVisible, setTagSectionVisible] = useState(true);
    const [sortBy, setSortBy] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

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
            const sortingParams = sortings.sortBy ? `&sortBy=${sortings.sortBy}${sortings.ascending}` : '';
            
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
        const { lan, zone, query } = router.query;
        if (lan) {
          dispatch(setLanguage(lan));
          localStorage.setItem('language', lan.toLowerCase());
          const filters = {
            language: `language=${lan}`,
            country: `&country=${zone}`,
            page: router.query.page ? `&page=${router.query.page}` : '',
            limit: '', // We'll set this dynamically based on the grid layout
            query: query ? `&query=${encodeURIComponent(query)}` : '',
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
          
          // Update lastSearch state with the new query
          setLastSearch(query || '');
          dispatch(setCurrentSearch(query || ''));

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

    const sortOptions = [
      { value: 'relevance', label: 'Relevance' },
      { value: 'price', label: 'Price' },
      // { value: 'date', label: 'Date' },
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
        <div className="container mx-auto px-4 py-8 pt-24">
          {loadingFlag ? (
            <GlobalLoader />
          ) : (
            <>
              {failedSearch ? (
                <section className="flex flex-col items-center justify-center h-64">
                  <h6 className="text-2xl text-gray-600 mb-4">No results found</h6>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </section>
              ) : (
                <>
                  <Head>
                    {lastSearch && <title>{`TrendFlow - ${enhanceText(lastSearch)}`}</title>}
                    {lastSearch && <meta name="description" content={enhanceText(lastSearch)} />}
                    {availableBrands?.length > 0 && <meta name="brands" content={availableBrands.join(' ')} />}
                  </Head>
                  <section className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
                      {enhanceText(router.query.query)}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
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
                    <section className="mb-8 bg-white rounded-xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {tagSectionVisible ? 'Refine Your Search' : 'Search Results'}
                        </h2>
                        <button 
                          onClick={() => setTagSectionVisible(!tagSectionVisible)}
                          className="text-purple-600 hover:text-emerald-500 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                        >
                          {tagSectionVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </button>
                      </div>
                      {tagSectionVisible && (
                        <div className="flex flex-wrap gap-2">
                          {searchTags.sort().map((tag, index) => (
                            <button 
                              key={index}
                              className={`
                                px-4 py-2 rounded-full text-sm font-medium
                                transition-all duration-300 ease-in-out
                                ${selectedTags.includes(tag) 
                                  ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-md transform scale-105' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                              `}
                              onClick={() => handleAddTag(selectedTags, setSelectedTags, tag)}
                            >
                              {enhanceText(tag)}
                            </button>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                  <div className="min-h-screen mb-12">
                    {products?.length > 0 && (
                      <ResultsGrid products={products} gridLayout={gridLayout} />
                    )}
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={fetchMoreData}
                          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
                        >
                          Load More
                          <ExpandMoreIcon className="ml-2" />
                        </button>
                      </div>
                    )}
                    {!hasMore && (
                      <div className="text-center mt-8 text-gray-500">
                        No more products to load
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
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

export default Results;