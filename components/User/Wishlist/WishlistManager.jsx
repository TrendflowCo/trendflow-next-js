import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { createWishlist, getUserWishlists, addItemToWishlist } from '../../../services/firebase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const WishlistManager = ({ productItem, open, onClose }) => {
  const [user] = useAuthState(getAuth());
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isCreatingNewWishlist, setIsCreatingNewWishlist] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User is signed in:", user.uid);
      fetchWishlists();
    } else {
      console.log("No user signed in");
    }
  }, [user]);

  useEffect(() => {
    console.log("WishlistManager opened with productItem:", productItem);
  }, [open, productItem]);

  const fetchWishlists = async () => {
    try {
      const userWishlists = await getUserWishlists(user.uid);
      setWishlists(userWishlists);
    } catch (error) {
      toast.error('Failed to fetch wishlists');
    }
  };

  const handleCreateWishlist = async () => {
    if (!user) {
      toast.error('Please log in to create a wishlist');
      return;
    }

    if (newWishlistName.trim()) {
      try {
        console.log("Attempting to create wishlist:", newWishlistName);
        const newWishlistId = await createWishlist(user.uid, newWishlistName.trim());
        console.log("New wishlist created with ID:", newWishlistId);
        setNewWishlistName('');
        await fetchWishlists(); // Make sure this is an async function
        toast.success('Wishlist created successfully');
        setIsCreatingNewWishlist(false);
      } catch (error) {
        console.error("Error in handleCreateWishlist:", error);
        toast.error('Failed to create wishlist: ' + error.message);
      }
    }
  };
  
  const handleAddToWishlist = async (wishlistId) => {
    if (!user) {
      toast.error('Please log in to add items to a wishlist');
      return;
    }

    try {
      console.log("Attempting to add item to wishlist:", wishlistId);
      console.log("Product item:", productItem);
      if (!productItem || !productItem.id_item) {
        throw new Error("Invalid product item");
      }
      await addItemToWishlist(wishlistId, productItem);
      console.log("Item added to wishlist successfully");
      toast.success('Item added to wishlist');
      onClose();
    } catch (error) {
      console.error("Error in handleAddToWishlist:", error);
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
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsCreatingNewWishlist(true)}
          >
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