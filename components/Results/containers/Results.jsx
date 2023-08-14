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
import { setCurrentSearch , setSearchPage, setTotalFilters, setWishlist } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/language";
import SortAndFilter from "./SortAndFilter";
import { enhanceText } from "../../Utils/enhanceText";
import Filter from "../Filter";
import Sort from "../Sort";
import { muiColors } from "../../Utils/muiTheme";
import { languageAdapter } from "../functions/languageAdapter";
import { logEvent } from "firebase/analytics";
import Head from "next/head";
 
const Results = () => {
    const db = getFirestore(app);
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.language);
    const { user } = useAppSelector(state => state.auth);
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
    // Filter
    const [filterModal , setFilterModal] = useState(false); // modal controller
    // Sorting
    const [sortingModal , setSortingModal] = useState(false); // modal controller
    // device size
    const [dimensions, setDimensions] = React.useState({
        width: window.innerWidth,
    });
    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
        });
    }
    useEffect(() => {
        const fetchData = async (id ,lan) => {
            try {
                setFailedSearch(false);
                setLoadingFlag(true);
                setTotalResults(0)
                const querySearch = id.split('-').join(' ');
                // const querySearch = router.query.id.split('-').join(' ');
                // const queryLanguage = router.query.lan;
                const queryLanguage = lan;
                const selectedPage = router.query.page;
                let filtersAmount = 0;
                let onSaleQuery = '';
                if (router.query.onSale) {
                    filtersAmount += 1
                    onSaleQuery = '&onSale=true';
                }
                let sectionQuery = '';
                if(router.query.section) {
                    filtersAmount += 1
                    sectionQuery = `&section=${router.query.section}`;
                }
                let brandsQuery ='';
                if(router.query.brands) {
                    filtersAmount += 1
                    brandsQuery = `&brands=${router.query.brands.split('-').join(' ')}`;
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
                dispatch(setCurrentSearch(querySearch)); // write redux variable - avoid refresh
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                localStorage.setItem('language',queryLanguage.toLowerCase());
                const languageQuery = `&language=${languageAdapter(queryLanguage)}`;
                const limitQuery = `&limit=${searchLimit}`
                const pageQuery = `&page=${selectedPage !== undefined ? selectedPage : '1'}`
                const requestURI = `${endpoints('results')}${querySearch}${languageQuery}${onSaleQuery}${brandsQuery}${minPriceQuery}${maxPriceQuery}${sectionQuery}${sortByQuery}${ascendingQuery}${limitQuery}${pageQuery}`
                const rsp = (await axios.get(requestURI)).data; // get data
                if(!router.query.brands && !router.query.section && !router.query.onSale && !router.query.minPrice && !router.query.maxPrice) { // es la busqueda inicial
                    setAvailableBrands(rsp.metadata.brands); // sets available brands if its a base request
                    setCurrentPriceRange([rsp.metadata.min_price,rsp.metadata.max_price]); // sets available prices if its a base request
                }
                if(router.query.minPrice && currentPriceRange[0] < router.query.minPrice) {
                    filtersAmount += 1
                }
                if(router.query.maxPrice && currentPriceRange[1] > router.query.maxPrice) {
                    filtersAmount += 1
                }
                setProducts(rsp.results);
                logEvent(analytics, 'page_view', {
                    page_title: 'results',
                });         
                dispatch(setTotalFilters(filtersAmount));
                setLastPage(rsp.total_pages);
                setTotalResults(rsp.total_results);
                setLastSearch(querySearch);    
                setLoadingFlag(false);
            } catch (err) {
                console.error(err);
                setLoadingFlag(false);
                setFailedSearch(true);
            }
        };
        // if (router.query.id !== undefined && router.query.lan !== undefined) {
        if (router.isReady) {
            const { id , lan } = router.query;
            if(id && lan) {
                fetchData(id , lan);
            }
        }
        // re-renders if some query or page changes
    // },[router.isReady]); // eslint-disable-line
    },[user, router.isReady ,  router.query.lan , router.query.id , router.query.onSale , router.query.section , router.query.brands , router.query.minPrice , router.query.maxPrice , router.query.sortBy , router.query.ascending , router.query.page ]); // eslint-disable-line
    // window size manager
    useEffect(() => {
        window.addEventListener("resize", handleResize, false);
    },[])
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