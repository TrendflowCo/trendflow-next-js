import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/hooks';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { translations } = useAppSelector(state => state.region);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend or newsletter service
    console.log('Submitted email:', email);
    setIsSubmitted(true);
    setEmail('');
    // Reset submission state after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-400 to-sky-500">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            {translations?.newsletterTitle || 'Stay in Style'}
          </h2>
          <p className="text-xl mb-8">
            {translations?.newsletterDescription || 'Sign up for our newsletter to receive the latest fashion trends and exclusive offers.'}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations?.emailPlaceholder || 'Enter your email'}
              className="flex-grow py-3 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              required
            />
            <motion.button
              type="submit"
              className="bg-white text-emerald-500 font-bold py-3 px-8 rounded-full hover:bg-emerald-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations?.signUpButton || 'Sign Up'}
            </motion.button>
          </form>
          {isSubmitted && (
            <motion.p
              className="mt-4 text-lg font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {translations?.thankYouMessage || 'Thank you for signing up!'}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;