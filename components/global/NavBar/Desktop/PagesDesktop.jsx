import { Box } from "@mui/material";
import React from "react";
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../../redux/hooks";
import { setCurrentSearch } from "../../../../redux/features/actions/search";
import { handleSearchQuery } from "../../../functions/handleSearchQuery";

const PagesDesktop = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { language , translations , country } = useAppSelector(state => state.region)
    
    const handleSearchRandom = () => {
        const values = Object.values(translations?.prompts);
        const currentLength = values.length - 1;
        const random = Math.random();
        const finalValue = parseInt(random*(currentLength));
        handleQuickSearch(values[finalValue])
    };

    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        handleSearchQuery( country , language , val , 'clickOnPopularSearches' , router)
    };
    
    return (
        <section className="hidden md:flex w-full">
            <button
            onClick={handleSearchRandom}
            className='p-2 rounded bg-gradient-to-r from-dokuso-pink to-dokuso-blue text-dokuso-white hover:bg-gradient-to-r hover:from-dokuso-pink hover:to-dokuso-orange hover:text-dokuso-black shadow-lg font-semibold'
            >
                {translations?.explore}
            </button>
        </section>
    )
};

export default PagesDesktop;