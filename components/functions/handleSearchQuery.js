import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";


export const handleSearchQuery = ( language , val , event , router ) => {
    logEvent(analytics, event, {
        search_term: val
    });
    if(router.pathname === '/[lan]/results') {
        let newQuery = {...router.query};
        newQuery = {...newQuery, query: val};
        router.push({ href: "./", query: newQuery })
    } else {
        router.push(`/${language}/results?query=${encodeURIComponent(val)}`);
    }
};
