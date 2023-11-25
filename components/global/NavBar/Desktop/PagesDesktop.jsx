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
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={handleSearchRandom}
              sx={{ my: 2 , color:'inherit' }}
              className='bg-gradient-to-r from-dokuso-pink to-dokuso-blue text-dokuso-white hover:bg-gradient-to-r hover:from-dokuso-pink hover:to-dokuso-orange shadow-lg font-semibold'
            >
              {translations?.explore}
            </Button>
        </Box>
    )
};

export default PagesDesktop;