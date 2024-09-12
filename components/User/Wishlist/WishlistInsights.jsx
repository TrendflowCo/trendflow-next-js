import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const InsightsContainer = styled(Box)(({ theme }) => ({
  marginBottom: '30px',
  padding: '20px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}));

const InsightsTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 700,
  marginBottom: '20px',
  background: 'linear-gradient(45deg, var(--trendflow-pink), var(--trendflow-blue))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const InsightsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
}));

const InsightCard = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  boxShadow: '5px 5px 15px #d1d1d1, -5px -5px 15px #ffffff',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const InsightTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: '10px',
  color: '#333',
}));

const InsightValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, var(--trendflow-pink), var(--trendflow-blue))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const WishlistInsights = ({ wishlist }) => {
  const insights = useMemo(() => {
    if (!wishlist || !wishlist.items) {
      return null;
    }

    const allItems = wishlist.items;
    
    // Calculate total items
    const totalItems = allItems.length;

    // Calculate average price
    const totalPrice = allItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;

    // Find most common brand
    const brandCounts = allItems.reduce((acc, item) => {
      if (item.brand) {
        acc[item.brand] = (acc[item.brand] || 0) + 1;
      }
      return acc;
    }, {});
    const mostCommonBrand = Object.entries(brandCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['N/A', 0])[0];

    // Find price range
    const prices = allItems.map(item => parseFloat(item.price || 0)).filter(price => !isNaN(price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      totalItems,
      averagePrice,
      mostCommonBrand,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [wishlist]);

  if (!insights) {
    return null;
  }

  return (
    <InsightsContainer>
      <InsightsTitle variant="h2">Wishlist Insights</InsightsTitle>
      <InsightsGrid>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <InsightCard elevation={0}>
            <InsightTitle>Total Items</InsightTitle>
            <InsightValue>{insights.totalItems}</InsightValue>
          </InsightCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <InsightCard elevation={0}>
            <InsightTitle>Average Price</InsightTitle>
            <InsightValue>${insights.averagePrice.toFixed(2)}</InsightValue>
          </InsightCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <InsightCard elevation={0}>
            <InsightTitle>Most Common Brand</InsightTitle>
            <InsightValue>{insights.mostCommonBrand}</InsightValue>
          </InsightCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <InsightCard elevation={0}>
            <InsightTitle>Price Range</InsightTitle>
            <InsightValue>${insights.priceRange.min.toFixed(2)} - ${insights.priceRange.max.toFixed(2)}</InsightValue>
          </InsightCard>
        </motion.div>
      </InsightsGrid>
    </InsightsContainer>
  );
};

export default WishlistInsights;