const filterAndSorting = ( rawResults, filterOptions , sortsApplied , sorts ) => {
    // brings all devices and generates the displayed list
    // const newAllResults = rawResults.filter(item => filterOptions.status.includes(item.status));
    // const newAllResults1 = newAllResults.filter(item => filterOptions.types.includes(item.type));
    // const newAllResults2 = newAllResults1.filter(item => filterOptions.creators.map(creator => creator._id).includes(item.creator));
    // const newAllResults3 = newAllResults2.filter(item => filterOptions.years.includes(new Date(item.creation_date).getFullYear()));
    // const newAllResults4 = newAllResults3.filter(item => filterOptions.months.includes(new Date(item.creation_date).getMonth() + 1));
    // const newAllResults5 = newAllResults4.filter(item => filterOptions.assay.includes(item.related_assay));
    // const newAllResults6 = [];
    // if (filterOptions.title === '') {
    //     newAllResults6 = newAllResults5
    // } else {
    //     newAllResults6 = newAllResults5.filter(item => item.id.toLowerCase().includes(filterOptions.title));
    // }
    // // --- start sorting methods
    let finalResults = rawResults.sort((a,b) => b.date - a.date); // initially sorted by date
    if (sortsApplied > 0){
        const array = [...Array(sortsApplied).keys()]
        array.forEach((item, index) => {
            if (sorts[index].option === 'brand' || sorts[index].option==='section' || sorts[index].option==='price_float') {
                const value = sorts[index].option
                if (sorts[index].asc === true){
                    value === 'price_float' ? finalResults.sort((a,b) => b[value] - a[value]) : finalResults.sort((a,b) => a[value].localeCompare(b[value]))
                } else {
                    value === 'price_float' ? finalResults.sort((a,b) => a[value] - b[value]) : finalResults.sort((a,b) => b[value].localeCompare(a[value]))
                }
            }
        })
    }
    return { finalResults }
};

export default filterAndSorting;
