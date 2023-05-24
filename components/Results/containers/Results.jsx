import React , {useState , useEffect} from "react";
import axios from "axios";
import { endpoints } from "../../../config/endpoints";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from "@mui/material";
import ResultCard from "../ResultCard";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../redux/hooks";
import { setCurrentSearch } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/language"

const Results = () => {
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.language);
    const router = useRouter();
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [searchLimit , setSearchLimit] = useState(20);
    const [currentPage , setCurrentPage] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingFlag(true);
                const querySearch = router.query.id;
                const queryLanguage = router.query.lan;
                dispatch(setCurrentSearch(querySearch)); // write redux variable - avoid refresh
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                const rsp = (await axios.get(`${endpoints('results')}${querySearch}&language=${queryLanguage}&limit=${searchLimit}&page=${currentPage}`)).data;
                console.log("Response: ", rsp);
                console.log(`requested: ${endpoints('results')}${querySearch}&language=${queryLanguage}&limit=${searchLimit}&page=${currentPage}`)
                setProducts(rsp.results);
                setLoadingFlag(false);
            } catch (err) {
                console.error (err);
                setLoadingFlag(false);
            }
        };
        if (router.query.id && router.query.lan) {
            fetchData()
        }
    },[router.query.id , router.query.lan]);
    useEffect(() => { // for a language change into results section
        const querySearch = router.query.id;
        localStorage.setItem('language', language);
        router.push(`/${language}/results/${querySearch}`)
    },[language]);
    return (
        <> 
            { loadingFlag ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            : 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' }}>
                    <h1 className="p-8 text-3xl font-semibold text-dokuso-black">{`Results for ${router.query.id}`}</h1>
                    <Grid container spacing={2} sx={{padding: 2}}>
                        {products.length > 0 && products.map((productItem,productIndex) => {return (
                            <Grid key={productIndex} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                                <ResultCard productItem={productItem}/>
                            </Grid>
                        )})}
                    </Grid>
                </Box>
            }
        </>
    )
};

export default Results;