import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { completeSignInWithEmailLink } from '../components/Auth/authFunctions';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CircularProgress, Typography, Box, Button } from '@mui/material';
import { toast } from 'sonner';

const FinishSignUp = () => {
  const router = useRouter();
  const auth = getAuth();
  const [status, setStatus] = useState('Processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const finishSignIn = async () => {
      console.log("Starting finishSignIn process...");
      try {
        const user = await completeSignInWithEmailLink();
        console.log("Sign-in/Sign-up completed successfully:", user);
        setStatus('Success');
        toast.success(`Logged in as ${user.email}`, { id: 'signInSuccess' });
        setTimeout(() => router.push('/'), 2000);
      } catch (error) {
        console.error('Error during sign-in/sign-up:', error);
        setStatus('Error');
        if (error.code === 'auth/email-already-in-use') {
          setError('This email is already associated with an account. Please try logging in instead.');
        } else if (error.code === 'auth/invalid-action-code') {
          setError('The sign-in link has expired or already been used. Please request a new one.');
        } else if (error.code === 'auth/invalid-login-credentials') {
          setError('Invalid login credentials. Please try the sign-up process again.');
        } else if (error.code === 'auth/user-not-found') {
          setError('User not found. Please try the sign-up process again.');
        } else if (error.message.includes('Network error')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(error.message || 'An unexpected error occurred');
        }
        toast.error(error.message || 'Failed to complete the process', { id: 'signInError' });
      }
    };

    finishSignIn();
  }, [router]);

  const handleRetry = () => {
    router.push('/'); // Redirect to home page or sign-in page
  };

  console.log("Current status:", status);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {status === 'Processing' && (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" style={{ marginTop: 20 }}>Completing sign-in process...</Typography>
        </>
      )}
      {status === 'Success' && (
        <>
          <Typography variant="h5">Sign-in Successful!</Typography>
          <Typography variant="body1" style={{ marginTop: 10 }}>Redirecting you to the homepage...</Typography>
        </>
      )}
      {status === 'Error' && (
        <>
          <Typography variant="h5" color="error">An error occurred during sign-in.</Typography>
          <Typography variant="body1" color="error" style={{ marginTop: 10 }}>{error}</Typography>
          <Button variant="contained" color="primary" onClick={handleRetry} style={{ marginTop: 20 }}>
            Return to Home
          </Button>
        </>
      )}
    </Box>
  );
};

export default FinishSignUp;