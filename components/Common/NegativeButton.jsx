import { CircularProgress } from "@mui/material";
import React from "react";

const NegativeButton = ({ widths , text , handleClick , loading }) => {
    return (
        <button 
            className={`flex flex-col items-center justify-center ${widths} bg-dokuso-black h-10 rounded text-dokuso-white hover:bg-opacity-70 transition-colors duration-300 xl:mx-2 xl:first:ml-0 xl:last:mr-0 mt-4 xl:mt-0`}
            disabled={loading} 
            onClick={() => {handleClick()}}>
            {loading ? <CircularProgress size={24} thickness={4} sx={{color: "#FAFAFA"}}/> : text}
        </button>
    )
};

export default NegativeButton