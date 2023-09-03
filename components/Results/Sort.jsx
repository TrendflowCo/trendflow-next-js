import React , { useState , useRef } from "react";
import { Box , IconButton , MenuItem, Select } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from "../../redux/hooks";
import { enhanceText } from "../Utils/enhanceText";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useRouter } from "next/router";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../services/firebase";

const Sort = ( props ) => {
    const router = useRouter();
    const { translations } = useAppSelector(state =>state.language);
    const { sortingModal , setSortingModal , deviceWidth } = props;
    const optionsList = [{
        text: translations?.results?.price,
        value: 'price'
    },
    {
        text: translations?.results?.section,
        value: 'category'
    },
    {
        text: translations?.results?.brand,
        value: 'brand'
    }];
    const [selectedSort , setSelectedSort] = useState('');
    const [ascending , setAscending] = useState(true);
    const ref = useRef(null);
    const handleChangeSort = (event) => { // set section value
        setSelectedSort(event.target.value);
    };
    const deleteSorting = () => {
        const { pathname, query } = router;
        const params = new URLSearchParams(query);
        params.delete('sortBy');
        params.delete('ascending');
        params.delete('page');
        router.replace(
            { pathname, query: params.toString() },
            undefined, 
            { shallow: true }
        );
        logEvent(analytics, 'FilterAndSorting', {
            action: 'Delete_sorting'
        });        
        setSelectedSort('');
        setAscending(true);
        if (deviceWidth < 1024) {
            setSortingModal(false);
        }       
    }
    const handleChangeAscending = () => {
        setAscending(!ascending);
    };
    const handleApplySorting = () => {
        if(selectedSort !== '') {
            logEvent(analytics, 'FilterAndSorting', {
                action: 'Apply_sorting'
            });        
            let newQuery = {...router.query};
            if(ascending) { // on sale filtering
                newQuery = {...newQuery , ascending:'true' }
            } else {
                delete newQuery.ascending;
            }
            newQuery = {...newQuery, sortBy: selectedSort}
            newQuery = {...newQuery, page: 1}
            router.push({ href: "./", query: newQuery }) 
            if (deviceWidth < 1024) {
                setSortingModal(false);
            };       
        }
    };

    return(
        <>
            {sortingModal && <div className="h-full w-full bg-dokuso-black absolute top-0 left-0 z-10 bg-opacity-30"></div>}
            <div className={`px-6 h-full overflow-auto w-full lg:w-1/3 flex flex-col bg-dokuso-white border-l border-l-stamm-gray shadow-2xl top-0 right-0 fixed z-20 pt-[20px] ease-in-out duration-500 ${sortingModal ? 'transform translate-none shadow-[-10px_0px_30px_10px_rgba(0,0,0,0.3)]' : 'transform translate-x-full shadow-none'}`} ref={ref}>
                { sortingModal && 
                    <>
                        <div className=" flex flex-row justify-end" >
                            <IconButton onClick={() => setSortingModal(false)}>
                                <CloseIcon fontSize="medium"/>
                            </IconButton>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-2xl font-semibold">{enhanceText(translations?.results?.sort_by)}</h4>
                        </div>
                        <div className='flex flex-row mt-5 items-center justify-between'>
                            <Box sx={{ width: '80%' }}>
                                <Select
                                    sx={{width: '100%'}}
                                    displayEmpty
                                    value={selectedSort}
                                    onChange={handleChangeSort}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <span>{enhanceText(translations?.results?.sort_by)}</span>;
                                        }
                                        return enhanceText(translations?.results?.[selected]);
                                    }}
                                >
                                    {[...optionsList].sort((a,b) => a.text.localeCompare(b.text)).map(item => 
                                        <MenuItem key={item.value} value={item.value}>{enhanceText(item.text)}</MenuItem>
                                    )}
                                </Select>
                            </Box>
                            <div className="w-[20%] flex flex-col items-end justify-center">
                                <IconButton onClick={() => handleChangeAscending()}>
                                    {ascending ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
                                </IconButton>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row w-full lg:mt-24 mt-12 mb-8">
                            <button className='bg-gradient-to-r from-dokuso-pink to-dokuso-orange place-self-center w-full text-dokuso-white border border-stamm-primary p-1.5 h-11.5 rounded hover:opacity-80 lg:w-1/2 mb-2.5 lg:mb-0 lg:mr-2.5' onClick={() => handleApplySorting()}>{enhanceText(translations?.results?.apply_sorting)}</button>
                            <button className='bg-dokuso-black place-self-center w-full text-dokuso-white border border-stamm-black p-1.5 h-11.5 rounded hover:opacity-80 lg:w-1/2 mb-2.5 lg:mb-0 lg:ml-2.5' onClick={() => deleteSorting()}>{enhanceText(translations?.results?.delete_sorting)}</button>
                        </div>
                    </>
                }
            </div>
        </>
    )
};

export default Sort;