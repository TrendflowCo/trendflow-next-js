import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Searcher = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { translations } = useAppSelector(state => state.region);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={translations?.searchPlaceholder || "Describe your perfect outfit..."}
          className="w-full py-4 px-6 pr-12 text-lg rounded-full border-2 border-white bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <motion.button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MagnifyingGlassIcon className="w-8 h-8" />
        </motion.button>
      </div>
    </motion.form>
  );
};

export default Searcher;