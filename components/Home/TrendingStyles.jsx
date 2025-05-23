import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCurrentSearch } from '../../redux/features/actions/search';
import { handleSearchQuery } from '../functions/handleSearchQuery';
import { endpoints, fetchWithAuth } from '../../config/endpoints';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ResultCard from '../Results/ResultCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import { app } from "../../services/firebase";
import { toast } from 'sonner';
import WishlistManager from '../User/Wishlist/WishlistManager';

const TrendingStyles = () => {
  const [randomQueries, setRandomQueries] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const { translations, language, country } = useAppSelector(state => state.region);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [wishlistManagerOpen, setWishlistManagerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (translations?.prompts && Object.keys(translations.prompts).length > 0) {
      const allQueries = Object.values(translations.prompts);
      const selectedQueries = [];
      for (let i = 0; i < 3 && allQueries.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * allQueries.length);
        selectedQueries.push(allQueries.splice(randomIndex, 1)[0]);
      }
      setRandomQueries(selectedQueries);
    }
  }, [translations]);

  useEffect(() => {
    const fetchQueryResults = async () => {
      if (randomQueries.length > 0 && language && country) {
        try {
          const results = await Promise.all(
            randomQueries.map(query => 
              fetchWithAuth(`${endpoints('results')}language=${language}&country=${country}&query=${encodeURIComponent(query)}&limit=10`)
            )
          );
          
          const filteredResults = results.map(res => {
            // Check if res.results exists, if not, use an empty array
            const products = res.results || [];
            return products.filter(product => product.brand.toLowerCase() !== 'h&m');
          });
          
          setQueryResults(filteredResults);
        } catch (error) {
          console.error('Error fetching query results:', error);
          // Handle the error appropriately (e.g., set an error state, show a message to the user)
        }
      }
    };

    fetchQueryResults();
  }, [randomQueries, language, country]);

  const handleStyleClick = (query) => {
    dispatch(setCurrentSearch(query));
    handleSearchQuery(country, language, query, 'clickOnTrendingStyle', router);
  };

  const handleAddWishlist = (product) => {
    if (!user) {
      toast.error("You're not logged in");
      return;
    }
    setSelectedProduct(product);
    setWishlistManagerOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      {randomQueries.map((query, index) => (
        <motion.div 
          key={query} 
          className="relative overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-500 opacity-10 rounded-3xl"></div>
          <div className="relative z-10 p-6">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">{query}</h3>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="mb-6"
            >
              {queryResults[index]?.map((product) => (
                <SwiperSlide key={product.id}>
                  <ResultCard
                    productItem={product}
                    layoutType="compact"
                    isCurrentProduct={false}
                    onWishlistClick={() => handleAddWishlist(product)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => handleStyleClick(query)}
              >
                Explore More
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
      {selectedProduct && (
        <WishlistManager
          productItem={selectedProduct}
          open={wishlistManagerOpen}
          onClose={() => {
            setWishlistManagerOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default TrendingStyles;
