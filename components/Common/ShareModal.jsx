import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { 
  EmailShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailIcon, 
  TwitterIcon, 
  WhatsappIcon 
} from 'react-share';
import { enhanceText } from '../Utils/enhanceText';

const ShareModal = ({ open, onClose, shareUrl, shareTitle, translations }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '16px',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        {enhanceText(translations?.results?.share_product)}
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col items-center space-y-6 py-4">
          <EmailShareButton url={shareUrl} subject={shareTitle}>
            <EmailIcon size={48} round />
          </EmailShareButton>
          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          sx={{
            background: 'linear-gradient(to right, #FA39BE, #FE9D2B)',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(to right, #FE9D2B, #FA39BE)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;