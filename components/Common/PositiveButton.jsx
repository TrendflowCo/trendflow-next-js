import { CircularProgress } from "@mui/material";
import React from "react";

const PositiveButton = ({ widths , text , handleClick , loading }) => {
    return (
        <button disabled={loading} className={`${widths} bg-trendflow-pink flex flex-col items-center justify-center h-10 rounded text-trendflow-white hover:bg-opacity-70 transition-colors duration-300 xl:mx-2 xl:first:ml-0 xl:last:mr-0 mt-4 xl:mt-0`} onClick={() => {handleClick()}}>
            { loading ? <CircularProgress size={24} thickness={4} sx={{color: "#FAFAFA"}}/> : text }
        </button>
    )
};

export default PositiveButton