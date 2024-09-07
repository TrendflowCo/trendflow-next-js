import { Box } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import BrandFilter from "./BrandFilter";
import { useAppSelector } from "../../redux/hooks";
import { logos } from "../Utils/logos";
import { motion } from "framer-motion";

const brandCategories = {
    'Luxury': ['Miu Miu', 'Balenciaga', 'Alexander McQueen', 'Loewe', 'Moschino'],
    'Streetwear': ['Champion', 'Ksubi', 'Jaded London', 'Stussy', 'The Line by K'],
    'Sustainable': ['The Reformation', 'Organic Basics', 'Everlane', 'Adanola', 'Nodress'],
    'Affordable': ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Bershka']
};

const getBrandCategory = (brand) => {
    for (const [category, brands] of Object.entries(brandCategories)) {
        if (brands.includes(brand)) return category;
    }
    return 'All';
};

const Brands = () => {
    const { translations } = useAppSelector(state => state.region);
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('All');

    const brands = ['H&M', 'Miu Miu', 'Mango', 'FARM Rio', 'Source Unknown',
       'Bobo Choses', 'OTTODISANPIETRO', 'Loewe', 'Mais X Frida',
       '&Other', 'Balenciaga', 'Cotton Citizen', 'Gimaguas',
       'Massimo Dutti', 'Alexander McQueen', 'Ben Sherman', 'Bershka',
       'All Saints', 'Sweet Lemon', 'Zara', 'The Line by K', 'Cos',
       'Disturbia', 'Jaded London', 'Ksubi', 'Uniqlo', 'Miaou',
       'Pull & Bear', 'The Reformation', 'La Coqueta', 'Storets',
       'Moschino', 'Vanessa Mooney', 'Danielle Guizio', 'The Knotty Ones',
       'Organic Basics', 'Souce Unknown', 'Rationalle', 'Champion',
       'Ruve', 'Fait par Foutch', 'Desigual', 'Rouje', 'Hyein Seo',
       'Adanola', 'Second Female', 'Nodress', 'Henne', 'Amlul',
       'Lavish Alice', 'Stradivarius', 'With Jean', 'Trois', 'Geel',
       'Kitteny', 'My Mum Made It', 'The Bekk', 'Feners', 'Mode Mischief'];

    const filteredBrands = useMemo(() => {
        return brands.filter((brand) => 
            (brand.toLowerCase().includes(filter.toLowerCase()) ||
            brand.includes(filter)) &&
            (category === 'All' || getBrandCategory(brand) === category)
        ).sort((a, b) => a.localeCompare(b));
    }, [brands, filter, category]);

    const handleBrandClick = (brand) => {
        router.push(`/${router.query.country}/${router.query.language}/results?brands=${encodeURIComponent(brand)}`);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', py: '24px', paddingTop: '100px' }}>
            <Head>
                <title>{`TrendFlow - Discover Fashion Brands | ${translations?.brands}`}</title>
                <meta name="description" content="Explore a curated collection of fashion brands. Find your style with TrendFlow's brand directory." />
            </Head>
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white p-8 rounded-lg shadow-lg mb-8 mx-4"
            >
                <h1 className="text-4xl font-bold mb-2">{translations?.brands}</h1>
                <p className="text-xl">Discover and explore your favorite fashion brands</p>
            </motion.div>

            <section className="w-full max-w-7xl mx-auto px-4">
                <BrandFilter setFilter={setFilter} placeholder={translations?.brandsPlaceholder}/>
                
                <div className="flex flex-wrap justify-center gap-2 my-4">
                    {['All', ...Object.keys(brandCategories)].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                category === cat 
                                    ? 'bg-trendflow-pink text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredBrands.map((brand) => (
                        <motion.div
                            key={brand}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => handleBrandClick(brand)}
                        >
                            <Image 
                                src={logos[brand.toLowerCase()] || '/path/to/default/logo.png'}
                                alt={brand}
                                width={100}
                                height={100}
                                objectFit="contain"
                                className="mx-auto"
                            />
                            <p className="text-center mt-2 font-medium">{brand}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </Box>
    );
};

export default Brands;