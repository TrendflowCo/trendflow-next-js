import { useRouter } from "next/router"
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setLanguage } from "../redux/features/actions/language";

const HomeRedirect = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const defLanguage = localStorage.getItem("language"); // takes language from localStorage
    if(!defLanguage) { // by complete default, define english as first language
      dispatch(setLanguage("en")); // redux
      localStorage.setItem("language","en"); // local storage
      router.push(`/en`); // redirect to current language url
    } else {
      dispatch(setLanguage(defLanguage)); // the language found is dispatched to redux
      router.push(`/${defLanguage}`); // redirect to current language url
    }
  },[]) // eslint-disable-line
}

export default HomeRedirect