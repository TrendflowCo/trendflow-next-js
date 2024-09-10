import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';
import { logos } from '../Utils/logos';

const FeaturedBrands = () => {
  const router = useRouter();
  const { translations, country, language } = useAppSelector(state => state.region);
  
  const featuredBrands = ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Bershka', 'The Reformation', 'Balenciaga', 'Alexander McQueen'];

  const handleBrandClick = (brand) => {
    router.push(`/${country}/${language}/results?brands=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">{translations?.featuredBrands || 'Featured Brands'}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {featuredBrands.map((brand) => (
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
    </div>
  );
};

export default FeaturedBrands;