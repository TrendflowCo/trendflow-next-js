import React, { useRef } from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const VisualSearchModal = ({ isOpen, onClose, onImageSelect, translations }) => {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="visual-search-modal"
            aria-describedby="modal-for-visual-search"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                textAlign: 'center',
            }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {translations?.visualSearch?.title || "Visual Search"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {translations?.visualSearch?.description || "Upload an image or take a photo to search for similar products."}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <input
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="raised-button-file">
                        <IconButton 
                            color="primary" 
                            aria-label="upload picture" 
                            component="span"
                            sx={{ 
                                mr: 2,
                                background: 'linear-gradient(to right, #FF69B4, #3F51B5)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #FF1493, #1A237E)',
                                }
                            }}
                        >
                            <FileUploadIcon />
                        </IconButton>
                    </label>
                    <input
                        ref={cameraInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="camera-capture"
                        type="file"
                        capture="environment"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="camera-capture">
                        <IconButton 
                            color="primary" 
                            aria-label="take photo" 
                            component="span"
                            sx={{ 
                                background: 'linear-gradient(to right, #FF69B4, #3F51B5)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #FF1493, #1A237E)',
                                }
                            }}
                        >
                            <CameraAltIcon />
                        </IconButton>
                    </label>
                </Box>
            </Box>
        </Modal>
    );
};

export default VisualSearchModal;