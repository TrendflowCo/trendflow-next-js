import React , {useEffect, useState , useRef} from "react";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import { useRouter } from "next/router";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { enhanceText } from "../Utils/enhanceText";
import { useAppDispatch } from "../../redux/hooks";
import { setTotalFilters } from "../../redux/features/actions/search";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const Filter = (props) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { setFilterModal , filterModal , availableBrands } = props;
    const sectionOptions = ['men','women','kids','home','gift']
    const [onSaleChecked, setOnSaleChecked] = useState(false);
    const [sectionFilter , setSectionFilter] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        let finalFilterAmount = 0;
        if(onSaleChecked) {
            finalFilterAmount += 1
        };
        if (sectionFilter !== '') {
            finalFilterAmount += 1
        }
        if (selectedBrands.length > 0) {
            finalFilterAmount += 1
        }
        dispatch(setTotalFilters(finalFilterAmount));
    },[onSaleChecked , sectionFilter , selectedBrands])

    const handleSetOnSale = (event) => {
        setOnSaleChecked(event.target.checked);
        if (event.target.checked === true) {
            router.push({ href: "./", query: { ...router.query, onSale:'true' } })
        } else {
            const { pathname, query } = router;
            const params = new URLSearchParams(query);
            params.delete('onSale');
            router.replace(
                { pathname, query: params.toString() },
                undefined, 
                { shallow: true }
            );
        }
    };
    const handleChangeSection = (event) => {
        setSectionFilter(event.target.value);
        router.push({ href: "./", query: { ...router.query, section: event.target.value } })
    };
    const handleChangeBrands = (event) => {
        const { target: { value } } = event;
        const queryBrands = typeof value === 'string' ? value.split(',') : value;
        console.log('query brands: ', queryBrands)
        setSelectedBrands(queryBrands);
        if (selectedBrands.length > 0) {
            router.replace({
                query: { ...router.query, brands: queryBrands.join(',') },
            });
        } else {
            router.push({ href: "./", query: { ...router.query, brands: queryBrands[0] } })
        }
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    
    const ref = useRef(null);
    // auto close by click outside. Revisit function
    // useEffect(() => {
    //     if (filterModal){
    //         const checkIfClickedOutside = (e) => {
    //             if (filterModal && ref.current && !ref.current.contains(e.target)) {
    //             setFilterModal(false)
    //             }
    //         }
    //         document.addEventListener("mousedown", checkIfClickedOutside)
    //         return () => {
    //             document.removeEventListener("mousedown", checkIfClickedOutside)
    //         }
    //     }
    // },[filterModal]);
    const deleteFilter = () => {
        const { pathname, query } = router;
        const params = new URLSearchParams(query);
        params.delete('onSale');
        params.delete('section');
        params.delete('brands');
        router.replace(
            { pathname, query: params.toString() },
            undefined, 
            { shallow: true }
        );
        setOnSaleChecked(false);
        setSectionFilter('');
        setSelectedBrands([]);
    }

    return(
        <>
            {filterModal && <div className="h-full w-full bg-dokuso-black absolute top-0 left-0 z-10 bg-opacity-30"></div>}
            <div className={`px-6 h-full overflow-auto w-full lg:w-1/3 flex flex-col bg-dokuso-white border-l border-l-stamm-gray shadow-2xl top-0 right-0 fixed z-20 pt-[20px] ease-in-out duration-500 ${filterModal ? 'transform translate-none shadow-[-10px_0px_30px_10px_rgba(0,0,0,0.3)]' : 'transform translate-x-full shadow-none'}`} ref={ref}>
                { filterModal &&
                <>
                    <div className=" flex flex-row justify-end" >
                        <IconButton onClick={() => setFilterModal(false)}>
                            <CloseIcon fontSize="medium"/>
                        </IconButton>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-2xl font-semibold">Filters</h4>
                    </div>
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold mr-5'>On sale products</label>
                        <Switch
                            checked={onSaleChecked}
                            onChange={handleSetOnSale}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />                    
                    </div>
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold'>Section</label>
                        <Box sx={{ width: '50%' }}>
                            <Select
                                sx={{width: '100%'}}
                                displayEmpty
                                value={sectionFilter}
                                onChange={handleChangeSection}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <span>Select section</span>;
                                    }
                                    return enhanceText(selected);
                                }}
                            >
                                {[...sectionOptions].sort((a,b) => a.localeCompare(b)).map(item => 
                                    <MenuItem key={item} value={item}>{enhanceText(item)}</MenuItem>
                                )}
                            </Select>
                        </Box>
                    </div>
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold'>Brands</label>
                        <Box sx={{ width: '50%' }}>
                            <Select
                                sx={{width: '100%'}}
                                displayEmpty
                                value={selectedBrands}
                                onChange={handleChangeBrands}
                                multiple
                                renderValue={(selected) => {
                                    if(selected.length === 0) {
                                        return <span>Select brands</span>
                                    }
                                    return selected.join(', ')
                                }}
                                MenuProps={MenuProps}
                            >
                                {[...availableBrands].sort((a,b) => a.localeCompare(b)).map((brand) => (
                                <MenuItem key={brand} value={brand.split(' ').join('-')}>
                                    <Checkbox checked={selectedBrands.indexOf(brand.split(' ').join('-')) > -1} />
                                    <ListItemText primary={brand} />
                                </MenuItem>
                            ))}                                
                            </Select>
                        </Box>
                    </div>
                    {/* <div className='flex flex-col mt-5 lg:ml-2.5 lg:pr-2.5'>
                        <label htmlFor="" className='text-black text-sm font-semibold'>Status</label>
                        <div>
                            <select value={selectStatus}
                                onChange={(e) => changeStatus(e.target.value)}
                                style={{backgroundImage: `url(${downArrow.src})`}}
                                className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectStatus != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                >
                                <option value="Choose" disabled>Choose</option>
                                {[...statuses].sort((a, b) => a.localeCompare(b)).map(item => <option key={item} value={item}>{(item.split('_').join(' ')).charAt(0) + (item.toLowerCase().split('_').join(' ')).slice(1)}</option>)}
                            </select>
                        </div>
                    </div> */}
                    {/* <div className='flex flex-col mt-5 lg:ml-2.5 lg:pr-2.5'>
                        <label htmlFor="" className='text-black text-sm font-semibold'>Assay</label>
                        <div>
                            <select value={selectAssay}
                                onChange={(e) => changeAssay(e.target.value)}
                                style={{backgroundImage: `url(${downArrow.src})`}}
                                className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectAssay != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                >
                                <option value="Choose" disabled>Choose</option>
                                {[...assay].sort((a, b) => a.localeCompare(b)).map(item => <option key={item} value={item}>{ item === '' ? 'N/A' :  (item.split('_').join(' ')).charAt(0) + (item.toLowerCase().split('_').join(' ')).slice(1)}</option>)}
                            </select>
                        </div>
                    </div> */}
                    {/* <div className='flex flex-col mt-5 lg:ml-2.5 lg:pr-2.5'>
                        <label htmlFor="" className='text-black text-sm font-semibold'>Creator</label>
                        <div>
                            <select value={selectCreator}
                                onChange={(e) => changeCreator(e.target.value)}
                                style={{backgroundImage: `url(${downArrow.src})`}}
                                className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectCreator != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                >
                                <option value="Choose" disabled>Choose</option>
                                {[...creators].sort((a, b) => a.name.localeCompare(b.name)).map(item => <option key={item._id} value={item._id}>{`${item.name} ${item.lastName}`}</option>)}
                            </select>
                        </div>
                    </div> */}
                    {/* <div className="flex flex-row mt-5 lg:ml-2.5 lg:pr-2.5">
                        <div className='flex flex-col w-1/2 mr-2.5'>
                            <label htmlFor="" className='text-black text-sm font-semibold'>Year</label>
                            <div>
                                <select value={selectYear}
                                    onChange={(e) => changeYear(e.target.value)}
                                    style={{backgroundImage: `url(${downArrow.src})`}}
                                    className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectYear != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                    >
                                    <option value="Choose" disabled>Choose</option>
                                    {[...years].sort((a, b) => a - b).map(item => <option key={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col ml-2.5 w-1/2'>
                            <label htmlFor="" className='text-black text-sm font-semibold'>Month</label>
                            <div>
                                <select value={selectMonth}
                                    onChange={(e) => changeMonth(e.target.value)}
                                    style={{backgroundImage: `url(${downArrow.src})`}}
                                    className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectMonth != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                    >
                                    <option value="Choose" disabled>Choose</option>
                                    {[...months].sort((a, b) => a - b).map(item => <option key={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex flex-col lg:flex-row w-full lg:mt-24 mt-12 mb-8">
                        {/* <button className='bg-dokuso-pink place-self-center w-full text-dokuso-white border border-stamm-primary p-1.5 h-11.5 rounded hover:opacity-80 lg:w-[352px] mb-2.5 lg:mb-0 lg:mr-2.5' onClick={() => setFilterModal(false)}>Apply Filters</button> */}
                        <button className='bg-dokuso-black place-self-center w-full text-dokuso-white border border-stamm-black p-1.5 h-11.5 rounded hover:opacity-80 lg:w-full' onClick={() => deleteFilter()}>Delete Filters</button>
                    </div>
                </>}
            </div>
        </>
    )
};

export default Filter;