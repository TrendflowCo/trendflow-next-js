import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists, getWishlistItems, deleteWishlist } from '../../services/firebase';
import { app } from '../../services/firebase';
import { motion } from 'framer-motion';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/system';
import WishlistGrid from './Wishlist/WishlistGrid';
import { toast } from 'sonner';
import ShareModal from '../Common/ShareModal';

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '80px auto 0',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}));

const ProfileTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  marginBottom: '2rem',
  textAlign: 'center',
  fontWeight: 700,
  color: '#333',
}));

const EmptyCollectionMessage = styled(Box)(({ theme }) => ({
  fontSize: '1.2rem',
  color: '#666',
  textAlign: 'center',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  color: '#333',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: '#4CAF50',
    transform: 'translateY(-2px)',
  },
}));

const UserProfile = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const fetchWishlists = useCallback(async () => {
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
      console.error("Error fetching collections:", err);
      setError("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleEditWishlist = (wishlist) => {
    // Implement edit functionality
    console.log("Edit collection:", wishlist);
    // You can open a modal or navigate to an edit page here
  };

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await deleteWishlist(wishlistId);
      setWishlists(prevWishlists => prevWishlists.filter(w => w.id !== wishlistId));
      toast.success("Collection deleted successfully");
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    }
  };

  const handleShareWishlist = (wishlist) => {
    setSelectedWishlist(wishlist);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSelectedWishlist(null);
  };

  useEffect(() => {
    if (user) {
      fetchWishlists();
    }
  }, [user, fetchWishlists]);

  const handleUpdateWishlist = (updatedWishlist) => {
    setWishlists(prevWishlists =>
      prevWishlists.map(wishlist =>
        wishlist.id === updatedWishlist.id ? { ...wishlist, ...updatedWishlist } : wishlist
      )
    );
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Typography color="error">Oops! {error}</Typography>
    </Box>
  );

  return (
    <ProfileContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <ProfileTitle variant="h1">My Collections</ProfileTitle> */}
        {wishlists.length === 0 ? (
          <EmptyCollectionMessage>
            <Typography variant="body1">You haven't created any collections yet.</Typography>
            <Typography variant="body1">Start by saving items you love to create your first collection!</Typography>
            <ActionButton onClick={() => {/* Navigate to search or discovery page */}}>
              Discover Items
            </ActionButton>
          </EmptyCollectionMessage>
        ) : (
          <WishlistGrid 
            wishlists={wishlists} 
            onUpdateWishlist={handleUpdateWishlist}
            onEditWishlist={handleEditWishlist}
            onDeleteWishlist={handleDeleteWishlist}
            onShareWishlist={handleShareWishlist}
          />
        )}
      </motion.div>
      {selectedWishlist && (
        <ShareModal
          open={shareModalOpen}
          onClose={handleCloseShareModal}
          wishlist={selectedWishlist}
        />
      )}
    </ProfileContainer>
  );
};

export default UserProfile;