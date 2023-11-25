import React, { useEffect } from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
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
      <section className='relative h-screen flex flex-col'>
        <div className='px-4 sm:px-0 flex flex-col items-start justify-start flex-auto w-full'>
          <TitleAndImage/>
          <Searcher/>
          <RandomSearcher/>
        </div>
        <Footer/>
        {router?.query?.newUser === 'true' && <ZoneModal/>}
      </section>
    )
};

export default Home;