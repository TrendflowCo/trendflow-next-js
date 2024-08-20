import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";

export const handleSearchQuery = (country, language, val, action, router) => {
    logEvent(analytics, action, {
        search_term: val
    });
    router.push(`/${country}/${language}/results?query=${encodeURIComponent(val)}`);
};