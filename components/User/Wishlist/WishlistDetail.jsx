import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getWishlistDetails } from '../../../services/firebase';
import ResultCard from '../../Results/ResultCard';
import WishlistInsights from './WishlistInsights';
import styles from './WishlistDetail.module.css';

const WishlistDetail = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchWishlistDetails();
    }
  }, [id]);

  const fetchWishlistDetails = async () => {
    try {
      setLoading(true);
      const wishlistData = await getWishlistDetails(id);
      setWishlist(wishlistData);
    } catch (err) {
      console.error("Error fetching wishlist details:", err);
      setError("Failed to fetch wishlist details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  if (!wishlist) return <div style={{ padding: '20px' }}>Wishlist not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '80px auto 0' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>{wishlist.name}</h1>
      {wishlist.items.length === 0 ? (
        <p style={{ fontSize: '1.1rem', color: '#666' }}>This wishlist is empty.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {wishlist.items.map((item) => (
            <ResultCard key={item.id_item} productItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistDetail;