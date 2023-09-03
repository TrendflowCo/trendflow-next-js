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
import { setLanguage } from "../../../redux/features/actions/language";
import SortAndFilter from "./SortAndFilter";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
import Sort from "../Sort";
import { muiColors } from "../../Utils/muiTheme";
import { languageAdapter } from "../functions/languageAdapter";
import { logEvent } from "firebase/analytics";
import Head from "next/head";
import { handleAddTag } from "../../functions/handleAddTag";
 
const Results = () => {
    const db = getFirestore(app);
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.language);
    const { user } = useAppSelector(state => state.auth);
    const { currentSearch } = useAppSelector(state => state.search);

    const router = useRouter();
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [reloadFlag , setReloadFlag] = useState(false);
    const [failedSearch , setFailedSearch] = useState(false);
    //
    const [searchLimit , setSearchLimit] = useState(20); // search limit value
    const [currentPage , setCurrentPage] = useState(1); // current page value
    const [lastPage , setLastPage] = useState(0); // last page value
    const [lastSearch , setLastSearch] = useState(''); // text display of search
    const [totalResults, setTotalResults] = useState(0);
    const [availableBrands , setAvailableBrands] = useState([]);
    const [currentPriceRange , setCurrentPriceRange] = useState([0,10000]);
    const [searchTags , setSearchTags] = useState([]);
    // Filter
    const [filterModal , setFilterModal] = useState(false); // modal controller
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

    useEffect(() => {
        const fetchData = async (lan) => {
            try {
                setFailedSearch(false);
                setLoadingFlag(true);
                setTotalResults(0)
                const queryLanguage = lan;
                const selectedPage = router.query.page;
                let filtersAmount = 0;
                let onSaleQuery = '';
                console.log('router:' , router);
                let querySearch = '';
                if (router.query.query) {
                    querySearch = `&query=${router.query.query}`;
                    dispatch(setCurrentSearch(router.query.query)); // write redux variable - avoid refresh
                    setLastSearch(router.query.query);    
                }
                if (router.query.onSale) {
                    filtersAmount += 1
                    onSaleQuery = '&onSale=true';
                }
                let categoryQuery = '';
                if(router.query.category) {
                    filtersAmount += 1
                    categoryQuery = `&category=${router.query.category}`;
                }
                let brandsQuery ='';
                if(router.query.brands) {
                    filtersAmount += 1
                    brandsQuery = `&brands=${router.query.brands.split('-').join(' ').split('&').join('%26')}`;
                }
                let minPriceQuery = '';
                if(router.query.minPrice) {
                    minPriceQuery = `&minPrice=${router.query.minPrice}`;
                }
                let maxPriceQuery = '';
                if(router.query.maxPrice) {
                    maxPriceQuery = `&maxPrice=${router.query.maxPrice}`;
                }
                let sortByQuery = '';
                if(router.query.sortBy) {
                    sortByQuery = `&sortBy=${router.query.sortBy}`;
                }
                let ascendingQuery = '';
                if(router.query.ascending) {
                    ascendingQuery = `&ascending=${router.query.ascending}`;
                }
                if (selectedPage === undefined) {
                    setCurrentPage(1)
                } else {
                    setCurrentPage(parseInt(selectedPage))
                }
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                localStorage.setItem('language',queryLanguage.toLowerCase());
                const languageQuery = `&language=${languageAdapter(queryLanguage)}`;
                const limitQuery = `limit=${searchLimit}`
                const pageQuery = `&page=${selectedPage !== undefined ? selectedPage : '1'}`;
                const requestURI = `${endpoints('results')}${limitQuery}${pageQuery}${querySearch}${languageQuery}${onSaleQuery}${brandsQuery}${minPriceQuery}${maxPriceQuery}${categoryQuery}${sortByQuery}${ascendingQuery}`
                console.log('request to: ', requestURI)
                const rsp = (await axios.get(requestURI)).data; // get datac
                // console.log('reqiest to: ', endpoints('results'))
                // console.log(requestURI)
                console.log('response: ', rsp)
                setAvailableBrands(rsp.metadata.brands); // sets available brands if its a base request
                if(!router.query.brands && !router.query.category && !router.query.onSale && !router.query.minPrice && !router.query.maxPrice) { // es la busqueda inicial
                    setCurrentPriceRange([rsp.metadata.min_price,rsp.metadata.max_price]); // sets available prices if its a base request
                }
                if(router.query.minPrice && currentPriceRange[0] < router.query.minPrice) {
                    filtersAmount += 1
                }
                if(router.query.maxPrice && currentPriceRange[1] > router.query.maxPrice) {
                    filtersAmount += 1
                }
                setProducts(rsp.results);
                setSearchTags(rsp.metadata?.tags)
                logEvent(analytics, 'page_view', {
                    page_title: 'results',
                });         
                dispatch(setTotalFilters(filtersAmount));
                setLastPage(rsp.total_pages);
                setTotalResults(rsp.total_results);
                setLoadingFlag(false);
            } catch (err) {
                console.error(err);
                setLoadingFlag(false);
                setFailedSearch(true);
            }
        };
        // if (router.query.id !== undefined && router.query.lan !== undefined) {
            console.log('router: ', router)
        if (router.isReady) {
            const { lan } = router.query;
            if(lan) {
                fetchData(lan);
            }
        }
        // re-renders if some query or page changes
    // },[router.isReady]); // eslint-disable-line
    },[user, router.isReady ,  router.query.lan , router.query.query , router.query.onSale , router.query.category , router.query.brands , router.query.minPrice , router.query.maxPrice , router.query.sortBy , router.query.ascending , router.query.page ]); // eslint-disable-line
    // window size manager
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
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            :
                <>
                    {failedSearch ? 
                        <section className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                            <div className='mx-5'>
                                <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{lastSearch ? enhanceText(lastSearch) : ''}</h6>
                                <h6 className="text-sm mt-1">No results for this search</h6>
                            </div>
                            <SortAndFilter 
                                setFilterModal={setFilterModal} 
                                setSortingModal={setSortingModal}
                            />
                        </section>
                    : 
                    <>
                        <Head>
                            {lastSearch && <title>{`Dokusō - ${enhanceText(lastSearch)}`}</title>}
                            {lastSearch && <meta name="description" content={enhanceText(lastSearch)}/>}
                            {availableBrands?.length > 0 && <meta name="brands" content={availableBrands.join(' ')}/>}
                        </Head>
                        <div className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                            <div className='mx-5'>
                                <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{lastSearch ? enhanceText(lastSearch) : ''}</h6>
                                <h6 className="text-sm mt-1">{totalResults > 0 && `Total results: ${totalResults}`}</h6>
                            </div>
                            {/* Buttons for filtering and sorting modal enabling */}
                            <SortAndFilter 
                                setFilterModal={setFilterModal} 
                                setSortingModal={setSortingModal}
                            />
                        </div>
                        {searchTags.length > 0 && <section className='mx-5 mt-6 mb-2'>
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
                                {products.length > 0 && products.map((productItem,productIndex) => {return (
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