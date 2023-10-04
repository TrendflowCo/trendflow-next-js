import { CircularProgress } from "@mui/material";
import React from "react";

const PrimaryFunctionButton = ({ widths , text , handleClick , loading }) => {
    return (
        <button 
            className={`${widths} bg-stamm-primary h-11.5 rounded-15 text-stamm-white hover:bg-stamm-black transition-colors duration-300 flex flex-col items-center justify-center shadow`} 
            disabled={loading}
            onClick={() => {handleClick()}}>
            {loading ? <CircularProgress size={24} thickness={4} sx={{color: "#F9F9F9"}}/> : text}
        </button>
    )
};

export default PrimaryFunctionButton