import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { setLanguage , setCountry, setTranslations } from '../../../redux/features/actions/region';
import { countriesAndLanguages } from '../../../components/Resources/countriesDefaultValues';
import { distanceCalculator } from "../../../components/functions/distanceCalculator"
import enTranslation from '../../../components/languages/en.json'
import esTranslation from '../../../components/languages/es.json'
import frTranslation from '../../../components/languages/fr.json'
import itTranslation from '../../../components/languages/it.json'

const Layout = ({ children }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => { // this is when someone enters to, i.e., www.trendflow.app/es
      if(router.query.zone && router.query.lan) {
        const defCountry = router.query.zone; // pais por router
        const defLanguage = router.query.lan; // idioma por router
        const isValidCountry = countriesAndLanguages.some((item) => item.aliasCountry === defCountry)
        const isValidLanguage = countriesAndLanguages.some((item) => item.defaultLanguage === defLanguage)
        if ( !defLanguage || !isValidCountry || !isValidLanguage) { // if something is not valid
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const countriesDistances = countriesAndLanguages.map((item) => {
              return {
                country: item.country,
                aliasCountry: item.aliasCountry,
                defaultLanguage: item.defaultLanguage,
                defaultCurrency: item.defaultCurrency,
                distance: distanceCalculator(latitude , longitude , item.latitude , item.longitude)
              }
            })
            const minimumDistance = countriesDistances.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
            localStorage.setItem("country",minimumDistance.aliasCountry); // local storage country
            localStorage.setItem("language",minimumDistance.defaultLanguage); // local storage language
            router.push(`/${minimumDistance.aliasCountry}/${minimumDistance.defaultLanguage}`)
          }, (error) => {
            localStorage.setItem("country",'us'); // local storage country
            localStorage.setItem("language",'en'); // local storage language
            router.push(`/${'us'}/${'en'}`)
          });  
        } else {
          localStorage.setItem("country",defCountry); // local storage country
          localStorage.setItem("language",defLanguage); // local storage language
          dispatch(setCountry(defCountry))
          dispatch(setLanguage(defLanguage))
          switch(defLanguage) {
            case "en":
              dispatch(setTranslations(enTranslation))
              break;
            case "es":
              dispatch(setTranslations(esTranslation))
              break;
            case "it":
              dispatch(setTranslations(itTranslation))
              break;
            case "fr":
              dispatch(setTranslations(frTranslation))
              break;  
          }    
        }
      }
    },[router]) // eslint-disable-line
  return <>{router.query.lan && router.query.zone && children}</>
}

export default Layout