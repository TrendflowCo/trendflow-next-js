import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const Searcher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { translations, language, country } = useAppSelector(state => state.region);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            dispatch(setCurrentSearch(searchTerm));
            handleSearchQuery(country, language, searchTerm, 'search', router);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-12">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={translations?.search?.placeholder}
                    className="w-full px-6 py-4 text-lg border-2 border-trendflow-blue rounded-full focus:outline-none focus:ring-2 focus:ring-trendflow-pink placeholder-gray-400 shadow-lg pr-16"
                />
                <motion.button
                    type="submit"
                    className="absolute right-2 top-2 p-3 bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white rounded-full hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaSearch className="text-xl" />
                </motion.button>
            </div>
        </form>
    );
};

export default Searcher;