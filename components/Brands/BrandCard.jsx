import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Tooltip } from "@mui/material";

const BrandCard = ({brand}) => {
    const {language} = useAppSelector(state => state.language);
    const handleSearchBrand = (brand) => {
        window.open(`/${language}/results?brands=${encodeURIComponent(brand)}`, '_ blank') 
    };
    return (
        <Tooltip title={`Visit ${brand}`}>
            <button 
                className="p-4 flex flex-col items-center justify-center font-semibold items-center cursor-pointer rounded-lg hover:shadow hover:text-dokuso-pink hover:underline"
                onClick={() => {handleSearchBrand(brand)}}
            >
                {brand}
            </button>
        </Tooltip>
    )
};

export default BrandCard;