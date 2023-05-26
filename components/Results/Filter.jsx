import React , {useEffect, useState , useRef} from "react";
// import downArrow from '../../../public/icon-flecha-down.svg';
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const Filter = ( { setFilterModal , types , creators , statuses , years , months , title , assay , setFilterOptions , filterOptions , setFiltersApplied , filterModal } ) => {
    const ref = useRef(null);
    // const [selectType, setSelectType] = useState('Choose');
    // const [selectCreator, setSelectCreator] = useState('Choose');
    // const [selectStatus, setSelectStatus] = useState('Choose');
    // const [selectYear, setSelectYear] = useState('Choose');
    // const [selectMonth, setSelectMonth] = useState('Choose');
    // const [selectTitle, setSelectTitle] = useState('');
    // const [selectAssay , setSelectAssay] = useState('Choose');
    useEffect(() => {
        if (filterModal){
            let amount = 0;
            // if (filterOptions.types != types) {
            //     setSelectType(filterOptions.types[0])
            // }
            // if (filterOptions.status != statuses) {
            //     setSelectStatus(filterOptions.status[0])
            // }
            // if (filterOptions.creators!= creators) {
            //     setSelectCreator(filterOptions.creators[0]._id)
            // }
            // if (filterOptions.years != years) {
            //     setSelectYear(filterOptions.years[0])
            // }
            // if (filterOptions.months != months) {
            //     setSelectMonth(filterOptions.months[0])
            // }
            // if (filterOptions.title != title) {
            //     setSelectTitle(filterOptions.title)
            // }
            // if (filterOptions.assay != assay) {
            //     setSelectAssay(filterOptions.assay)
            // }
            // if (selectStatus !== 'Choose'){
            //     amount += 1
            // }
            // if(selectTitle !== '') {
            //     amount += 1
            // }
            // if(selectAssay !== 'Choose') {
            //     amount += 1
            // }
            // if(selectType !== 'Choose') {
            //     amount += 1
            // }
            // if(selectCreator !== 'Choose') {
            //     amount += 1
            // }
            // if(selectYear !== 'Choose') {
            //     amount += 1
            // }
            // if(selectMonth !== 'Choose') {
            //     amount += 1
            // }
            // setFiltersApplied(amount);

            const checkIfClickedOutside = (e) => {
                if (filterModal && ref.current && !ref.current.contains(e.target)) {
                setFilterModal(false)
                }
            }
            document.addEventListener("mousedown", checkIfClickedOutside)
            return () => {
                document.removeEventListener("mousedown", checkIfClickedOutside)
            }
        }
  
    },[filterModal])    
    // const changeStatus = (e) => {
    //     const newVector = {...filterOptions,status:[e]};
    //     setSelectStatus(e);
    //     setFilterOptions(newVector);
    // }
    // const changeCreator = (e) => {
    //     const newVector = {...filterOptions,creators:[creators[creators.findIndex(item => item._id === e)]]};
    //     setSelectCreator(e);
    //     setFilterOptions(newVector);
    // }
    // const changeType = (e) => {
    //     const newVector = {...filterOptions,types:[e]};
    //     setSelectType(e);
    //     setFilterOptions(newVector);
    // }
    // const changeYear = (e) => {
    //     const newVector = {...filterOptions,years:[parseInt(e)]};
    //     setSelectYear(parseInt(e));
    //     setFilterOptions(newVector);
    // };
    // const changeMonth = (e) => {
    //     const newVector = {...filterOptions,months:[parseInt(e)]};
    //     setSelectMonth(parseInt(e));
    //     setFilterOptions(newVector);
    // };
    // const changeTitle = (e) => {
    //     const newVector = {...filterOptions,title: e.toLowerCase()};
    //     setSelectTitle(e.toLowerCase());
    //     setFilterOptions(newVector);
    // };
    // const changeAssay = (e) => {
    //     const newVector = {...filterOptions,assay:[e]};
    //     setSelectAssay(e);
    //     setFilterOptions(newVector);
    // }

    // const deleteFilter = () => {
    //     const newVector = {
    //         creators: creators,
    //         types: types,
    //         status: statuses,
    //         years: years,
    //         months: months,
    //         title: title,
    //         assay: assay
    //     };
    //     setSelectStatus('Choose');
    //     setSelectCreator('Choose');
    //     setSelectType('Choose');
    //     setSelectYear('Choose');
    //     setSelectMonth('Choose');
    //     setSelectTitle('');
    //     setSelectAssay('Choose');
    //     setFilterOptions(newVector);
    //     setFiltersApplied(0)
    // }
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
                    {/* <div className='flex flex-col mt-5 lg:ml-2.5 lg:pr-2.5'>
                        <label htmlFor="" className='text-black text-sm font-semibold'>Id</label>
                        <div>
                            <input value={selectTitle}
                                placeholder='Type a title'
                                onChange={(e) => changeTitle(e.target.value)}
                                className={`w-full outline-none duration-500 border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectTitle != '' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                >
                            </input>
                        </div>
                    </div> */}
                    {/* <div className='flex flex-col mt-5 lg:ml-2.5 lg:pr-2.5'>
                        <label htmlFor="" className='text-black text-sm font-semibold'>Type</label>
                        <div>
                            <select value={selectType}
                                onChange={(e) => changeType(e.target.value)}
                                style={{backgroundImage: `url(${downArrow.src})`}}
                                className={`selectSpecial outline-none duration-500 cursor-pointer border bg-stamm-white rounded-15 h-11.5 py-3.5 pr-10 pl-3.5 mt-2.5 text-xs ${selectType != 'Choose' ? 'border-stamm-primary shadow' : 'border-stamm-gray'}`}
                                >
                                <option value="Choose" disabled>Choose</option>
                                {[...types].sort((a, b) => a.localeCompare(b)).map(item => <option key={item} value={item}>{(item.charAt(0))+ (item.toLowerCase()).slice(1)}</option>)}
                            </select>
                        </div>
                    </div> */}
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
                    {/* <div className="flex flex-col lg:flex-row w-full lg:mt-24 mt-12 mb-8">
                        <button className='bg-stamm-primary place-self-center w-full text-stamm-white border border-stamm-primary p-1.5 h-11.5 rounded-15 hover:opacity-80 lg:w-[352px] mb-2.5 lg:mb-0 lg:mr-2.5' onClick={() => setFilterModal(false)}>Apply Filters</button>
                        <button className='bg-stamm-black place-self-center w-full text-stamm-white border border-stamm-black p-1.5 h-11.5 rounded-15 hover:opacity-80 lg:w-[352px] lg:ml-2.5' onClick={() => deleteFilter()}>Delete Filters</button>
                    </div> */}
                </>}
            </div>
        </>
    )
};

export default Filter;