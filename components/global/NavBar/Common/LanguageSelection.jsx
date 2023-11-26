import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { languages } from "../../../Resources/languages";

const LanguageSelection = () => {
    const [anchorElLanguage , setAnchorElLanguage] = useState(null);
    const router = useRouter();
    const { language } = useAppSelector(state => state.region)
    const handleLanguageMenuOpen = (event) => {
        setAnchorElLanguage(event.currentTarget);
    };
    const handleLanguageMenuClose = () => {
        setAnchorElLanguage(null);
    };
    const handleClickLanguage = (selectedLanguage) => {
        const clickedLanguage = selectedLanguage.toLowerCase();
        const { pathname, query } = router;
        router.replace( // solo cambio el lenguaje en la URL
          { pathname, query: {...query,lan: clickedLanguage} }, undefined, { shallow: true }
        );
        handleLanguageMenuClose();
    };
    
    return (
        <>
            { language !== '' && 
                <Tooltip title="Select language" className='cursor-pointer'>
                    <Button color="inherit" onClick={handleLanguageMenuOpen} sx={{ borderRadius: 24, ml: 0.5}}>
                        {language}
                    </Button>
                </Tooltip>
            }
            <Menu
                anchorEl={anchorElLanguage}
                open={Boolean(anchorElLanguage)}
                onClose={handleLanguageMenuClose}
            >
                {languages.map((language, index) => (
                    <MenuItem 
                        key={index} 
                        onClick={() => handleClickLanguage(language.name)}
                    >
                        {language.flag} {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
};

export default LanguageSelection;