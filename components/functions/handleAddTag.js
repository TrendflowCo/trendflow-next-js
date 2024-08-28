import { setCurrentSearch } from "../../redux/features/actions/search";
import { logAnalyticsEvent } from "../../services/firebase";

export const handleAddTag = (selectedTags, setSelectedTags, tag) => {
    const index = selectedTags.indexOf(tag);
    let newSelectedTags = [...selectedTags];
    if (index === -1) {
        newSelectedTags.push(tag); // Add tag if not present
        logAnalyticsEvent('add_tag', { tag: tag });
    } else {
        newSelectedTags.splice(index, 1); // Remove tag if already present
        logAnalyticsEvent('remove_tag', { tag: tag });
    }
    setSelectedTags(newSelectedTags);
};