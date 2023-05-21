import Main from '../../components/Home/Containers/Home';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';

const Home = () => {
  const router = useRouter();
  const { language } = useAppSelector(state => state.language);

  useEffect(() => {
    router.push(`/${language}`)
  },[language])

  return ( 
    <> 
      {language &&
        <Main/>
      }
    </>
  )
}

export default Home