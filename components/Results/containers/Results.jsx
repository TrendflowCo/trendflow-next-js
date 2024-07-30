import React , {useState , useEffect} from "react";
import axios from "axios";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { analytics, app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import { Box, Grid, CircularProgress, Fab, styled } from "@mui/material";
import ResultCard from "../ResultCard";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setCurrentSearch , setTotalFilters, setWishlist } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/region";
import SortAndFilter from "./SortAndFilter";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
import Sort from "../Sort";
import { muiColors } from "../../Utils/muiTheme";
import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { handleAddTag } from "../../functions/handleAddTag";
import { countFilters } from "../../functions/countFilters";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import GlobalLoader from "../../Common/Loaders/GlobalLoader";
import { toast } from "sonner"; // Import toast from sonner
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterListIcon from '@mui/icons-material/FilterList';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: '#3f51b5', // A more subtle blue color
  color: '#ffffff',
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
    // const { user } = useAppSelector(state => state.auth);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data

    const { currentSearch } = useAppSelector(state => state.search);
    const router = useRouter();
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [reloadFlag , setReloadFlag] = useState(false);
    const [failedSearch , setFailedSearch] = useState(false);
    //
    const [lastSearch , setLastSearch] = useState('')
    const [currentPage , setCurrentPage] = useState(1); // current page value
    const [totalResults, setTotalResults] = useState(0);
    const [availableBrands , setAvailableBrands] = useState([]);
    const [currentPriceRange , setCurrentPriceRange] = useState([0,10000]);
    const [searchTags , setSearchTags] = useState([]);
    const [filteredBrand , setFilteredBrand] = useState('');
    const [selectedTags, setSelectedTags] = useState([]); // Added state for selected tags
    const [currentSortings, setCurrentSortings] = useState({}); // Added state for current sortings
    // Filter
    const [filterModal , setFilterModal] = useState(false); // modal controller
    const [currentFilters, setCurrentFilters] = useState({});
    // Sorting
    const [sortingModal , setSortingModal] = useState(false); // modal controller
    // device size
    const [dimensions, setDimensions] = useState({
        width: 0,
    });
    const handleResize = () => {
        setDimensions({width: window.innerWidth});
    }
    useEffect(() => {
        setDimensions({width: window.innerWidth});
        window.addEventListener("resize", handleResize, false);
    },[])
    const fetchDataToAPI = async (filters, sortings, page = 1) => {
        try {
            setFailedSearch(false);
            setLoadingFlag(true);
            setTotalResults(0);

            // Ensure tags are included in the API request
            const tags = selectedTags.length > 0 ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : '';
            const sortingParams = sortings.sortBy ? `&sortBy=${sortings.sortBy}&ascending=${sortings.ascending}` : '';
            const requestURI = `${endpoints('results')}${Object.values(filters).join('')}&page=${page}${sortingParams}${tags}`;
            // console.log('request to API: ', requestURI);

            const rsp = (await axios.get(requestURI)).data;
            setLastSearch(router.query.query ? router.query.query : '');
            dispatch(setCurrentSearch(router.query.query ? router.query.query : ''));
            setFilteredBrand(router.query.brands ? router.query.brands : '');
            setSearchTags(rsp?.metadata?.tags);
            setTotalResults(rsp?.total_results);
            // setCurrentPage(router.query.page ? parseInt(router.query.page) : 1);
            setAvailableBrands(rsp?.metadata?.brands || []);
            if (filters.maxPrice === '' && filters.minPrice === '') {
                setCurrentPriceRange([rsp?.metadata?.min_price, rsp?.metadata?.max_price]);
            }
            logEvent(analytics, 'page_view', {
                page_title: 'results',
            });
            setProducts(rsp?.results || []); // Set the products state directly
            setLoadingFlag(false);
        } catch (err) {
            console.error(err);
            setLoadingFlag(false);
            setFailedSearch(true);
        }
    };
    useEffect(() => {
        if (router.isReady) {
            const { lan, zone } = router.query;
            if (lan) {
                dispatch(setLanguage(lan));
                localStorage.setItem('language', lan.toLowerCase());
                const filters = {
                    language: `language=${lan}`,
                    country: `&country=${zone}`,
                    page: router.query.page ? `&page=${router.query.page}` : '&page=1',
                    limit: router.query.limit ? `&limit=${router.query.limit}` : '&limit=20',
                    query: router.query.query ? `&query=${encodeURIComponent(router.query.query)}` : '',
                    imageUrl: router.query.imageUrl ? `&imageUrl=${router.query.imageUrl}` : '',
                    brands: router.query.brands ? `&brands=${encodeURIComponent(router.query.brands)}` : '', // list of brands
                    category: router.query.category ? `&category=${router.query.category}` : '',
                    minPrice: router.query.minPrice ? `&minPrice=${router.query.minPrice}` : '',
                    maxPrice: router.query.maxPrice ? `&maxPrice=${router.query.maxPrice}` : '',
                    onSale: router.query.onSale ? `&onSale=${router.query.onSale}` : '', // si no quiero lo tengo que sacar
                }
                setCurrentFilters(filters);
                const sortings = {
                    sortBy: router.query.sortBy ? `&sortBy=${router.query.sortBy}` : '', // price, category
                    ascending: router.query.ascending ? `&ascending=${router.query.ascending}` : '', // default false
                };
                setCurrentSortings(sortings);
                fetchDataToAPI(filters, sortings);
                dispatch(setTotalFilters(countFilters(filters)));
            }
        }
    }, [user, router.isReady, router.query.lan, router.query.zone, router.query.query, router.query.onSale, router.query.category, router.query.brands, router.query.minPrice, router.query.maxPrice, router.query.sortBy, router.query.ascending, router.query.page]);

    useEffect(() => {
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setSelectedTags([]);
                setCurrentPage(1);
                setProducts([]); // Clear previous results when the query changes
            }
        }
    }, [router.query.query, router.isReady]);

    useEffect(() => { // Reset selected tags when the query changes
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setSelectedTags([]); // Reset selected tags when the query changes
            }
        }
    }, [router.query.query, router.isReady]); // Add other dependencies as needed

    useEffect(() => { // Reset currentPage when the query changes
        if (router.isReady) {
            const { query } = router.query;
            if (query) {
                setCurrentPage(1); // Reset currentPage when the query changes
            }
        }
    }, [router.query.query, router.isReady]); // Add other dependencies as needed

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

    const fetchMoreData = async () => {
        if (!loadingMore) {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const updatedFilters = {
                ...currentFilters,
                page: `&page=${nextPage}`
            };

            try {
                const newProducts = (await axios.get(`${endpoints('results')}${Object.values(updatedFilters).join('')}${currentSortings.sortBy ? `&sortBy=${currentSortings.sortBy}&ascending=${currentSortings.ascending}` : ''}${selectedTags.length > 0 ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : ''}`)).data?.results || [];
                if (newProducts.length > 0) {
                    setProducts(prevProducts => [...prevProducts, ...newProducts]);
                    setCurrentPage(nextPage);
                }
                setLoadingMore(false);
            } catch (err) {
                console.error('Error fetching more data:', err);
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        // console.log('Products state updated:', products);
    }, [products]);

    useEffect(() => {
        const handleScroll = () => {
            // console.log('Scroll event detected');
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                // console.log('Near bottom of page');
                fetchMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // console.log('Current page updated:', currentPage);
    }, [currentPage]);

    const MemoizedResultCard = React.memo(ResultCard);

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', py: '24px' }}>
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
                        <Head>
                            {lastSearch && <title>{`TrendFlow - ${enhanceText(lastSearch)}`}</title>}
                            {lastSearch && <meta name="description" content={enhanceText(lastSearch)}/>}
                            {availableBrands?.length > 0 && <meta name="brands" content={availableBrands.join(' ')}/>}
                        </Head>
                        <section className="flex flex-col w-full mt-25 mb-2">
                            <div className='mx-5'>
                                { lastSearch && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{ enhanceText(lastSearch) }</h6> }
                                { filteredBrand && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold mt-2'>{ enhanceText(filteredBrand) }</h6> }
                            </div>
                        </section>
                        {searchTags?.length > 0 && <section className='mx-5 mt-6 mb-4'>
                            <h6 className='text-black text-xl font-semibold mb-3'>Refine Your Search</h6>
                            <div className="flex flex-row flex-wrap w-full">
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
                        </section>}
                        <div className="flex flex-col w-full items-center py-4">
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
                                <span className="mr-2">Refine Search</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div style={{ minHeight: '100vh' }}>
                            {/* {console.log('Before InfiniteScroll')} */}
                            <InfiniteScroll
                                dataLength={products.length}
                                next={fetchMoreData}
                                hasMore={true}
                                loader={loadingMore ? <GlobalLoader /> : <div />}
                                scrollThreshold="100%"  // This ensures the loader appears only when the bottom is reached
                                scrollableTarget="scrollableDiv"  // Ensures scrolling is confined to this div
                            >
                                {/* {console.log('InfiniteScroll rendered, products length:', products.length)} */}
                                <div id="scrollableDiv" style={{ height: '100vh', overflow: 'auto' }}>
                                    <Grid container spacing={2} sx={{ padding: 2 }}>
                                        {products?.length > 0 &&
                                            products.map((productItem, productIndex) => (
                                                <Grid key={`${productItem.id_item}-${productIndex}`} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                                                    <MemoizedResultCard productItem={productItem} reloadFlag={reloadFlag} setReloadFlag={setReloadFlag} />
                                                </Grid>
                                            ))}
                                    </Grid>
                                </div>
                            </InfiniteScroll>
                            {/* {console.log('After InfiniteScroll')} */}
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