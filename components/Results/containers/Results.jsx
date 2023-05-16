import React , {useState , useEffect} from "react";
import axios from "axios";
import { endpoints } from "../../../config/endpoints";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from "@mui/material";
import ResultCard from "../ResultCard";

const Results = ({ product }) => {
    const [loadingFlag , setLoadingFlag] = useState(false);
    const [products , setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingFlag(true);
                const rsp = (await axios.get(`${endpoints('results')}${product}`)).data;
                console.log(rsp);
                setProducts(rsp);
                setLoadingFlag(false);
            } catch (err) {
                console.error (err);
                setLoadingFlag(false);
            }
        };
        fetchData()
    },[])
    return (
        <> 
            { loadingFlag ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            : 
                <Grid container spacing={2} sx={{padding: 2}}>
                    {products.length > 0 && products.map((productItem,productIndex) => {return (
                        <Grid key={productIndex} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                            <ResultCard productItem={productItem}/>
                        </Grid>
                    )})}
                </Grid>
            }
        </>
    )
};

export default Results;