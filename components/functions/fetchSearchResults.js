import { logAnalyticsEvent } from "../../services/firebase";
import { endpoints } from "../../config/endpoints";

export const fetchSearchResults = async (country, language, query, event) => {
    logAnalyticsEvent(event, {
        search_term: query
    });
    const url = `${endpoints('results')}&query=${query}&limit=10`;
    // const url = `/api/search?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const text = await response.text(); // First get the response as text
        try {
            const data = JSON.parse(text); // Try parsing it as JSON
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            return data;
        } catch (err) {
            // If JSON parsing fails, log the text to see what it is
            console.error("Failed to parse JSON, response was:", text);
            throw new Error("Response was not valid JSON.");
        }
    } catch (error) {
        console.error("Error fetching search data:", error.message);
        return { results: [] }; // Return empty results in case of error
    }
};