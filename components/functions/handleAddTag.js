import { setCurrentSearch } from "../../redux/features/actions/search";
import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";


export const handleAddTag = ( dispatch , currentSearch , tag ) => {
    const prevSearch = currentSearch;
    const newSearch = currentSearch.includes(tag) ? currentSearch : (currentSearch === '' ? tag : `${currentSearch} ${tag}`);
    logEvent(analytics, 'clickAddTag', {
        tag: tag,
        prev_search: prevSearch,
        new_search: newSearch
      });
    dispatch(setCurrentSearch(newSearch))
};
