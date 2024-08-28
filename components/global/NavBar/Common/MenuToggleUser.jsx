import { Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { settings_account } from "../../../Utils/settingsAccount";
import { enhanceText } from "../../../Utils/enhanceText";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { logAnalyticsEvent } from "../../../../services/firebase";

const MenuToggleUser = ({anchorElUser , setAnchorElUser , logOut }) => {
    const router = useRouter();
    const { translations , language , country } = useAppSelector(state => state.region)
    const handleCloseUserMenu = () => { // close user menu
        setAnchorElUser(null);
    };
    const handleMenuOption = (option) => { // options from user menu
        if (option === 'logout') {
          logAnalyticsEvent('clickOnUserMenu', {
            button: 'Logout'
          });  
          logOut()
        } else if (option === 'wishlist') {
          logAnalyticsEvent('clickOnUserMenu', {
            button: 'Wishlist'
          });  
          router.push(`/${country}/${language}/user/wishlist`)
        }
        handleCloseUserMenu()
    };
    
    return (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
        >
            {settings_account.map((setting) => (
            <MenuItem key={setting} onClick={() => handleMenuOption(setting)}>
                <Typography textAlign="center">{translations?.userMenu?.[setting] && enhanceText(translations?.userMenu?.[setting])}</Typography>
            </MenuItem>
            ))}
        </Menu>

    )
};

export default MenuToggleUser;