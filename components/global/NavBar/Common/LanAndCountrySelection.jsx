import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import countriesAndLanguagesOptions from "../../../Resources/countriesAndLanguagesOptions.json"
import LocationIcon from "../../../Common/Icons/LocationIcon";
import { enhanceText } from "../../../Utils/enhanceText";

const LanAndCountrySelection = ({ loading }) => {
    const [anchorElCountry , setAnchorElCountry] = useState(null);
    const router = useRouter();
    const { country , language , translations } = useAppSelector(state => state.region);
    const [indexZone , setIndexZone] = useState(-1)

    useEffect(() => {
        const index = countriesAndLanguagesOptions.findIndex((item) => (item.country === country && item.language === language));
        if(index !== -1) {
            setIndexZone(index)
        }
    },[country,language])

    const handleCountryMenuOpen = (event) => {
        setAnchorElCountry(event.currentTarget);
    };
    const handleCountryMenuClose = () => {
        setAnchorElCountry(null);
    };
    const handleClickLanguageAndCountry = (selectedOption) => {
        const { pathname, query } = router;
        router.replace( // cambio lenguaje y pais
          { pathname, query: {...query, zone: selectedOption.country , lan: selectedOption.language} }, undefined, { shallow: true }
        );
        handleCountryMenuClose();
    };
    
    return (
        <>
            { country !== '' && language !== '' && indexZone !== -1 && !loading &&
                <section>
                    <Tooltip title={translations?.selectRegion} className='cursor-pointer'>
                        <Button
                            color="inherit"
                            onClick={(event) => handleCountryMenuOpen(event)}
                            sx={{
                                borderRadius: 24,
                                mr: 2,
                                px: 1.5 ,
                                textTransform: 'none',
                                fontSize: '15px'
                            }}
                        >
                            <LocationIcon/>
                            <span className="ml-2">{`${countriesAndLanguagesOptions[indexZone].country.toUpperCase()} - ${enhanceText(countriesAndLanguagesOptions[indexZone].language)}`}</span>
                        </Button>
                    </Tooltip>
                </section>
            }
            <Menu
                anchorEl={anchorElCountry}
                open={Boolean(anchorElCountry)}
                onClose={handleCountryMenuClose}
            >
                {countriesAndLanguagesOptions.map((singleOption, indexOption) => (
                    <MenuItem 
                        key={indexOption}
                        sx={{fontSize: '15px'}}
                        onClick={() => handleClickLanguageAndCountry(singleOption)}
                    >
                        <LocationIcon/>
                        <span className="ml-2">{`${singleOption.country.toUpperCase()} - ${enhanceText(singleOption.language)}`}</span>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
};

export default LanAndCountrySelection;