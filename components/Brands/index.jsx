import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useAppSelector } from "../../redux/hooks";
import { logos } from "../Utils/logos";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';

const brandCategories = {
    'All': [],
    'Luxury': ['Miu Miu', 'Balenciaga', 'Alexander McQueen', 'Loewe', 'Moschino'],
    'Streetwear': ['Champion', 'Ksubi', 'Jaded London', 'Stussy', 'The Line by K'],
    'Sustainable': ['The Reformation', 'Organic Basics', 'Everlane', 'Adanola', 'Nodress'],
    'Affordable': ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Bershka']
};

const Brands = () => {
    const { translations } = useAppSelector(state => state.region);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const brands = [
        'H&M', 'Miu Miu', 'Mango', 'FARM Rio', 'Source Unknown',
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
        'Kitteny', 'My Mum Made It', 'The Bekk', 'Feners', 'Mode Mischief'
    ];

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => 
            brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (activeCategory === 'All' || brandCategories[activeCategory].includes(brand))
        );
    }, [brands, searchTerm, activeCategory]);

    const handleBrandClick = (brand) => {
        router.push(`/${router.query.country}/${router.query.language}/results?brands=${encodeURIComponent(brand)}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50 py-24 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>{`TrendFlow - Discover Fashion Brands | ${translations?.brands}`}</title>
                <meta name="description" content="Explore a curated collection of fashion brands. Find your style with TrendFlow's brand directory." />
            </Head>
            
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-emerald-500 mb-4">
                        {translations?.brands}
                    </h1>
                    <p className="text-xl text-gray-600">Discover and explore your favorite fashion brands</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:outline-none transition-colors duration-300"
                        />
                        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {Object.keys(brandCategories).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeCategory === category 
                                    ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-lg transform scale-105' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    <motion.div 
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {filteredBrands.map((brand) => (
                            <motion.div
                                key={brand}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
                                onClick={() => handleBrandClick(brand)}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        opacity: 1
                                    }
                                }}
                            >
                                <div className="w-24 h-24 relative mb-4">
                                    <Image 
                                        src={logos[brand.toLowerCase()] || '/path/to/default/logo.png'}
                                        alt={brand}
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <p className="text-center font-medium text-gray-800">{brand}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Brands;