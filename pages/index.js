import { useRouter } from "next/router"
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
const HomeRedirect = () => {
  const { language } = useAppSelector(state => state.language); // read language from redux
  const router = useRouter();
  useEffect(() => {
    router.push(`/${language}`); // redirect to current language url
  },[language])
}

export default HomeRedirect