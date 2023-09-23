import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector , useAppDispatch } from '../../redux/hooks';
import { setLogInFlag } from '../../redux/features/actions/auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setCurrentSearch } from '../../redux/features/actions/search';
// import Swal from 'sweetalert2';
import { pages } from '../Utils/pages';
// import { setLanguage } from '../../redux/features/actions/language';
import { settings_account } from '../Utils/settingsAccount';
import { languages } from "../Utils/languages";
import { enhanceText } from "../Utils/enhanceText";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../services/firebase';
import { CircularProgress } from '@mui/material';
import { handleSearchQuery } from '../functions/handleSearchQuery';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = ({ logOut , user , loading }) => {
  const { currentSearch } = useAppSelector(state => state.search);
  const { language , translations } = useAppSelector(state => state.language);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLanguage , setAnchorElLanguage] = useState(null);
  
  const handleOpenNavMenu = (event) => { // open nav menu on mobile
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => { // close nav menu on mobile
    setAnchorElNav(null);
  };
  const handleSelectPage = (sel) => {
    if(sel === 'home') {
      router.push('/')
    } else if (sel === 'blog'){
      router.push(`/${language}/blog`)
    }
  };
  const handleOpenUserMenu = (event) => { // open user menu
    logEvent(analytics, 'clickOnUserMenu', {
      button: 'Main'
    });
    setAnchorElUser(event.currentTarget);
  };
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
  const handleSearchPhrase = (e) => { // function for setting the phrase. Stores into global state
    dispatch(setCurrentSearch(e.target.value));
  };
  const handleEnterSearch = (e) => { // click ENTER into form -> redirects to SHOP NOW
    if (e.key === 'Enter') {
      event.preventDefault();
      handleSearchQuery(language , currentSearch , 'search' , router)
    }
  };
  const handleLanguageMenuOpen = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };
  const handleLanguageMenuClose = () => {
    setAnchorElLanguage(null);
  };
  const handleClickLanguage = (selectedLanguage) => {
    const clickedLanguage = selectedLanguage.toLowerCase();
    const { pathname, query } = router;
    // const params = new URLSearchParams(query);
    router.replace(
      { pathname, query: {...query,lan: clickedLanguage} }, undefined, { shallow: true }
    );
    handleLanguageMenuClose();
  };
  
  return (
  <ThemeProvider theme={muiColors}>
    <AppBar position="static" color="dokusoWhite" enableColorOnDark={true} className='border-b border-b-[#D8D8D8]'>
      <Container maxWidth="xxl" sx={{display: 'flex' , flexDirection: 'row' , width: '100%', alignItems: 'center' , justifyContent: 'space-between'}}>
        {/* Title for desktop display */}
        <Box sx={{ mr: 2 , display: { xs: 'none', md: 'flex'}}}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontWeight: 700,
              color: 'dokusoBlack',
              textDecoration: 'none',
            }}
          >
            Dokusō
          </Typography>
        </Box>
        {/* Pages for desktop display */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              onClick={() => {handleSelectPage(page.name)}}
              sx={{ my: 2 , color:'inherit' }}
              // href={`/${language}/${page.name.toLowerCase()}`}
            >
              {translations?.[page.name] || page.name}
            </Button>
          ))}
        </Box>
        {/* Menu bar for mobile display */}
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
            {pages.map((page) => (
              <MenuItem 
                component="a"
                key={page.name} 
                onClick={handleCloseNavMenu}
                href={page.src}
                // target="_blank" 
                // rel="noopener noreferrer"
              >
                <Typography textAlign="center">{enhanceText(page.name)}</Typography>
              </MenuItem>
            
            ))}
          </Menu>
        </Box>
        {/* Title for mobile display */}
        {!router.pathname.includes('results') && 
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
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
        }
        {/* Nav bar right section */}
        <Box sx={{ flexGrow: 1 , width:'fit', maxWidth:'500px' , display: 'flex', flexDirection: 'row' , alignItems: 'center' , justifyContent:'end' }}>
          { router.pathname.includes('results') &&
            // Searching section
            <div className="flex flex-row items-center outline-none justify-center items-center w-full h-full relative mr-4">
              {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/> */}
              <input 
                className="bg-dokuso-black outline-none bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-2 pr-10 pl-5 relative flex-auto w-[120px] md:w-full items-center text-dokuso-black"
                type="text"
                // placeholder={currentSearch.split('-').join(' ') || "Tell me what you like"}
                placeholder={translations?.search?.placeholder}
                value={currentSearch.split('-').join(' ')}
                onChange={(e) => {handleSearchPhrase(e)}}
                onKeyDown={handleEnterSearch}
              />
              <Tooltip title="Search query">
                <IconButton 
                  onClick={() => {handleSearchQuery(language , currentSearch , 'search' , router)}} 
                  sx={{ p: 0 , width: '40px' , height: '40px', position: 'absolute', right: '0px' }}
                >
                  <div className='h-[40px] w-[40px] rounded-r-[5px] bg-gradient-to-tl from-dokuso-pink to-dokuso-blue'>
                    <SearchIcon fontSize='medium' style={{'color': "#FAFAFA"}}/>
                  </div>
                </IconButton>
              </Tooltip>

            </div>
          }
          {/* Menu for a logged user */}
          {loading ?
            <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'end', justifyContent: 'center' }}>
              <CircularProgress size={36} thickness={3} />
            </Box>
          : 

           user ?
            //  Avatar icon for user
            <Tooltip title="Open settings">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 , width: {sm: 48 , xs: 40} , height: '100%' }}
              >
                <div className='w-10 h-10 md:w-12 md:h-12 rounded-[20px] md:rounded-[22px]'>
                  <Image
                    referrerPolicy='no-referrer'
                    alt="avatar"
                    src={user.photoURL || 'https://www.flaticon.com/free-icon/user_456212?term=user+avatar&page=1&position=1&origin=tag&related_id=456212'} 
                    width={48} 
                    height={48} 
                    className='w-10 h-10 md:w-12 md:h-12 rounded-[20px] md:rounded-[22px]'
                  />
                </div>
              </IconButton>
            </Tooltip>
          :
            <Button 
              onClick={() => dispatch(setLogInFlag(true))}
              className="hover:text-dokuso-white bg-gradient-to-r from-dokuso-green to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" variant="contained" 
              color="dokusoBlack"
              sx={{fontWeight: 'bold' , flex: 'none'}}
              >
              {translations?.login?.log_in}
            </Button>
          
          }
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
              // <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <MenuItem key={setting} onClick={() => handleMenuOption(setting)}>
                <Typography textAlign="center">{translations?.userMenu?.[setting] && enhanceText(translations?.userMenu?.[setting])}</Typography>
              </MenuItem>
            ))}
          </Menu>
          { language !== '' && 
            // Language selector
            <Tooltip title="Select language" className='cursor-pointer'>
              <Button color="inherit" onClick={handleLanguageMenuOpen} sx={{width: 48 , height: 48, borderRadius: 24, ml: 0.5}}>
              {/* {`${(languages?.find(lan => lan?.name?.toLowerCase() === language?.toLowerCase()) || {}).flag}`} */}
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
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default Navbar;