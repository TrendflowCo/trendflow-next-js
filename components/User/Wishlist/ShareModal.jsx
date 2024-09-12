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
import { styled } from '@mui/material/styles';

const ShareButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: theme.spacing(2),
}));

const ShareModal = ({ open, onClose, wishlist }) => {
  const [email, setEmail] = useState('');
  const shareUrl = `https://yourdomain.com/wishlist/${wishlist.id}`; // Replace with your actual share URL
  const title = `Check out my wishlist: ${wishlist.name}`;

  const handleEmailShare = () => {
    // Implement email sharing logic here
    console.log(`Sharing wishlist ${wishlist.id} with ${email}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Share Wishlist</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ShareButtonWrapper>
          <EmailShareButton url={shareUrl} subject={title}>
            <EmailIcon size={32} round />
          </EmailShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </ShareButtonWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleEmailShare}>Share</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;