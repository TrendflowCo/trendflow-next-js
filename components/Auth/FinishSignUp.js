import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { completeSignInWithEmailLink } from './authFunctions';
import { getAuth } from "firebase/auth";
import { CircularProgress, Typography, Box } from '@mui/material';
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {status === 'Processing' && (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" style={{ marginTop: 20 }}>Completing sign-up process...</Typography>
        </>
      )}
      {status === 'Success' && (
        <>
          <Typography variant="h5">Sign-up Successful!</Typography>
          <Typography variant="body1" style={{ marginTop: 10 }}>Redirecting you to the homepage...</Typography>
        </>
      )}
      {status === 'Error' && (
        <>
          <Typography variant="h5" color="error">An error occurred during sign-up.</Typography>
          <Typography variant="body1" color="error" style={{ marginTop: 10 }}>{error}</Typography>
        </>
      )}
    </Box>
  );
};

export default FinishSignUp;