import React, {useState, useEffect} from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import downArrow from '../../../public/icon-flecha-down.svg';
import Image from "next/image";
import { IconButton } from "@mui/material";

const SingleSort = (props) => {
    const {
        index,
        optionsList,
        sorts,
        setSorts
    } = props;
    const [asc, setAsc] = useState(true);
    const [selectedOption , setSelectedOption] = useState('');
    useEffect(() => {
        if (selectedOption !== ''){
            const object = {
                option: selectedOption,
                asc: asc
            };
            const allSorts = [...sorts];
            allSorts[index] = object;
            setSorts(allSorts);
        }
    },[asc,selectedOption]);
    useEffect(() => {
        if (sorts[index].option !== ''){
            setSelectedOption(sorts[index].option);
            setAsc(sorts[index].asc);
        }
    },[])
    return (
        <div className='flex flex-col w-full'>
            <label htmlFor="" className='text-black text-sm font-semibold'>{`Option #${index+1}`}</label>
            <div className="flex flex-row w-full mt-2.5">
                <div className="flex flex-col items-center w-5/6">
                    <select 
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        // style={{backgroundImage: `url(${downArrow.src})`}}
                        className={`outline-none duration-500 cursor-pointer border h-11.5 py-3.5 pr-10 pl-3.5 text-xs ${selectedOption !== '' ? 'border-dokuso-orange' : 'border-dokuso-black'}`}
                        >
                        <option value="" disabled>Select an option</option>
                        {[...optionsList].sort((a, b) => a.option.localeCompare(b.option)).map(item => <option key={item.option} value={item.value}>{(item.option.charAt(0))+ (item.option.toLowerCase()).slice(1)}</option>)}
                    </select>
                </div>
                <div className="h-full w-1/6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setAsc(!asc)}>
                    <IconButton>
                        <ArrowDownwardIcon fontSize="medium" className={`${asc ? 'rotate-0' : 'rotate-180'}`}/>
                    </IconButton>
                    {/* <Image src={downArrow} objectFit='contain' alt="check" className={`${asc ? 'rotate-0' : 'rotate-180'}`}></Image> */}
                </div>
            </div>
        </div>
    )
};

export default SingleSort;