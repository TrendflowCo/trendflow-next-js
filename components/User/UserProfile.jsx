import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists, getWishlistItems } from '../../services/firebase';
import { app } from '../../services/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './UserProfile.module.css';

const getImageUrl = (item) => {
  if (item.img_url && item.img_url.length > 0) {
    const url = item.img_url[0];
    return url.startsWith('http') ? url : `/${url}`;
  }
  return '/path/to/placeholder.jpg';
};

const WishlistCard = ({ wishlist }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={styles.wishlistCard}
    >
      <h3 className={styles.wishlistTitle}>{wishlist.name}</h3>
      <div className={styles.wishlistImages}>
        {wishlist.items.slice(0, 4).map((item, index) => (
          <div key={item.id_item} className={styles.wishlistImageContainer}>
            <Image
              src={getImageUrl(item)}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className={styles.wishlistImage}
              unoptimized={true}
            />
            {index === 3 && wishlist.items.length > 4 && (
              <div className={styles.wishlistImageOverlay}>
                +{wishlist.items.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className={styles.wishlistItemCount}>
        {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
      </p>
      <Link href={`/wishlist/${wishlist.id}`} className={styles.viewWishlistButton}>
        View Wishlist
      </Link>
    </motion.div>
  );
};

const UserProfile = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetchWishlists();
    }
  }, [user]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const userWishlists = await getUserWishlists(user.uid);
      const wishlistsWithItems = await Promise.all(
        userWishlists.map(async (wishlist) => {
          const items = await getWishlistItems(wishlist.id);
          return { ...wishlist, items };
        })
      );
      setWishlists(wishlistsWithItems);
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError("Failed to fetch wishlists");
    } finally {
      setLoading(false);
    }
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
        <div className={styles.wishlistGrid}>
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;