import React from "react";
import { Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithGoogle } from '../../services/firebase';

const SocialAuth = ({ onLoginSuccess, onLoginError }) => {
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      } else {
        throw new Error("Failed to sign in with Google");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      onLoginError(error);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </motion.div>
    </Box>
  );
};

export default SocialAuth;