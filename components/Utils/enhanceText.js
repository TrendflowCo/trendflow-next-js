export const enhanceText = (string) => {
    if(string === undefined) {
        return 'N/A'
    } else {
        const trimBefore = string.trim();
        const firstValue = trimBefore.charAt(0).toUpperCase();
        const secondValue = trimBefore.slice(1).toLowerCase();
        const finalString = firstValue + secondValue;
        return finalString;    
    }
};