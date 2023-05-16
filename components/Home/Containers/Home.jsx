import React from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import PopularSearches from '../PopularSearches';
import FashionForward from '../FashionForward';
import FeatureImages from '../FeatureImages';
import SecondaryLogin from '../SecondaryLogin';
import Footer from '../../global/Footer';

const Home = () => {
    return (
      <section>
        <div className='px-4 sm:px-0'>
          <TitleAndImage/>
          <Searcher/>
          <PopularSearches/>
          <FashionForward/>
          <FeatureImages/>
          <SecondaryLogin/>
          {/* <input type="text" className="border-none focus:ring-0"/> */}
        </div>
        <Footer/>
      </section>
    )
};

export default Home;