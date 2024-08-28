import { logAnalyticsEvent } from "../../services/firebase";

export const handleSearchQuery = (country, language, val, action, router) => {
    logAnalyticsEvent(action, {
        search_term: val
    });
    router.push(`/${country}/${language}/results?query=${encodeURIComponent(val)}`);
};