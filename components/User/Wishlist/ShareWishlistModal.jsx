// components/User/ShareWishlistModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { shareWishlist } from '../../../services/firebase';
import styles from './ShareWishlistModal.module.css';

const ShareWishlistModal = ({ wishlist, onClose }) => {
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleShare = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await shareWishlist(wishlist.id, email, isPublic);
      onClose();
    } catch (err) {
      setError('Failed to share wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <h2>Share Wishlist: {wishlist.name}</h2>
        <form onSubmit={handleShare}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to share with"
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make wishlist public
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sharing...' : 'Share'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ShareWishlistModal;