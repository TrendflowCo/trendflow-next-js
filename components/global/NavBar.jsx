import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider} from '@mui/material/styles';


const NavigationBarHero = () => {
  // const {  
  //   setShowModal,
  //   user,
  //   handleResultClick
  // } = React.useContext(ImageContext);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#edf5fd',
      },
    },
  });
  
  const pages = [
    'About', 
    'Brands',
    // 'SALE (soon)',
    'Blog',
    'Api (SOON)',
  ];
  
  const routes = {
    'Home': '/home',
    'About': '/manifesto',
    'Brands': '/Brands',
    'SALE': '/',
    'Blog': 'https://medium.com/@dokuso.app/',
    'Api': '/',
  }
  const settings_account = [
        'Profile', 
        'Account', 
        'Dashboard', 
        'Logout'
      ];
  

  const handleSearchSale = (e) => {
    console.log('sale search')
    handleResultClick('sale');
  };

  const handleModal = () => {
    setShowModal(true)
  };
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
  <ThemeProvider theme={darkTheme}>
    <AppBar position="static" color="primary" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Title for desktop display */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Dokusō
          </Typography>
          {/* Pages for desktop display */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'inherit', display: 'block' }}
                href={routes[page]}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* Menu bar for mobile display */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
              {pages.map((page) => (
                <MenuItem 
                component="a"
                key={page} 
                onClick={page === 'SALE' ? handleSearchSale : handleCloseNavMenu}
                href={routes[page]}
                target="_blank" 
                rel="noopener noreferrer"
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
             
              ))}
            </Menu>
          </Box>
          {/* Title for mobile display */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Dokusō
          </Typography>
          {/* Menu for a logged user */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              { false ?
              // { user ?
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 }}
              >
                <Avatar alt={user.name} src={user.photoURL !== null ? user.photoURL : '/static/images/avatar/2.jpg'} />
              </IconButton>
              :
              <Button 
                onClick={handleModal}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500" variant="contained" 
                color="primary">
                Sign Up
              </Button>
              }
            </Tooltip>
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default NavigationBarHero;