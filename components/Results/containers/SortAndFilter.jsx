import React, { useEffect, useState } from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Button, ThemeProvider } from "@mui/material";
import { muiColors } from "../../Utils/muiTheme";
import { useAppSelector } from "../../../redux/hooks";
import { enhanceText } from "../../Utils/enhanceText";
import { useRouter } from "next/router";
import { logAnalyticsEvent } from "../../../services/firebase";

const SortAndFilter = (props) => {
    const { totalFilters } = useAppSelector ( state => state.search);
    const { translations } = useAppSelector( state => state.region);
    const {
        setFilterModal,
        setSortingModal
    } = props;
    const [totalSorts , setTotalSorts] = useState(0);
    const router = useRouter();
    const handleOpenFilterModal = () => { // function for opening filter modal
        logAnalyticsEvent('FilterAndSorting', {
            action: 'Get_into_filters'
        });    
        setFilterModal(true);
    };
    const handleOpenSortingModal = () => { // function for opening sorting modal
        logAnalyticsEvent('FilterAndSorting', {
            action: 'Get_into_sortings'
        });    
        setSortingModal(true);
    };
    useEffect(() => {
        if(router.query.sortBy) {
            setTotalSorts(1);
        } else {
            setTotalSorts(0);
        }

    },[router.query.sortBy])
    return (
        <section id='filtersContainer' className={`mt-5 mb-2 lg:mt-0 lg:mr-4 lg:w-max flex flex-row justify-evenly lg:justify-between lg:border-none px-4 lg:px-0`}>
            <ThemeProvider theme={muiColors}>
                <Button variant="outlined" sx={{
                    width: {lg: '228px' , xs: '50%'} , 
                    height: '46px' , 
                    mr: {lg: '8px' , xs: 0}, 
                    display: 'flex' , 
                    flexDirection: 'row' ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    }}
                    color="trendflowBlack"
                    onClick={() => handleOpenFilterModal()}
                    startIcon={<FilterAltIcon/>}
                >
                    <span>{enhanceText(translations?.results?.filters)}</span>
                    {totalFilters > 0 && 
                        <div className='ml-2 flex flex-col items-center justify-center bg-trendflow-pink w-6 h-6 rounded-full'>
                            <span className='font-bold text-trendflow-white'>{totalFilters}</span>
                        </div>
                    }
                </Button>
                <Button variant="outlined" sx={{
                    width: {lg: '228px' , xs: '50%'} , 
                    height: '46px' , 
                    ml: {lg: '8px' , xs: 0}, 
                    display: 'flex' , 
                    flexDirection: 'row' ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    }}
                    color="trendflowBlack"
                    onClick={() => handleOpenSortingModal()}
                    startIcon={<SortIcon/>}
                >
                    <span>{enhanceText(translations?.results?.sorts)}</span>
                    {totalSorts > 0 && 
                        <div className='ml-2 flex flex-col items-center justify-center bg-trendflow-pink w-6 h-6 rounded-full'>
                            <span className='font-bold text-trendflow-white'>{totalSorts}</span>
                        </div>
                    }
                </Button>
            </ThemeProvider>
        </section>
    )
};

export default SortAndFilter;