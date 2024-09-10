import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { translations, language, country } = useAppSelector(state => state.region);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href={`/${country}/${language}`}>
            <Image
              src="/logo_tf.png"
              alt="TrendFlow Logo"
              width={150}
              height={40}
              className="cursor-pointer"
            />
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <NavItem href={`/${country}/${language}`} label={translations?.home || 'Home'} isScrolled={isScrolled} />
              <NavItem href={`/${country}/${language}/brands`} label={translations?.brands || 'Brands'} isScrolled={isScrolled} />
              <NavItem href={`/${country}/${language}/about`} label={translations?.about || 'About'} isScrolled={isScrolled} />
              <NavItem href={`/${country}/${language}/contact`} label={translations?.contact || 'Contact'} isScrolled={isScrolled} />
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

const NavItem = ({ href, label, isScrolled }) => (
  <li>
    <Link href={href}>
      <motion.a
        className={`text-lg font-medium transition-colors duration-300 ${
          isScrolled ? 'text-gray-800 hover:text-emerald-500' : 'text-white hover:text-emerald-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
      </motion.a>
    </Link>
  </li>
);

export default Header;