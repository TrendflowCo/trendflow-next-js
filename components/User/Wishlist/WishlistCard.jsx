import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Draggable } from 'react-beautiful-dnd';
import { FaShareAlt, FaUsers, FaLock, FaUnlock } from 'react-icons/fa';
import ShareModal from '../../Common/ShareModal';
import CollaborationModal from './CollaborationModal';
import { updateWishlistPrivacy } from '../../../services/firebase';
import styles from './WishlistCard.module.css';

const getImageUrl = (item) => {
  if (item.img_urls && item.img_urls.length > 0) {
    const url = item.img_urls[0];
    return url.startsWith('http') ? url : `/${url}`;
  }
  return '/path/to/placeholder.jpg';
};

const WishlistCard = ({ wishlist, index, draggableId }) => {
  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(wishlist.isPublic);

  const handleShareClick = () => setIsShareModalOpen(true);
  const handleCollaborateClick = () => setIsCollaborationModalOpen(true);

  const handlePrivacyToggle = async () => {
    try {
      const updatedWishlist = await updateWishlistPrivacy(wishlist.id, !isPublic);
      setIsPublic(!isPublic);
    } catch (error) {
      console.error("Error updating wishlist privacy:", error);
    }
  };

  const shareUrl = `${window.location.origin}/wishlist/${wishlist.id}`;
  const shareTitle = `Check out my TrendFlow wishlist: ${wishlist.name}`;
  
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={(el) => {
            inViewRef(el);
            provided.innerRef(el);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className={`${styles.wishlistCard} ${snapshot.isDragging ? styles.isDragging : ''}`}
        >
          <div className={styles.wishlistHeader}>
            <h3 className={styles.wishlistTitle}>{wishlist.name}</h3>
            <button
              onClick={handlePrivacyToggle}
              className={`${styles.privacyToggle} ${isPublic ? styles.public : styles.private}`}
            >
              {isPublic ? <FaUnlock /> : <FaLock />}
            </button>
          </div>
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
          <div className={styles.wishlistActions}>
            <Link href={`/wishlist/${wishlist.id}`} className={styles.viewWishlistButton}>
              View Wishlist
            </Link>
            <button onClick={handleShareClick} className={styles.iconButton}>
              <FaShareAlt />
            </button>
            <button onClick={handleCollaborateClick} className={styles.iconButton}>
              <FaUsers />
            </button>
          </div>
          <ShareModal
            open={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            shareUrl={shareUrl}
            shareTitle={shareTitle}
          />
          <CollaborationModal
            open={isCollaborationModalOpen}
            onClose={() => setIsCollaborationModalOpen(false)}
            wishlistId={wishlist.id}
            isPublic={isPublic}
          />
        </motion.div>
      )}
    </Draggable>
  );
};

export default WishlistCard;