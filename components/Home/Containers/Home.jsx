import React, { useEffect } from 'react';
import TitleAndImage from '../TitleAndImage';
import Searcher from '../Searcher';
import Footer from '../../global/Footer';
import RandomSearcher from '../RandomSearcher';
import ZoneModal from '../ZoneModal';
import TrendingStyles from '../TrendingStyles';
import BrandShowcase from '../BrandShowcase';
import { useRouter } from 'next/router';
import { logAnalyticsEvent, initializeAnalytics } from '../../../services/firebase';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../redux/hooks';
import { MagnifyingGlassIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import Header from '../Header';
// import Testimonials from '../Testimonials';
import NewsletterSignup from '../NewsletterSignup';

const Home = () => {
  const router = useRouter();
  const { translations } = useAppSelector(state => state.region);

  useEffect(() => {
    initializeAnalytics().then(() => {
      logAnalyticsEvent('page_view', { page_title: 'home' });
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-purple-100'
    >
      <Header />
      <main className='flex-grow'>
        <section className="py-20 bg-gradient-to-r from-emerald-400 to-sky-500 text-white">
          <div className="container mx-auto px-4">
            <TitleAndImage />
            <div className="mt-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-center">
                {translations?.homeSubtitle || 'Discover Your Perfect Style with AI-Powered Search'}
              </h2>
              <p className="text-xl mb-8 text-center">
                {translations?.homeDescription || 'Enter any description, and our AI will find the perfect match for you.'}
              </p>
              <Searcher />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
              {translations?.trendingStyles || 'Discover Trending Styles'}
            </h2>
            <p className="text-xl mb-8 text-center text-gray-600">
              {translations?.trendingStylesDescription || 'See what\'s hot right now, curated by our AI'}
            </p>
            <TrendingStyles />
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
              {translations?.topBrands || 'Explore Top Brands'}
            </h2>
            <p className="text-xl mb-8 text-center text-gray-600">
              {translations?.topBrandsDescription || 'Find your favorite brands, all in one place'}
            </p>
            <BrandShowcase />
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-emerald-400 to-sky-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">{translations?.notSure || 'Not sure where to start?'}</h2>
            <p className="text-xl mb-8">{translations?.randomSearchDescription || 'Let our AI inspire you with a random fashion search!'}</p>
            <RandomSearcher />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">
              {translations?.whyChooseUs || 'Why Choose TrendFlow?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title={translations?.feature1?.title || "AI-Powered Search"}
                description={translations?.feature1?.text || "Find exactly what you're looking for with our advanced AI search engine."}
                icon={<MagnifyingGlassIcon className="w-12 h-12 text-emerald-500" />}
              />
              <FeatureCard 
                title={translations?.feature2?.title || "Personalized Recommendations"}
                description={translations?.feature2?.text || "Get tailored style suggestions based on your preferences and browsing history."}
                icon={<UserIcon className="w-12 h-12 text-sky-500" />}
              />
              <FeatureCard 
                title={translations?.feature3?.title || "Trending Styles"}
                description={translations?.feature3?.text || "Stay up-to-date with the latest fashion trends, curated by our AI."}
                icon={<ChartBarIcon className="w-12 h-12 text-pink-500" />}
              />
            </div>
          </div>
        </section>

        {/* <Testimonials /> */}

        <NewsletterSignup />
      </main>

      <Footer />
      {router?.query?.newUser === 'true' && <ZoneModal />}
    </motion.div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-lg"
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default Home;