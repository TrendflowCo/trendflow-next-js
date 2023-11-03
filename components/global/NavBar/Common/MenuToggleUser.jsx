import { Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { settings_account } from "../../../Utils/settingsAccount";
import { enhanceText } from "../../../Utils/enhanceText";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../../services/firebase";


const MenuToggleUser = ({anchorElUser , setAnchorElUser , logOut }) => {
    const router = useRouter();
    const { translations } = useAppSelector(state => state.region)
    const handleCloseUserMenu = () => { // close user menu
        setAnchorElUser(null);
    };
    const handleMenuOption = (option) => { // options from user menu
        if (option === 'logout') {
          logEvent(analytics, 'clickOnUserMenu', {
            button: 'Logout'
          });  
          logOut()
        } else if (option === 'wishlist') {
          logEvent(analytics, 'clickOnUserMenu', {
            button: 'Wishlist'
          });  
          router.push(`/${language}/user/wishlist`)
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