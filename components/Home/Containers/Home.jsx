import React, { useEffect } from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import FashionForward from '../FashionForward';
import FeatureImages from '../FeatureImages';
import SecondaryLogin from '../SecondaryLogin';
import Footer from '../../global/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../services/firebase';

const Home = () => {
  useEffect(() =>{
    logEvent(analytics, 'page_view', {
      page_title: 'home',
    });
  },[])
    return (
      <section>
        <div className='px-4 sm:px-0'>
          <TitleAndImage/>
          <Searcher/>
          <FashionForward/>
          <FeatureImages/>
          <SecondaryLogin/>
        </div>
        <Footer/>
      </section>
    )
};

export default Home;