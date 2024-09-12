import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getWishlistDetails, updateWishlistItemOrder } from '../../../services/firebase';
import ResultCard from '../../Results/ResultCard';
import WishlistInsights from './WishlistInsights';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, Box, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const WishlistContainer = styled(Box)(({ theme }) => ({
  padding: '40px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
  marginTop: '80px', // Add top margin to push content below navbar
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const WishlistHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
}));

const WishlistTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, var(--trendflow-pink), var(--trendflow-blue))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const WishlistGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '30px',
}));

const BackButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, var(--trendflow-pink), var(--trendflow-blue))',
  color: 'white',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '25px',
  '&:hover': {
    background: 'linear-gradient(45deg, var(--trendflow-blue), var(--trendflow-pink))',
  },
}));

const WishlistDetail = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedWishlistName, setEditedWishlistName] = useState('');
  const router = useRouter();
  const { id } = router.query;

  const fetchWishlistDetails = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWishlistDetails();
    }
  }, [id, fetchWishlistDetails]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(wishlist.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWishlist({ ...wishlist, items });

    try {
      await updateWishlistItemOrder(id, items);
    } catch (error) {
      console.error("Error updating wishlist item order:", error);
    }
  };

  const handleEditClick = () => {
    setEditedWishlistName(wishlist.name);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSave = async () => {
    try {
      // Implement the updateWishlistName function in your Firebase service
      await updateWishlistName(id, editedWishlistName);
      setWishlist({ ...wishlist, name: editedWishlistName });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating wishlist name:", error);
    }
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', marginTop: '100px' }}>{error}</Typography>;
  if (!wishlist) return <Typography sx={{ textAlign: 'center', marginTop: '100px' }}>Wishlist not found</Typography>;

  return (
    <Box sx={{ paddingTop: '80px' }}> {/* Add padding to the top-level container */}
      <WishlistContainer className="scrollbar">
        <WishlistHeader>
          <BackButton startIcon={<ArrowBackIcon />} onClick={() => router.push('/profilePage')}>
            Back to Profile
          </BackButton>
          <WishlistTitle variant="h1">{wishlist.name}</WishlistTitle>
          <IconButton onClick={handleEditClick} color="primary">
            <EditIcon />
          </IconButton>
        </WishlistHeader>
        <WishlistInsights wishlist={wishlist} />
        {wishlist.items.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', marginTop: '30px' }}>
            This wishlist is empty.
          </Typography>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="wishlist-items">
              {(provided) => (
                <WishlistGrid ref={provided.innerRef} {...provided.droppableProps}>
                  {wishlist.items.map((item, index) => (
                    <Draggable key={item.id_item} draggableId={item.id_item} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ResultCard productItem={item} isDragging={snapshot.isDragging} />
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </WishlistGrid>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Wishlist Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Wishlist Name"
              type="text"
              fullWidth
              value={editedWishlistName}
              onChange={(e) => setEditedWishlistName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </WishlistContainer>
    </Box>
  );
};

export default WishlistDetail;