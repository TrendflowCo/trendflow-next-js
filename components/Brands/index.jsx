import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { endpoints } from "../../config/endpoints";
import GlobalLoader from "../Common/Loaders/GlobalLoader";
import GlobalNotFound from "../Common/NotFound/GlobalNotFound";
import Head from "next/head";
import BrandCard from "./BrandCard";
import BrandFilter from "./BrandFilter";
import { useAppSelector } from "../../redux/hooks";

const Brands = () => {
    const { translations } = useAppSelector(state => state.region)
    const router = useRouter();
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [brands, setBrands] = useState(null);
    const [filter, setFilter] = useState('');
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoadingFlag(true)
                const res = await axios.get(endpoints('brands'));
                const allBrands = res.data;
                setBrands(allBrands.brand_list);
                setLoadingFlag(false)
            } catch(err) {
                setLoadingFlag(false)
                console.error(err)
            }
        };
        if(router.query.lan) {
            fetchBrands()
        }
    },[router])

    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
            { loadingFlag ? 
                <GlobalLoader/>
            :
                <>
                    <Head>
                        <title>{`Dokusō - ${translations?.brands}`}</title>
                        <meta name="description" content='Brands'/>
                    </Head>
                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25 mx-5'>
                            <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{translations?.brands}</h6>
                    </div>
                    <section className="w-full flex flex-auto">
                        {brands ? 
                            <section className="w-3/4 mx-auto p-4">
                                <BrandFilter setFilter={setFilter} placeholder={translations?.brandsPlaceholder}/>
                                <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                                    {[...brands].filter((brand) => brand.toLowerCase().includes(filter.toLowerCase())).sort((a,b) => a.localeCompare(b)).map((item, index) => (
                                        <BrandCard key={index} brand={item}/>
                                    ))}
                                </div>
                            </section>
                        :
                            <GlobalNotFound/>
                        }
                    </section>
                </>
            }
        </Box>
    )
};

export default Brands;