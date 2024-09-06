import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists, getWishlistItems } from '../../services/firebase';
import { app } from '../../services/firebase';
import styles from './UserProfile.module.css';
import WishlistGrid from './Wishlist/WishlistGrid';

const UserProfile = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetchWishlists();
      console.log('Fetching wishlists...');
    }
  }, [user]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const userWishlists = await getUserWishlists(user.uid);
      console.log('User wishlists:', userWishlists);
      const wishlistsWithItems = await Promise.all(
        userWishlists.map(async (wishlist) => {
          const items = await getWishlistItems(wishlist.id);
          return { ...wishlist, items };
        })
      );
      setWishlists(wishlistsWithItems);
      console.log('Wishlists with items:', wishlistsWithItems);
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError("Failed to fetch wishlists");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWishlist = (updatedWishlist) => {
    setWishlists(prevWishlists =>
      prevWishlists.map(wishlist =>
        wishlist.id === updatedWishlist.id ? { ...wishlist, ...updatedWishlist } : wishlist
      )
    );
  };

  if (loading) return <div className={styles.loading}>Loading your wishlists...</div>;
  if (error) return <div className={styles.error}>Oops! {error}</div>;

  return (
    <div className={styles.userProfile}>
      <h1 className={styles.profileTitle}>My TrendFlow Collections</h1>
      {wishlists.length === 0 ? (
        <div className={styles.emptyWishlistMessage}>
          <p>You haven't created any collections yet.</p>
          <p>Start adding items to create your first TrendFlow collection!</p>
        </div>
      ) : (
        <WishlistGrid wishlists={wishlists} onUpdateWishlist={handleUpdateWishlist} />
      )}
    </div>
  );
};

export default UserProfile;