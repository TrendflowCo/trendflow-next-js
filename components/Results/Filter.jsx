import React , {useEffect, useState , useRef} from "react";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import { useRouter } from "next/router";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { enhanceText } from "../Utils/enhanceText";
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setTotalFilters } from "../../redux/features/actions/search";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../services/firebase";


const Filter = (props) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations } = useAppSelector(state => state.language);
    const { setFilterModal , filterModal , availableBrands , currentPriceRange } = props;
    const sectionOptions = ['men','women','kids','home','gift']
    const [onSaleChecked, setOnSaleChecked] = useState(false);
    const [sectionFilter , setSectionFilter] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const priceLimits = { // for query management
        min: currentPriceRange[0],
        max: currentPriceRange[1]
    };
    const [priceRange , setPriceRange] = useState(currentPriceRange); // for edition
    useEffect(() => { // sets price range for filter if it changes
        setPriceRange(currentPriceRange)
    },[currentPriceRange])
    const priceMarks = [ // for range selector marks
        {
            value: currentPriceRange[0],
            label: `$${currentPriceRange[0]}`,
        },
        {
          value: currentPriceRange[1],
          label: `$${currentPriceRange[1]}`,
        },
    ];
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
    const handleSetOnSale = (event) => { // set on sale value
        setOnSaleChecked(event.target.checked);
    };
    const handleChangeSection = (event) => { // set section value
        setSectionFilter(event.target.value);
    };
    const handleChangeBrands = (event) => { // set brands for router
        const { target: { value } } = event;
        const queryBrands = typeof value === 'string' ? value.split(',') : value;
        setSelectedBrands(queryBrands);
    };
    const handleChangePriceRange = (e , newValue) => {
        setPriceRange(newValue)
    }
    const handleApplyFilter = () => {
        let newQuery = {...router.query};
        if (sectionFilter !== '') { // section filtering
            newQuery = {...newQuery, section: sectionFilter}
        }
        if (selectedBrands.length > 0) { // brands filtering
            if (selectedBrands.length > 1) {
                newQuery = {...newQuery , brands: selectedBrands.join(',') }
            } else {
                newQuery = {...newQuery , brands: selectedBrands[0] }
            }
        };
        if(onSaleChecked) { // on sale filtering
            newQuery = {...newQuery , onSale:'true' }
        } else {
            delete newQuery.onSale;
        }
        if (priceRange[0] >= priceLimits.min) {
            newQuery = {...newQuery, minPrice: priceRange[0]}
        }
        if (priceRange[1] <= priceLimits.max) {
            newQuery = {...newQuery, maxPrice: priceRange[1]}
        }
        newQuery = {...newQuery, page: 1}
        logEvent(analytics, 'FilterAndSorting', {
            action: 'Apply_filter'
        });
        router.push({ href: "./", query: newQuery })
    };
    
    const ref = useRef(null);
    // auto close by click outside. Revisit function
    // useEffect(() => {
    //     if (filterModal){
    //         const checkIfClickedOutside = (e) => {
    //             if (filterModal && ref.current && !ref.current.contains(e.target)) {
    //                 setFilterModal(false)
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
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('page');
        router.replace(
            { pathname, query: params.toString() },
            undefined, 
            { shallow: true }
        );
        setOnSaleChecked(false);
        setSectionFilter('');
        setSelectedBrands([]);
        setPriceRange(currentPriceRange);
        logEvent(analytics, 'FilterAndSorting', {
            action: 'Delete_filter'
        });        
    }

    return(
        <>
            {filterModal && <div className="h-full w-full bg-dokuso-black absolute top-0 left-0 z-10 bg-opacity-30"></div>}
            <div 
                className={`px-6 h-full overflow-auto w-full lg:w-1/3 flex flex-col bg-dokuso-white border-l border-l-stamm-gray shadow-2xl top-0 right-0 fixed z-20 pt-[20px] ease-in-out duration-500 ${filterModal ? 'transform translate-none shadow-[-10px_0px_30px_10px_rgba(0,0,0,0.3)]' : 'transform translate-x-full shadow-none'}`} 
                ref={ref}
            >
                { filterModal &&
                <>
                    <div className=" flex flex-row justify-end" >
                        <IconButton onClick={() => setFilterModal(false)}>
                            <CloseIcon fontSize="medium"/>
                        </IconButton>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-2xl font-semibold">{enhanceText(translations?.results?.filters)}</h4>
                    </div>
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold mr-5'>{enhanceText(translations?.results?.on_sale_products)}</label>
                        <Switch
                            checked={onSaleChecked}
                            onChange={handleSetOnSale}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />                    
                    </div>
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold'>{enhanceText(translations?.results?.section)}</label>
                        <Box sx={{ width: '50%' }}>
                            <Select
                                sx={{width: '100%'}}
                                displayEmpty
                                value={sectionFilter}
                                onChange={handleChangeSection}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <span>{enhanceText(translations?.results?.select_section)}</span>;
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
                        <label className='text-black text-sm font-semibold'>{enhanceText(translations?.results?.brands)}</label>
                        <Box sx={{ width: '50%' }}>
                            <Select
                                sx={{width: '100%'}}
                                displayEmpty
                                value={selectedBrands}
                                onChange={handleChangeBrands}
                                multiple
                                renderValue={(selected) => {
                                    if(selected.length === 0) {
                                        return <span>{enhanceText(translations?.results?.select_brands)}</span>
                                    }
                                    
                                    return selected.join(', ').split('-').join(' ')
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
                    <div className='flex flex-row mt-5 items-center justify-between'>
                        <label className='text-black text-sm font-semibold'>{enhanceText(translations?.results?.price_range)}</label>
                        <Box sx={{ width: '50%' , display: 'flex' , flexDirection: 'row' , alignItems: 'center' , justifyContent: 'center' , px: 1.5 }}>
                            <Slider
                                value={priceRange}
                                onChange={handleChangePriceRange}
                                valueLabelDisplay="auto"
                                min={currentPriceRange[0]}
                                max={currentPriceRange[1]}
                                marks={priceMarks}
                            />
                        </Box>
                    </div>
                    <div className="flex flex-col lg:flex-row w-full lg:mt-24 mt-12 mb-8">
                        <button className='bg-gradient-to-r from-dokuso-pink to-dokuso-orange place-self-center w-full text-dokuso-white border border-stamm-primary p-1.5 h-11.5 rounded hover:opacity-80 lg:w-1/2 mb-2.5 lg:mb-0 lg:mr-2.5' onClick={() => handleApplyFilter()}>{enhanceText(translations?.results?.apply_filters)}</button>
                        <button className='bg-dokuso-black place-self-center w-full text-dokuso-white border border-stamm-black p-1.5 h-11.5 rounded hover:opacity-80 lg:w-1/2 mb-2.5 lg:mb-0 lg:ml-2.5' onClick={() => deleteFilter()}>{enhanceText(translations?.results?.delete_filters)}</button>
                    </div>
                </>}
            </div>
        </>
    )
};

export default Filter;