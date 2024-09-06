// components/User/Wishlist/CollaborationModal.jsx
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inviteCollaborator } from '../../../services/firebase';
import styles from './CollaborationModal.module.css';

const CollaborationModal = ({ open, onClose, wishlistId, isPublic, onUpdateWishlist }) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  const handleInviteCollaborator = async () => {
    try {
      await inviteCollaborator(wishlistId, collaboratorEmail);
      setCollaboratorEmail('');
      onClose();
    } catch (error) {
      console.error("Error inviting collaborator:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.collaborationModal}>
      <DialogTitle>Invite Collaborators</DialogTitle>
      <DialogContent>
        {isPublic ? (
          <>
            <TextField
              fullWidth
              label="Collaborator's Email"
              variant="outlined"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              placeholder="Enter email address"
              className={styles.emailInput}
            />
            <Button
              onClick={handleInviteCollaborator}
              variant="contained"
              color="primary"
              fullWidth
              className={styles.inviteButton}
            >
              Invite Collaborator
            </Button>
          </>
        ) : (
          <p className={styles.privateMessage}>
            This wishlist is private. Make it public to invite collaborators.
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollaborationModal;