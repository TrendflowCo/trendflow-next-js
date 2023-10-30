export const distanceCalculator = ( latTo , longTo , latFrom , longFrom ) => {
    const longDifference = longTo - longFrom;
    const latDifference = latTo - latFrom;
    const finalDistance = Math.sqrt((Math.pow(longDifference,2)) + (Math.pow(latDifference,2)))
    return finalDistance
};