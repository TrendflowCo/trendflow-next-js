import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, Typography, Box, IconButton, Button } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
import ShareModal from '../../Common/ShareModal';
import CollaborationModal from './CollaborationModal';
import { updateWishlistPrivacy } from '../../../services/firebase';

const StyledCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const WishlistTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: '1rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #9143CC, #10B981)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const WishlistImages = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
  marginBottom: '1rem',
}));

const WishlistImage = styled('img')({
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #9143CC, #10B981)',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #7B2CBF, #059669)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: '#4B5563',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: '#10B981',
    transform: 'scale(1.1)',
  },
}));

const WishlistCard = ({ wishlist, index, draggableId, onDelete, onShare }) => {
  const [isPublic, setIsPublic] = useState(wishlist.isPublic);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(wishlist.id);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleCollaborate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollaborationModalOpen(true);
  };

  const handlePrivacyToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateWishlistPrivacy(wishlist.id, !isPublic);
      setIsPublic(!isPublic);
    } catch (error) {
      console.error("Error updating wishlist privacy:", error);
    }
  };

  const shareUrl = `${window.location.origin}/wishlist/${wishlist.id}`;
  const shareTitle = `Check out my TrendFlow wishlist: ${wishlist.name}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <StyledCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <WishlistTitle variant="h6">{wishlist.name}</WishlistTitle>
              <IconButtonStyled size="small" onClick={handlePrivacyToggle}>
                {isPublic ? <LockOpenIcon /> : <LockIcon />}
              </IconButtonStyled>
            </Box>
            <WishlistImages>
              {wishlist.items.slice(0, 4).map((item, index) => (
                <WishlistImage key={index} src={item.img_urls[0]} alt={`Item ${index + 1}`} />
              ))}
            </WishlistImages>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {wishlist.items.length} items
            </Typography>
            <Box mt="auto">
              <Link href={`/wishlist/${wishlist.id}`} passHref style={{ textDecoration: 'none' }}>
                <ActionButton fullWidth>
                  View Wishlist
                </ActionButton>
              </Link>
              <Box display="flex" justifyContent="center" mt={2}>
                <IconButtonStyled size="small" onClick={handleShare}>
                  <ShareIcon />
                </IconButtonStyled>
                <IconButtonStyled size="small" onClick={handleCollaborate}>
                  <PeopleIcon />
                </IconButtonStyled>
                <IconButtonStyled size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButtonStyled>
              </Box>
            </Box>
          </CardContent>
          <ShareModal
            open={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            shareUrl={shareUrl}
            shareTitle={shareTitle}
          />
          <CollaborationModal
            open={isCollaborationModalOpen}
            onClose={() => setIsCollaborationModalOpen(false)}
            wishlistId={wishlist.id}
            isPublic={isPublic}
          />
        </StyledCard>
      )}
    </Draggable>
  );
};

export default WishlistCard;