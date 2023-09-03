import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";


export const handleSearchQuery = ( language , val , event , router ) => {
    logEvent(analytics, event, {
        search_term: val
    });      
    // router.push(`/${language}/results?query=${val?.split(' ').join('-').toLowerCase()}`);
    router.push(`/${language}/results?query=${val}`);

};
