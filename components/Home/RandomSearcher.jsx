import React from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

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
            <p className="text-lg text-gray-600 mb-4">Spark your fashion journey with a random inspiration!</p>
            <motion.button
                onClick={handleSearchRandom}
                className="mb-8 px-6 py-2 bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span role="img" aria-label="sparkles" className="mr-2">✨</span>
                {translations?.explore || "Surprise Me!"}
            </motion.button>
            {/* <div className="w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4 text-center">Trending Searches</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    {translations?.prompts && Object.entries(translations?.prompts).sort().map(([key, prompt]) => (
                        <motion.button
                            key={`${prompt}${key}`}
                            onClick={() => handleQuickSearch(prompt)}
                            className="px-4 py-2 bg-gray-100 text-trendflow-blue font-medium rounded-full hover:bg-trendflow-pink hover:bg-opacity-20 transition duration-300 ease-in-out"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {prompt}
                        </motion.button>
                    ))}
                </div>
            </div> */}
        </div>
    )
};

export default RandomSearcher;