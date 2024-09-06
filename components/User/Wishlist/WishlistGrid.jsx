import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import WishlistCard from './WishlistCard';
import styles from './WishlistGrid.module.css';

const WishlistGrid = ({ wishlists, onUpdateWishlist }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(wishlists);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Call onUpdateWishlist with the new order
    onUpdateWishlist(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="wishlists" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.wishlistGrid}
          >
            {wishlists.map((wishlist, index) => (
              <WishlistCard
                key={wishlist.id}
                wishlist={wishlist}
                index={index}
                draggableId={wishlist.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WishlistGrid;