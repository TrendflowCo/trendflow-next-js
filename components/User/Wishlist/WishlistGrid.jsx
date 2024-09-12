import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import WishlistCard from './WishlistCard';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const WishlistGridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '2rem',
  padding: '2rem',
}));

const WishlistGridTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  marginBottom: '2rem',
  textAlign: 'center',
  background: 'linear-gradient(45deg, #FA39BE, #FE9D2B)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const WishlistGrid = ({ wishlists, onUpdateWishlist, onDeleteWishlist, onShareWishlist }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(wishlists);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onUpdateWishlist(items);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-100 py-20"
    >
      <Box className="container mx-auto px-4">
        <WishlistGridTitle variant="h2" component="h1">
          My Wishlists
        </WishlistGridTitle>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="wishlists" direction="horizontal">
            {(provided) => (
              <WishlistGridContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {wishlists.map((wishlist, index) => (
                  <motion.div
                    key={wishlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <WishlistCard
                      wishlist={wishlist}
                      index={index}
                      draggableId={wishlist.id}
                      onDelete={onDeleteWishlist}
                      onShare={onShareWishlist}
                    />
                  </motion.div>
                ))}
                {provided.placeholder}
              </WishlistGridContainer>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </motion.div>
  );
};

export default WishlistGrid;