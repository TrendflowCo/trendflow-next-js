import { Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { settings_account } from "../../../Utils/settingsAccount";
import { enhanceText } from "../../../Utils/enhanceText";
import { useAppSelector } from "../../../../redux/hooks";
import { useRouter } from "next/router";
import { logAnalyticsEvent } from "../../../../services/firebase";
import Link from 'next/link';

const MenuToggleUser = ({ setAnchorElUser, anchorElUser, logOut }) => {
    return (
        <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
        >
            <MenuItem>
                <Link href="/profilePage">
                    Profile
                </Link>
            </MenuItem>
            <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
    );
};

export default MenuToggleUser;