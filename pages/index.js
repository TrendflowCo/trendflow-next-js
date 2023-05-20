import { useRouter } from "next/router"
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
const HomeRedirect = () => {
  const { language } = useAppSelector(state => state.language);
  // const { currentSearch } = useAppSelector(state => state.search);
  const router = useRouter();
  useEffect(() => {
    router.push(`/${language}`); // redirect hardcoded to english
  },[])
}

export default HomeRedirect