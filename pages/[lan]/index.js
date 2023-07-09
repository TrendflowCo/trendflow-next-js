import Main from '../../components/Home/Containers/Home';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setLanguage } from '../../redux/features/actions/language';

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(state => state.language);

  useEffect(() => {
    const defLanguage = localStorage.getItem("language", language);
    router.push(`/${defLanguage}`)
    dispatch(setLanguage(defLanguage))
  },[language]) // eslint-disable-line

  return ( 
    <> 
      {language &&
        <Main/>
      }
    </>
  )
}

export default Home