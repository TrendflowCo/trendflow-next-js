import React, { useMemo } from 'react';
import styles from './WishlistInsights.module.css';

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
    <div className={styles.insightsContainer}>
      <h2 className={styles.insightsTitle}>Wishlist Insights</h2>
      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <h3>Total Items</h3>
          <p>{insights.totalItems}</p>
        </div>
        <div className={styles.insightCard}>
          <h3>Average Price</h3>
          <p>${insights.averagePrice.toFixed(2)}</p>
        </div>
        <div className={styles.insightCard}>
          <h3>Most Common Brand</h3>
          <p>{insights.mostCommonBrand}</p>
        </div>
        <div className={styles.insightCard}>
          <h3>Price Range</h3>
          <p>${insights.priceRange.min.toFixed(2)} - ${insights.priceRange.max.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default WishlistInsights;