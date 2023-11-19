import { useRouter } from "next/router"
import { useEffect } from "react";
import { countriesAndLanguages } from "../components/Resources/countriesDefaultValues";
import { distanceCalculator } from "../components/functions/distanceCalculator";

const HomeRedirect = () => {
  const router = useRouter();
  useEffect(() => { // this is made when someone enters to www.dokuso.app/
    const defCountry = localStorage.getItem('country'); // pais por localStorage
    const defLanguage = localStorage.getItem('language'); // idioma por localStorage
    const isValidCountry = countriesAndLanguages.some((item) => item.aliasCountry === defCountry)
    const isValidLanguage = countriesAndLanguages.some((item) => item.defaultLanguage === defLanguage)
    if (!defCountry || !defLanguage || !isValidCountry || !isValidLanguage) {
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
        router.push(`/${minimumDistance.aliasCountry}/${minimumDistance.defaultLanguage}?newUser=true`)
      }, (error) => {
        localStorage.setItem("country",'us'); // local storage country
        localStorage.setItem("language",'en'); // local storage language
        router.push(`/${'us'}/${'en'}?newUser=true`)
      });  
    } else {
      router.push(`/${defCountry}/${defLanguage}`)
    }
  },[]) // eslint-disable-line
}

export default HomeRedirect