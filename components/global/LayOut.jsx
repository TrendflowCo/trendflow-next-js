import Head from 'next/head';
import NavBar from './NavBar';
import React, { useEffect , useState } from 'react';
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { logOutExternal } from '../Auth/logOutExternal';
import LogInModal from '../Auth/LogInModal';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setLogInFlag , setUser } from '../../redux/features/actions/auth';
import { setTranslations } from '../../redux/features/actions/language';
import { setUserId } from "firebase/analytics";
import { analytics } from '../../services/firebase';
import { Toaster, toast } from 'sonner';
import enTranslation from '../languages/en.json';
import esTranslation from '../languages/es.json';
import itTranslation from '../languages/it.json';
import duTranslation from '../languages/du.json';
import frTranslation from '../languages/fr.json';
import ptTranslation from '../languages/pt.json';
import deTranslation from '../languages/de.json';
import daTranslation from '../languages/da.json';
import ruTranslation from '../languages/ru.json';
import koTranslation from '../languages/ko.json';
import chTranslation from '../languages/ch.json';
import jpTranslation from '../languages/jp.json';
import arTranslation from '../languages/ar.json';
import hiTranslation from '../languages/hi.json';
import caTranslation from '../languages/ca.json';

const Layout = ({ children }) => {
  const dispatch = useAppDispatch()
  const { logInFlag } = useAppSelector(state => state.auth);
  const { language } = useAppSelector(state => state.language);
  const auth = getAuth(); // instance of auth method
  const [user, loading] = useAuthState(auth); // user data
  const [ logged , setLogged ] = useState(null);
  const [ ready , setReady ] = useState(false);
  const logOut = () => { // runs the external log out function
    logOutExternal(auth)
  };

  useEffect(() => {
    if(logged !== null) {
      setTimeout(() =>{
        setReady(true)
      },90000)
    }
  },[logged]);
  useEffect(() => {
    if (ready === true) {
      if (logged === false) {
        dispatch(setLogInFlag(true))
      }
    }
  },[ready]);  // eslint-disable-line
  useEffect(() => {
    if (logged === null) {
      setLogged(false)
    } else if (logged === false) {
      setLogged(true) 
    } else {
      setLogged(false)
    }
    dispatch(setUser(user)); // set the user for every change
    if(user) {
      setUserId(analytics, user.uid); // set user.uid for analytics
    }
  },[user]) // eslint-disable-line
  useEffect(() => {
    switch(language) {
      case "en":
        dispatch(setTranslations(enTranslation))
        break;
      case "es":
        dispatch(setTranslations(esTranslation))
        break;
      case "it":
        dispatch(setTranslations(itTranslation))
        break;
      case "du":
        dispatch(setTranslations(duTranslation))
        break;
      case "fr":
        dispatch(setTranslations(frTranslation))
        break;
      case "pt":
        dispatch(setTranslations(ptTranslation))
        break;
      case "de":
        dispatch(setTranslations(deTranslation))
        break;
      case "da":
        dispatch(setTranslations(daTranslation))
        break;
      case "ru":
        dispatch(setTranslations(ruTranslation))
        break;
      case "ko":
        dispatch(setTranslations(koTranslation))
        break;
      case "ch":
        dispatch(setTranslations(chTranslation))
        break;
      case "jp":
        dispatch(setTranslations(jpTranslation))
        break;
      case "ar":
        dispatch(setTranslations(arTranslation))
        break;
      case "hi":
        dispatch(setTranslations(hiTranslation))
        break;
      case "ca":
        dispatch(setTranslations(caTranslation))
        break;
  
    }
  },[language]); // eslint-disable-line

  return (
    <div className='w-screen h-screen flex flex-col bg-dokuso-white'>
      <Head>
        <title>Dokusō</title>
        <meta name="description" content="Your innovative fashion search tool" />
        <link rel="icon" href=""/>
      </Head>
      <NavBar logOut={logOut} user={user} loading={loading}/>
      <main className='flex flex-col flex-auto p-0 m-0 overflow-auto scrollbar'>
        <Toaster richColors/>
        {children}
        {logInFlag && <LogInModal/>}
        {/* Include log in from MUI snack bar as dynamic message */}
      </main>
    </div>
  )
}

export default Layout;