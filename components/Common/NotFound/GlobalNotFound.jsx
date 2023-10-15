import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import React from "react";

const GlobalNotFound = () => {
    return (
        <section className="w-full h-full flex flex-col items-center justify-center">
            <HighlightOffRoundedIcon fontSize="large"/>
            <span className="text-xl mt-2">Empty section</span>
        </section>
    )
};

export default GlobalNotFound;