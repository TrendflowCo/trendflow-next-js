import React, { useEffect, useState } from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import Footer from '../../global/Footer';
import RandomSearcher from '../RandomSearcher';
import ZoneModal from '../ZoneModal';
import RandomQuerySliders from '../RandomQuerySliders';
import { useRouter } from 'next/router';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../services/firebase';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: 'home',
    });
  }, [])
  return (
    <section className='min-h-screen flex flex-col'>
      <div className='px-4 sm:px-8 flex-grow flex flex-col items-center justify-start w-full max-w-7xl mx-auto'>
        <div className="pt-24 sm:pt-32 pb-16 w-full">
          <TitleAndImage />
        </div>
        <div className="w-full max-w-3xl mx-auto">
          <Searcher />
          <RandomSearcher />
        </div>
        <div className="w-full max-w-5xl mx-auto">
          <RandomQuerySliders />
        </div>
      </div>
      <Footer />
      {router?.query?.newUser === 'true' && <ZoneModal />}
    </section>
  )
};

export default Home;