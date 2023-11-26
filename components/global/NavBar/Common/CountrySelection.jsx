import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { countriesAndLanguages } from "../../../Resources/countriesDefaultValues";

const CountrySelection = () => {
    const [anchorElCountry , setAnchorElCountry] = useState(null);
    const router = useRouter();
    const { country } = useAppSelector(state => state.region)
    const handleCountryMenuOpen = (event) => {
        setAnchorElCountry(event.currentTarget);
    };
    const handleCountryMenuClose = () => {
        setAnchorElCountry(null);
    };
    const handleClickCountry = (selectedCountry) => {
        const clickedCountry = selectedCountry.toLowerCase();
        const { pathname, query } = router;
        router.replace( // solo cambio el lenguaje en la URL
          { pathname, query: {...query,zone: clickedCountry} }, undefined, { shallow: true }
        );
        handleCountryMenuClose();
    };
    
    return (
        <>
            { country !== '' && 
                <Tooltip title="Select country" className='cursor-pointer'>
                    <Button color="inherit" onClick={handleCountryMenuOpen} sx={{ borderRadius: 24, ml: 0.5}}>
                        {countriesAndLanguages[countriesAndLanguages.findIndex((item) => item.aliasCountry === country)].country}
                    </Button>
                </Tooltip>
            }
            <Menu
                anchorEl={anchorElCountry}
                open={Boolean(anchorElCountry)}
                onClose={handleCountryMenuClose}
            >
                {countriesAndLanguages.map((singleCountry, index) => (
                    <MenuItem 
                        key={index} 
                        onClick={() => handleClickCountry(singleCountry.aliasCountry)}
                    >
                        {singleCountry.country}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
};

export default CountrySelection;