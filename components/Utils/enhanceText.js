export const enhanceText = (string) => {
    console.log(string)
    const firstValue = string.charAt(0).toUpperCase();
    const secondValue = string.slice(1).toLowerCase();
    const finalString = firstValue + secondValue;
    return finalString;
};