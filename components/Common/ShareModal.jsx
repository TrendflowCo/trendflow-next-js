import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { 
  EmailShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailIcon, 
  TwitterIcon, 
  WhatsappIcon 
} from 'react-share';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { enhanceText } from '../Utils/enhanceText';
import { inviteCollaborator } from '../../services/firebase';
import { toast } from 'sonner';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '24px',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  background: 'linear-gradient(to right, #9333ea, #10b981)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const ShareButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledShareButton = styled('div')(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to right, #9333ea, #10b981)',
  color: theme.palette.common.white,
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(to right, #7e22ce, #059669)',
  },
}));

const ShareModal = ({ open, onClose, shareUrl, shareTitle, translations, wishlistId, isPublic, onUpdateWishlist }) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  const handleInviteCollaborator = async () => {
    try {
      await inviteCollaborator(wishlistId, collaboratorEmail);
      setCollaboratorEmail('');
      onClose();
      toast.success('Collaborator invited successfully!');
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      toast.error('Failed to invite collaborator. Please try again.');
    }
  };

  const shareProductText = translations?.results?.share_product || 'Share Wishlist';

  return (
    <AnimatePresence>
      {open && (
        <StyledDialog 
          open={open} 
          onClose={onClose}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <StyledDialogTitle>
            {enhanceText(shareProductText)}
          </StyledDialogTitle>
          <DialogContent>
            <ShareButtonWrapper>
              <StyledShareButton>
                <EmailShareButton url={shareUrl} subject={shareTitle}>
                  <EmailIcon size={48} round />
                </EmailShareButton>
              </StyledShareButton>
              <StyledShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={48} round />
                </TwitterShareButton>
              </StyledShareButton>
              <StyledShareButton>
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={48} round />
                </WhatsappShareButton>
              </StyledShareButton>
            </ShareButtonWrapper>
            {isPublic && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  label="Invite Collaborator"
                  variant="outlined"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="Enter email address"
                  sx={{ mb: 2 }}
                />
                <GradientButton
                  onClick={handleInviteCollaborator}
                  variant="contained"
                  fullWidth
                >
                  Invite Collaborator
                </GradientButton>
              </motion.div>
            )}
          </DialogContent>
          <DialogActions>
            <GradientButton onClick={onClose}>
              Close
            </GradientButton>
          </DialogActions>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;