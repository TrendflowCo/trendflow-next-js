import React , {useEffect, useState , useRef} from "react";
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton , ThemeProvider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SingleSort from './SingleSort';
import { muiColors } from "../Utils/muiTheme";

const Sort = ( props ) => {
    const { // -- traigo las props --
        sortingModal,
        setSortingModal, 
        setSortsApplied,
        sorts,
        setSorts,
        availableSorts,
        setAvailableSorts
    } = props;
    const [optionsList, setOptionsList] = useState([ // define names to be used
        {
            option: 'Brand',
            value: 'brand'
        },
        {
            option: 'Section',
            value: 'section'
        },
        {
            option: 'Price',
            value: 'price_float'
        },
    ]);
    const ref = useRef(null);
    useEffect(() => { // for closing by an outside click
        let amount = 0;
        const checkIfClickedOutside = (e) => {
            if (sortingModal && ref.current && !ref.current.contains(e.target)) {
              setSortingModal(false)
            }
          }
          document.addEventListener("mousedown", checkIfClickedOutside)
          return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
          }
  
    },[sortingModal , setSortingModal]);
    useEffect(()=>{ // refreshes the sortings amount
        let amount = 0;
        sorts.forEach((item) => {
            if(item.option !== ''){
                amount += 1
            }
        })
        setSortsApplied(amount)
    },[sorts]);
    const handlePlusSort = () => { // add a sort
        if (!optionsList.length < 1){
            setAvailableSorts(availableSorts + 1);
            const newSort = {
                option: '',
                asc: true
            };
            const toAppendSort = [...sorts];
            toAppendSort.push(newSort);
            setSorts(toAppendSort);
        }
    }
    const deleteSorting = () => { // delete all sorts by a click
        setSortsApplied([]);
        setAvailableSorts(0);
        setSorts([])
    }
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
                            <h4 className="text-2xl font-semibold">Sort by</h4>
                        </div>
                        {[...Array(availableSorts).keys()].map((item, index) => {return (
                            <div key={index} className='flex flex-col mt-5 lg:px-2.5 w-full'>
                                {/* Single component to be mapped */}
                                <SingleSort 
                                    index={index} 
                                    optionsList={optionsList} 
                                    sorts={sorts}
                                    setSorts={setSorts}
                                />
                            </div>
                        )})}
                        <div className='mt-5 cursor-pointer lg:flex lg:flex-col lg:w-1/6 lg:justify-center lg:items-center'>
                            <IconButton onClick={() => handlePlusSort()}>
                                <AddIcon fontSize="medium"/>
                            </IconButton>
                            {/* <Image src={iconAdd} alt="menu" height={25} width={25} onClick={() => handlePlusSort()} /> */}
                        </div>
                        <div className="flex flex-col lg:flex-row w-full lg:mt-24 mt-12 mb-8">
                            <ThemeProvider theme={muiColors}>
                                <Button variant="outlined" sx={{
                                    width: {lg: '50%' , xs: '100%'} , 
                                    height: '46px' , 
                                    ml: {lg: '8px' , xs: 0}, 
                                    display: 'flex' , 
                                    flexDirection: 'row' ,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2 }}
                                    color="dokusoBlack"
                                    onClick={() => setSortingModal(false)}
                                    // fullWidth={{sx: true , lg: false}}
                                >
                                    Apply Sorting
                                </Button>
                                <Button variant="outlined" sx={{
                                    width: {lg: '50%' , xs: '100%'} , 
                                    height: '46px' , 
                                    ml: {lg: '8px' , xs: 0}, 
                                    display: 'flex' , 
                                    flexDirection: 'row' ,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2 }}
                                    color="dokusoBlack"
                                    onClick={() => deleteSorting()}
                                    // fullWidth={{sx: true , lg: false}}
                                >
                                    Delete Sorting
                                </Button>
                            </ThemeProvider>

                        </div>
                    </>
                }
            </div>
        </>
    )
};

export default Sort;