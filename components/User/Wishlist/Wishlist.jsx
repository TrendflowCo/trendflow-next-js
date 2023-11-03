import React , { useEffect , useState } from "react";
import { app } from "../../../services/firebase";
import { endpoints } from "../../../config/endpoints";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import axios from "axios";
import { useAppDispatch , useAppSelector } from "../../../redux/hooks";
import { setWishlist } from "../../../redux/features/actions/search";
import { setLanguage } from "../../../redux/features/actions/language";
import ResultCard from "../../Results/ResultCard";
import { useRouter } from "next/router";
import { Box, CircularProgress, Grid, Pagination, ThemeProvider } from "@mui/material";
import { muiColors } from "../../Utils/muiTheme";
import { enhanceText } from "../../Utils/enhanceText";
  
const Wishlist = () => {
    const dispatch = useAppDispatch();
    const { wishlist } = useAppSelector(state => state.search);
    const { translations } = useAppSelector(state => state.region);
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    const [lastPage , setLastPage] = useState(0);
    const [currentPage , setCurrentPage] = useState(1);
    const router = useRouter();

    useEffect(() => { // ejemplo basico para traerme los IDs de los items que tengo en mi wishlist - solo lo id
        const fetchData = async () => {
            if (user) {
                try {
                    setLoadingFlag(true);
                    const queryLanguage = router.query.lan;
                    dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"]);
                    dispatch(setWishlist(items)); // set to global state
                    const completeString = items.join(',');
                    const wishlistProducts = await axios.get(`${endpoints('byIds')}${completeString}`);
                    setProducts(wishlistProducts.data.results);
                    setLastPage(wishlistProducts.data.total_pages);
                    setLoadingFlag(false);
                } catch (err) {
                    console.error(err);
                    setLoadingFlag(false);
                }
            }
        };
    fetchData();
    },[router.query.lan , currentPage , user]); // eslint-disable-line
    useEffect(() => { // funcion solo para remover favoritos de la wishlist - sin loader general
        const fetchData = async () => {
            if (user) {
                try {
                    const q = queryfb(collection(db, "wishlist"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const items = newData.map(item => item["img_id"]);
                    dispatch(setWishlist(items)); // set to global state
                    const completeString = items.join(',');
                    const wishlistProducts = await axios.get(`${endpoints('byIds')}${completeString}`);
                    setProducts(wishlistProducts.data.results);
                } catch (err) {
                    console.error(err);
                    setLoadingFlag(false);
                }
            }
        };
    fetchData();
    },[]); // eslint-disable-line

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <> 
            { loadingFlag ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            : 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                        <div className='mx-5'>
                            <h6 className='text-black text-4xl leading-10 font-semibold'>{translations?.wishlist?.title && enhanceText(translations?.wishlist?.title)}</h6>
                        </div>
                    </div>
                    <section>
                        <Grid container spacing={2} sx={{padding: 2}}>
                            {products.length > 0 && products.map((productItem,productIndex) => {return (
                                <Grid key={productIndex} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                                    <ResultCard productItem={productItem}/>
                                </Grid>
                            )})}
                        </Grid>
                    </section>
                    { products.length > 0 && 
                        <div className="flex flex-col w-full items-center py-4">
                            <ThemeProvider theme={muiColors}>
                                <Pagination page={currentPage} count={lastPage} onChange={handleChangePage} color="dokusoOrange" />
                            </ThemeProvider>
                        </div>
                    }
                </Box>
            }
        </>
    )
};

export default Wishlist;