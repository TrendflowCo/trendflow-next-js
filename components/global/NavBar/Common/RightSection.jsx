import { Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import React from "react";
import { useAppSelector } from "../../../../redux/hooks"
import SearchSection from "./SearchSection";
import MenuForUser from "./MenuForUser";

const RightSection = ({loading , user}) => {
    const { language , country } = useAppSelector(state => state.region);
    const [anchorElUser, setAnchorElUser] = useState(null);

    return (
        <Box sx={{ flexGrow: 1 , width:'fit', maxWidth:'500px' , display: 'flex', flexDirection: 'row' , alignItems: 'center' , justifyContent:'end' }}>
            <SearchSection/>
            <MenuForUser loading={loading} user={user} setAnchorElUser={setAnchorElUser}/>
          {/* Menu toggle for the logged user */}
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
          { language !== '' && 
            // Language selector
            <Tooltip title="Select language" className='cursor-pointer'>
              <Button color="inherit" onClick={handleLanguageMenuOpen} sx={{width: 48 , height: 48, borderRadius: 24, ml: 0.5}}>
              {language}
              </Button>
            </Tooltip>
          }
          {/* Language selection menu */}
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
        </Box>
    )
};

export default RightSection;