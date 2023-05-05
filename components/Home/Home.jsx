import React from 'react';
import TitleAndImage from './TitleAndImage';
import Searcher from './Searcher';
import PopularSearches from './PopularSearches';
import FashionForward from './FashionForward';

const Home = () => {
    return (
      <div>
        <TitleAndImage/>
        <Searcher/>
        <PopularSearches/>
        <FashionForward/>
        {/* three images */}
        {/* Join the revolution today... + sign up button */}
      </div>
    )
};

export default Home;