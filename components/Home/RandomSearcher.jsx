import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCurrentSearch } from '../../redux/features/actions/search';
import { handleSearchQuery } from '../functions/handleSearchQuery';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaRandom } from 'react-icons/fa';

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
    <motion.button
      onClick={handleSearchRandom}
      className="group relative overflow-hidden px-8 py-4 bg-white text-teal-500 font-semibold rounded-full border-2 border-teal-500 hover:text-white transition-all duration-300 ease-in-out"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center text-lg">
        <FaRandom className="mr-2" />
        {translations?.randomSearch || 'Surprise Me!'}
      </span>
      <div className="absolute inset-0 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-in-out" />
    </motion.button>
  );
};

export default RandomSearcher;