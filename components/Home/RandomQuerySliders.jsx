import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCurrentSearch } from '../../redux/features/actions/search';
import { handleSearchQuery } from '../functions/handleSearchQuery';
import axios from 'axios';
import { endpoints } from "../../config/endpoints";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RandomQuerySliders = () => {
  const [randomQueries, setRandomQueries] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const { translations, language, country } = useAppSelector(state => state.region);
  const router = useRouter();
  const dispatch = useAppDispatch();

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
        const results = await Promise.all(
          randomQueries.map(query => 
            axios.get(`${endpoints('results')}language=${language}&country=${country}&query=${encodeURIComponent(query)}&limit=20`)
          )
        );
        
        const filteredResults = results.map(res => 
          res.data.results
            .filter(product => product.brand.toLowerCase() !== 'h&m')
            .slice(0, 10)
        );
        
        setQueryResults(filteredResults);
      }
    };

    fetchQueryResults();
  }, [randomQueries, language, country]);

  const handleProductClick = (product) => {
    dispatch(setCurrentSearch(product.name));
    handleSearchQuery(country, language, product.name, 'clickOnRandomQuerySlider', router);
  };

  return (
    <div className="space-y-8">
      {randomQueries.map((query, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4">{query}</h3>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
          >
            {queryResults[index]?.map((product) => (
              <SwiperSlide key={product.id}>
                <div 
                  className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <Image
                    src={product.img_urls[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default RandomQuerySliders;