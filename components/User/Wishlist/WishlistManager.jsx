import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { createWishlist, addItemToWishlist, getUserWishlists } from '../../../services/firebase';
import { toast } from 'sonner';

const WishlistManager = ({ productItem, open, onClose }) => {
  const [user] = useAuthState(getAuth());
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isCreatingNewWishlist, setIsCreatingNewWishlist] = useState(false);

  const fetchWishlists = useCallback(async () => {
    if (!user) return;
    try {
      const userWishlists = await getUserWishlists(user.uid);
      setWishlists(userWishlists);
    } catch (error) {
      toast.error('Failed to fetch wishlists');
    }
  }, [user]);

  useEffect(() => {
    if (user && open) {
      fetchWishlists();
    }
  }, [user, open, fetchWishlists]);

  const handleCreateWishlist = async () => {
    if (!user || !newWishlistName.trim()) return;

    try {
      const newWishlistId = await createWishlist(user.uid, newWishlistName.trim());
      await addItemToWishlist(newWishlistId, productItem);
      setNewWishlistName('');
      await fetchWishlists();
      toast.success('Wishlist created and item added');
      onClose();
    } catch (error) {
      toast.error('Failed to create wishlist: ' + error.message);
    }
  };

  const handleAddToWishlist = async (wishlistId) => {
    if (!user) return;

    try {
      await addItemToWishlist(wishlistId, productItem);
      toast.success('Item added to wishlist');
      onClose();
    } catch (error) {
      toast.error('Failed to add item to wishlist: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add to Wishlist</DialogTitle>
      <DialogContent>
        <List>
          {wishlists.map((wishlist) => (
            <ListItem key={wishlist.id} button onClick={() => handleAddToWishlist(wishlist.id)}>
              <ListItemText primary={wishlist.name} />
            </ListItem>
          ))}
        </List>
        {isCreatingNewWishlist ? (
          <TextField
            autoFocus
            margin="dense"
            label="New Wishlist Name"
            fullWidth
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
          />
        ) : (
          <Button onClick={() => setIsCreatingNewWishlist(true)}>
            Create New Wishlist
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isCreatingNewWishlist && (
          <Button onClick={handleCreateWishlist} color="primary">
            Create and Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WishlistManager;