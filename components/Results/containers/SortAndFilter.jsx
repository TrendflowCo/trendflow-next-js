import React from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Button, ThemeProvider } from "@mui/material";
import { muiColors } from "../../Utils/muiTheme";
import { useAppSelector } from "../../../redux/hooks";

const SortAndFilter = (props) => {
    const { totalFilters } = useAppSelector ( state => state.search);
    const {
        sortsApplied,
        setFilterModal,
        setSortingModal
    } = props;
    const handleOpenFilterModal = () => { // function for opening filter modal
        setFilterModal(true);
    };
    const handleOpenSortingModal = () => { // function for opening sorting modal
        setSortingModal(true);
    };
    return (
        <section id='filtersContainer' className={`mt-5 mb-2 lg:mt-0 lg:mr-4 lg:w-max flex flex-row justify-evenly lg:justify-between lg:border-none px-4 lg:px-0`}>
            <ThemeProvider theme={muiColors}>
                <Button variant="outlined" sx={{
                    width: {lg: '228px' , xs: '50%'} , 
                    height: '46px' , 
                    mr: {lg: '8px' , sx: 0}, 
                    display: 'flex' , 
                    flexDirection: 'row' ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    }}
                    color="dokusoBlack"
                    onClick={() => handleOpenFilterModal()}
                    startIcon={<FilterAltIcon/>}
                >
                    <span>Filters</span>
                    {totalFilters > 0 && 
                        <div className='ml-2 flex flex-col items-center justify-center bg-dokuso-pink w-6 h-6 rounded-full'>
                            <span className='font-bold text-dokuso-white'>{totalFilters}</span>
                        </div>
                    }
                </Button>
                <Button variant="outlined" sx={{
                    width: {lg: '228px' , xs: '50%'} , 
                    height: '46px' , 
                    ml: {lg: '8px' , sx: 0}, 
                    display: 'flex' , 
                    flexDirection: 'row' ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2 }}
                    color="dokusoBlack"
                    onClick={() => handleOpenSortingModal()}
                    startIcon={<SortIcon/>}
                >
                    <span>Sorts</span>
                    {sortsApplied > 0 && 
                        <div className='ml-2 flex flex-col items-center justify-center bg-dokuso-pink w-6 h-6 rounded-full'>
                            <span className='font-bold text-dokuso-white'>{sortsApplied}</span>
                        </div>
                    }
                </Button>
            </ThemeProvider>
        </section>
    )
};

export default SortAndFilter;