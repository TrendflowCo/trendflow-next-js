export const countFilters = (filters) => {
    const myFilterArray = Object.values(filters);
    const count = myFilterArray.reduce((acc, value) => {
    if(value.includes('query=') || value === '') {
        return acc;
    }
    return acc + 1;
    }, -4);
    return count;
}; 