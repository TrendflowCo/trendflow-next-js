import React , {useState , useEffect} from "react";
import axios from "axios";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { analytics, app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Pagination, ThemeProvider } from "@mui/material";
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
// import { languageAdapter } from "../functions/languageAdapter";
import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { handleAddTag } from "../../functions/handleAddTag";
import { countFilters } from "../../functions/countFilters";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import GlobalLoader from "../../Common/Loaders/GlobalLoader";
import Searcher from "../../Home/Searcher";
 
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
    const [lastPage , setLastPage] = useState(0); // last page value
    const [totalResults, setTotalResults] = useState(0);
    const [availableBrands , setAvailableBrands] = useState([]);
    const [currentPriceRange , setCurrentPriceRange] = useState([0,10000]);
    const [searchTags , setSearchTags] = useState([]);
    const [filteredBrand , setFilteredBrand] = useState('');
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
    const fetchDataToAPI = async(filters,sortings) => {
        try {
            setFailedSearch(false);
            setLoadingFlag(true);
            setTotalResults(0);
            const requestURI = `${endpoints('results')}${Object.values(filters).join('')}${Object.values(sortings).join('')}`;
            console.log('request to API: ', requestURI)
            const rsp = (await axios.get(requestURI)).data; // get data
            setLastSearch(router.query.query ? router.query.query : '');
            dispatch(setCurrentSearch(router.query.query ? router.query.query : ''));
            setFilteredBrand(router.query.brands ? router.query.brands : '')
            setProducts(rsp?.results);
            setSearchTags(rsp?.metadata?.tags)
            setTotalResults(rsp?.total_results);
            setCurrentPage(router.query.page ? parseInt(router.query.page) : 1)
            setLastPage(rsp?.total_pages);
            setAvailableBrands(rsp?.metadata?.brands || []); // sets available brands if its a base request
            if (filters.maxPrice === '' && filters.minPrice === '') {
                setCurrentPriceRange([rsp?.metadata?.min_price, rsp?.metadata?.max_price]); // sets available prices if its a base request
            }
            logEvent(analytics, 'page_view', {
                page_title: 'results',
            });         
            setLoadingFlag(false);    
        } catch(err) {
            console.error(err);
            setLoadingFlag(false);
            setFailedSearch(true);
        }
    };
    useEffect(() => {
        if (router.isReady) {
            const { lan , zone } = router.query;
            if(lan) {
                dispatch(setLanguage(lan)); // write redux variable - avoid refresh
                localStorage.setItem('language',lan.toLowerCase());
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
                setCurrentFilters(filters); // set the current filters
                const sortings = {
                    sortBy: router.query.sortBy ? `&sortBy=${router.query.sortBy}` : '', // price, category
                    ascending: router.query.ascending ? `&ascending=${router.query.ascending}` : '', // default false
                };
                fetchDataToAPI(filters,sortings);
                dispatch(setTotalFilters(countFilters(filters)));
            }
        }
    },[user, router.isReady ,  router.query.lan , router.query.zone , router.query.query , router.query.onSale , router.query.category , router.query.brands , router.query.minPrice , router.query.maxPrice , router.query.sortBy , router.query.ascending , router.query.page ]); // eslint-disable-line
    
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
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
            {/* Filter component */}
            <Filter 
                setFilterModal={setFilterModal} 
                filterModal={filterModal}
                availableBrands={availableBrands}
                currentPriceRange={currentPriceRange}
                deviceWidth={dimensions.width}
            />
            {/* Sorting component */}
            <Sort 
                sortingModal={sortingModal}
                setSortingModal={setSortingModal}
                deviceWidth={dimensions.width}
            />
            { loadingFlag ? 
                <GlobalLoader/>
            :
                <>
                    {failedSearch ? 
                        <section className="flex flex-col w-full mt-25 mb-2">
                            <section className='flex flex-col lg:flex-row lg:justify-between'>
                                <div className='mx-5'>
                                    <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{currentSearch ? enhanceText(currentSearch) : ''}</h6>
                                    <h6 className="text-sm mt-1">No results for this search</h6>
                                </div>
                                <SortAndFilter 
                                    setFilterModal={setFilterModal} 
                                    setSortingModal={setSortingModal}
                                    />
                            </section>
                            <Searcher/>
                        </section>
                    : 
                    <>
                        <Head>
                            {lastSearch && <title>{`Dokusō - ${enhanceText(lastSearch)}`}</title>}
                            {lastSearch && <meta name="description" content={enhanceText(lastSearch)}/>}
                            {availableBrands?.length > 0 && <meta name="brands" content={availableBrands.join(' ')}/>}
                        </Head>
                        <section className="flex flex-col w-full mt-25 mb-2">
                            <div className='flex flex-col lg:flex-row lg:justify-between '>
                                <div className='mx-5'>
                                    { lastSearch && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{ enhanceText(lastSearch) }</h6> }
                                    { filteredBrand && <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold mt-2'>{ enhanceText(filteredBrand) }</h6> }
                                    <h6 className="text-sm mt-1">{totalResults > 0 && `Total results: ${totalResults}`}</h6>
                                </div>
                                <SortAndFilter 
                                    setFilterModal={setFilterModal} 
                                    setSortingModal={setSortingModal}
                                    />
                            </div>
                            <Searcher/>
                        </section>
                        {searchTags?.length > 0 && <section className='mx-5 mt-6 mb-2'>
                            <div className="flex flex-row h-fit flex-wrap w-full">
                            {searchTags.sort().map((tag,index) => <div 
                                className="flex flex-col items-center justify-center px-4 py-2 mb-2 mx-1 first:ml-0 last:mr-0 w-fit bg-dokuso-black text-dokuso-white rounded-full cursor-pointer hover:bg-gradient-to-tl hover:from-dokuso-pink hover:to-dokuso-blue" 
                                key={index}
                                onClick={()=> {handleAddTag( dispatch , currentSearch , tag )}}
                                >{enhanceText(tag)}</div>)}
                            </div>
                        </section>}
                        <section>
                            <Grid container spacing={2} sx={{padding: 2}}>
                                {products?.length > 0 && products.map((productItem,productIndex) => {return (
                                    <Grid key={productIndex} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                                        <ResultCard productItem={productItem} reloadFlag={reloadFlag} setReloadFlag={setReloadFlag}/>
                                    </Grid>
                                )})}
                            </Grid>
                        </section>
                        <div className="flex flex-col w-full items-center py-4">
                            <ThemeProvider theme={muiColors}>
                                <Pagination page={currentPage} count={lastPage} onChange={handleChangePage} color="dokusoOrange" />
                            </ThemeProvider>
                        </div>
                    </>
                    }
                </>
            }
        </Box>
    )
};

export default Results;