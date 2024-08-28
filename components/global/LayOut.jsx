import Head from 'next/head';
import NavBar from './NavBar';
import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { logOutExternal } from '../Auth/logOutExternal';
import LogInModal from '../Auth/LogInModal';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setTranslations } from '../../redux/features/actions/region';
import { Toaster } from 'sonner';
import { useRouter } from 'next/router';
import { CircularProgress, Box } from '@mui/material';

const Layout = ({ children }) => {
  const dispatch = useAppDispatch()
  const { logInFlag } = useAppSelector(state => state.auth);
  const { language } = useAppSelector(state => state.region);
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const logOut = () => {
    logOutExternal(auth)
  };

  const isHomePage = router.pathname === '/[zone]/[lan]';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className='w-screen h-screen flex flex-col bg-trendflow-white'>
      <Head>
        <title>TrendFlow</title>
        <meta name="description" content="Your innovative fashion search tool" />
        <link rel="icon" href=""/>
      </Head>
      {!isHomePage && <NavBar logOut={logOut} user={user} loading={loading}/>}
      <main className='flex flex-col flex-auto p-0 m-0 overflow-auto scrollbar'>
        <Toaster richColors/>
        {children}
        {logInFlag && <LogInModal/>}
      </main>
    </div>
  )
}

export default Layout;