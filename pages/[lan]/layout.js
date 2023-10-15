import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setLanguage } from '../../redux/features/actions/language';

const Layout = ({ children }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => { // this is when someone enters to, i.e., www.dokuso.app/es
        const languageByPath = router.query.lan;
        if (languageByPath) { // una vez que haya leido el idioma
          localStorage.setItem('language',languageByPath)
          dispatch(setLanguage(languageByPath))
        }
    },[router]) // eslint-disable-line
    


  return <>{router.query.lan && children}</>
}

export default Layout