import { setCurrentSearch } from "../../redux/features/actions/search";
import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";


export const handleAddTag = (selectedTags, setSelectedTags, tag) => {
    const index = selectedTags.indexOf(tag);
    let newSelectedTags = [...selectedTags];
    if (index === -1) {
        newSelectedTags.push(tag); // Add tag if not present
    } else {
        newSelectedTags.splice(index, 1); // Remove tag if already present
    }
    setSelectedTags(newSelectedTags);
};
