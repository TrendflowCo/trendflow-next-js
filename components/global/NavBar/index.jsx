import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { muiColors } from '../../Utils/muiTheme';
import TitleDesktop from './Desktop/TitleDesktop';
import TitleMobile from './Mobile/TitleMobile';
import MenuForUser from './Common/MenuForUser';
import MenuToggleUser from './Common/MenuToggleUser';
import LanAndCountrySelection from './Common/LanAndCountrySelection';
import SearchBar from './Common/SearchBar';
import { Button, Tooltip, IconButton, Box, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { handleSearchQuery } from '../../functions/handleSearchQuery';
import { setCurrentSearch } from '../../../redux/features/actions/search';

const Navbar = ({ logOut, user, loading, setFilterModal }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { country, language, translations } = useAppSelector(state => state.region);
  const isHomePage = router.pathname === '/[zone]/[lan]';
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleExplore = () => {
    if (translations?.prompts) {
      const promptValues = Object.values(translations.prompts);
      const randomTerm = promptValues[Math.floor(Math.random() * promptValues.length)];
      dispatch(setCurrentSearch(randomTerm));
      handleSearchQuery(country, language, randomTerm, 'explore', router);
    }
  };

  const handleOpenMoreMenu = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
  };

  const handleLoginLogout = () => {
    if (user) {
      logOut();
    } else {
      // Implement login logic here
      console.log('Login clicked');
    }
    handleCloseMoreMenu();
  };

  return (
    <ThemeProvider theme={muiColors}>
      <AppBar position="fixed" elevation={0} className={`${isHomePage ? 'bg-transparent' : 'bg-gradient-to-r from-trendflow-pink to-trendflow-blue'}`}>
        <Container maxWidth="xl">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              {isMobile ? <TitleMobile /> : <TitleDesktop />}
            </div>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, justifyContent: 'center', maxWidth: { xs: '60%', sm: '70%', md: '50%' } }}>
              <SearchBar />
              <Tooltip title="Explore new ideas">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExplore}
                  sx={{
                    minWidth: 'auto',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    p: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <span role="img" aria-label="sparkles">✨</span>
                </Button>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <>
                  <LanAndCountrySelection loading={loading} />
                  <MenuForUser logOut={logOut} user={user} loading={loading} />
                  <MenuToggleUser setAnchorElUser={setAnchorElUser} anchorElUser={anchorElUser} />
                </>
              )}
              {isMobile && (
                <>
                  <Tooltip title={user ? "Logout" : "Login"}>
                    <IconButton
                      color="inherit"
                      onClick={handleLoginLogout}
                      sx={{ mr: 1 }}
                    >
                      {user ? <LogoutIcon /> : <LoginIcon />}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    color="inherit"
                    aria-label="more options"
                    onClick={handleOpenMoreMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </div>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anchorElMore}
        open={Boolean(anchorElMore)}
        onClose={handleCloseMoreMenu}
      >
        <MenuItem onClick={handleCloseMoreMenu}>
          <LanAndCountrySelection loading={loading} />
        </MenuItem>
        {user && (
          <MenuItem onClick={handleCloseMoreMenu}>
            <MenuForUser logOut={logOut} user={user} loading={loading} />
          </MenuItem>
        )}
      </Menu>
    </ThemeProvider>
  );
}

export default Navbar;