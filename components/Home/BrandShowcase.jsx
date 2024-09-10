import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';
import { logos } from '../Utils/logos';

const BrandShowcase = () => {
  const { translations, country, language } = useAppSelector(state => state.region);
  const showcaseBrands = ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Bershka'];

  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
        {showcaseBrands.map((brand, index) => (
          <motion.div
            key={brand}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            className="w-40 h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 transition-all duration-300"
          >
            <Image 
              src={logos[brand.toLowerCase()] || '/path/to/default/logo.png'}
              alt={brand}
              width={100}
              height={100}
              objectFit="contain"
            />
          </motion.div>
        ))}
      </div>
      <Link 
        href={`/${country}/${language}/brands`}
        className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        {translations?.viewAllBrands || 'Explore All Brands'}
      </Link>
    </div>
  );
};

export default BrandShowcase;