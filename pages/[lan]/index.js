import Main from '../../components/Home/Containers/Home';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setLanguage } from '../../redux/features/actions/language';

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(state => state.language);

  useEffect(() => { // this is when someone enters to, i.e., www.dokuso.app/es
    const languageByPath = router.query.lan;
    if (languageByPath) { // una vez que haya leido el idioma
      localStorage.setItem('language',languageByPath)
      dispatch(setLanguage(languageByPath))
    }
  },[router]) // eslint-disable-line

  return ( 
    <> 
      {language &&
        <Main/>
      }
    </>
  )
}

export default Home