import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from "react";
import { pages } from "../../../Utils/pages";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { enhanceText } from "../../../Utils/enhanceText";

const MenuMobile = ({handleSelectPage}) => {
    const router = useRouter();
    const { language } = useAppSelector(state => state.region);
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => { // open nav menu on mobile
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => { // close nav menu on mobile
        setAnchorElNav(null);
    };
    // const handleSelectPage = (sel) => {
    //     if(sel === 'home') {
    //       router.push('/')
    //     } else if (sel === 'blog'){
    //       router.push(`/${language}/blog`)
    //     } else if (sel === 'brands') {
    //       router.push(`/${language}/brands`)
    //     }
    // };
    
    return (
        <Box sx={{ flexGrow: 0, mr: 2 ,  display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="dokusoBlack"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {/* Acciones mobile */}
            {pages.map((page) => (
              <MenuItem 
                onClick={() => {handleSelectPage(page.name)}}
                key={page.name} 
                href={page.src}
              >
                <Typography textAlign="center">{enhanceText(page.name)}</Typography>
              </MenuItem>
            
            ))}
          </Menu>
        </Box>

    )
};

export default MenuMobile;