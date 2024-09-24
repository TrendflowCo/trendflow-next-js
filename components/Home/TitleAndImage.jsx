import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AIStylingAssistant from './AIStylingAssistant';

const TitleAndImage = () => {
  const { translations } = useAppSelector(state => state.region);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const [showAssistant, setShowAssistant] = useState(false);
  const router = useRouter();

  const handleExploreClick = () => {
    setShowAssistant(true);
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between py-20 px-4 md:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="md:w-1/2 z-10 mb-10 md:mb-0">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            {translations?.homeTitle || 'Redefine Your Style with AI'}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            {translations?.homeSubtitle || 'Discover fashion that truly reflects you'}
          </p>
          <motion.button
            onClick={handleExploreClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {translations?.startExploring || 'Start Exploring'}
          </motion.button>
        </div>
        <motion.div className="md:w-1/2 relative" style={{ y }}>
          <div className="relative w-full h-[500px] md:h-[600px]">
            <Image
              src="/ry6e8qgc.png"
              alt="Fashion Collage"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-purple-600 opacity-30 rounded-lg"></div>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 opacity-60 z-0"></div>
      {showAssistant && <AIStylingAssistant onClose={() => setShowAssistant(false)} />}
    </div>
  );
};

export default TitleAndImage;