import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import axios from 'axios';
import { endpoints } from "../../config/endpoints";
import ResultCard from '../Results/ResultCard';
import { useRouter } from 'next/router';
import { setCurrentSearch } from "../../redux/features/actions/search";

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
            axios.get(`${endpoints('results')}language=${language}&country=${country}&query=${encodeURIComponent(query)}&limit=10`)
          )
        );
        setQueryResults(results.map(res => res.data.results));
      }
    };

    fetchQueryResults();
  }, [randomQueries, language, country]);

  const sliderRefs = useRef([]);

  const scroll = (index, direction) => {
    const slider = sliderRefs.current[index];
    const isSmallScreen = window.innerWidth < 768; // Adjust this breakpoint as needed
    const scrollAmount = isSmallScreen ? slider.clientWidth * 0.9 : slider.clientWidth * 0.5;
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const handleSeeMore = (query) => {
    dispatch(setCurrentSearch(query));
    router.push(`/${country}/${language}/results?query=${encodeURIComponent(query)}`);
  };

  if (randomQueries.length === 0 || queryResults.length === 0) {
    return null; // or return a loading indicator
  }

  return (
    <div className="w-full mt-5">
      <h2 className="text-3xl font-semibold mb-4 text-center">Trending Searches</h2>

      {randomQueries.map((query, index) => (
        <div key={query} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{query}</h2>
            <button 
              onClick={() => handleSeeMore(query)}
              className="text-trendflow-blue hover:text-trendflow-pink transition-colors duration-300 flex items-center"
            >
              See More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full z-10 sm:block hidden"
              onClick={() => scroll(index, index % 2 === 0 ? -1 : 1)}
            >
              &#8592;
            </button>
            <div 
              ref={el => sliderRefs.current[index] = el}
              className={`overflow-x-auto sm:overflow-hidden ${index % 2 === 0 ? 'slider-rtl' : 'slider-ltr'}`}
            >
              <div className="flex animate-scroll">
                {[...queryResults[index], ...queryResults[index]].map((product, productIndex) => (
                  <div key={`${product.id_item}-${productIndex}`} className="flex-shrink-0 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2">
                    <ResultCard productItem={product} layoutType="default" />
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full z-10 sm:block hidden"
              onClick={() => scroll(index, index % 2 === 0 ? 1 : -1)}
            >
              &#8594;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RandomQuerySliders;