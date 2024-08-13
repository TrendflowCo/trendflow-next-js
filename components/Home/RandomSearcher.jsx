import React from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaRandom } from "react-icons/fa";

const RandomSearcher = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations, country, language } = useAppSelector(state => state.region);

    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        handleSearchQuery(country, language, val, 'clickOnPopularSearches', router)
    };

    const handleSearchRandom = () => {
        const values = Object.values(translations?.prompts);
        const randomValue = values[Math.floor(Math.random() * values.length)];
        handleQuickSearch(randomValue);
    };

    return (
        <div className="flex flex-col items-center w-full mb-2">
            <motion.button
                onClick={handleSearchRandom}
                className="group relative overflow-hidden px-8 py-3 bg-white text-trendflow-blue font-semibold rounded-full border-2 border-trendflow-blue hover:text-white transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative z-10 flex items-center">
                    <FaRandom className="mr-2" />
                    {translations?.explore || "Inspire Me"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-trendflow-pink to-trendflow-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
            </motion.button>
        </div>
    )
};

export default RandomSearcher;