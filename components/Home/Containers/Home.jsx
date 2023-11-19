import React, { useEffect } from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import FashionForward from '../FashionForward';
import FeatureImages from '../FeatureImages';
import SecondaryLogin from '../SecondaryLogin';
import Footer from '../../global/Footer';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../services/firebase';
import RandomSearcher from '../RandomSearcher';
import ZoneModal from '../ZoneModal';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  useEffect(() =>{
    logEvent(analytics, 'page_view', {
      page_title: 'home',
    });
  },[])
    return (
      <section className='relative'>
        <div className='px-4 sm:px-0'>
          <TitleAndImage/>
          <Searcher/>
          <RandomSearcher/>
          <FashionForward/>
          <FeatureImages/>
          <SecondaryLogin/>
        </div>
        <Footer/>
        {router?.query?.newUser === 'true' && <ZoneModal/>}
      </section>
    )
};

export default Home;