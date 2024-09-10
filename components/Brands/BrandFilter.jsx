import React from "react";
import { motion } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';

const BrandFilter = ({ setFilter, placeholder }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 flex flex-col relative"
        >
            <input 
                className="bg-white border-2 border-trendflow-pink rounded-full text-lg tracking-wide outline-none py-3 pr-12 pl-6 w-full text-trendflow-black shadow-md focus:ring-2 focus:ring-trendflow-blue transition duration-300"
                type="text"
                placeholder={placeholder}
                onChange={(e) => {setFilter(e.target.value)}}
            />
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-trendflow-pink" />
        </motion.div>
    )
};

export default BrandFilter;