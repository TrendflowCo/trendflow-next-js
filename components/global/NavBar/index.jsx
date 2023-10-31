import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../../Utils/muiTheme';
import { useAppSelector , useAppDispatch } from '../../../redux/hooks';
import { setLogInFlag } from '../../../redux/features/actions/auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setCurrentSearch } from '../../../redux/features/actions/search';
import { settings_account } from '../../Utils/settingsAccount';
import { languages } from "../../Utils/languages";
import { enhanceText } from "../../Utils/enhanceText";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../services/firebase';
import { CircularProgress } from '@mui/material';
import { handleSearchQuery } from '../../functions/handleSearchQuery';
import SearchIcon from '@mui/icons-material/Search';
import TitleDesktop from './Desktop/TitleDesktop';
import PagesDesktop from './Desktop/PagesDesktop';
import MenuMobile from './Mobile/MenuMobile';
import TitleMobile from './Mobile/TitleMobile';

const Navbar = ({ logOut , user , loading }) => {
  const { currentSearch } = useAppSelector(state => state.search);
  const { language , translations , country } = useAppSelector(state => state.region);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLanguage , setAnchorElLanguage] = useState(null);
  
  const handleSelectPage = (sel) => { // funcion para seleccionar paginas. Queda para los dos formatos
    if(sel === 'home') {
      router.push(`/${country}/${language}`)
    } else if (sel === 'blog'){
      router.push(`/${country}/${language}/blog`)
    } else if (sel === 'brands') {
      router.push(`/${country}/${language}/brands`)
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
    router.replace( // solo cambio el lenguaje en la URL
      { pathname, query: {...query,lan: clickedLanguage} }, undefined, { shallow: true }
    );
    handleLanguageMenuClose();
  };
  
  return (
  <ThemeProvider theme={muiColors}>
    <AppBar position="static" color="dokusoWhite" enableColorOnDark={true} className='border-b border-b-[#D8D8D8]'>
      <Container maxWidth="xxl" sx={{display: 'flex' , flexDirection: 'row' , width: '100%', alignItems: 'center' , justifyContent: 'space-between'}}>
        <TitleDesktop/>
        <PagesDesktop handleSelectPage={handleSelectPage}/>
        <MenuMobile handleSelectPage={handleSelectPage}/>
        <TitleMobile/>
        {/* Nav bar right section */}
        <Box sx={{ flexGrow: 1 , width:'fit', maxWidth:'500px' , display: 'flex', flexDirection: 'row' , alignItems: 'center' , justifyContent:'end' }}>
          { router.pathname.includes('results') &&
            // Searching section
            <div className="flex flex-row items-center outline-none justify-center items-center w-full h-full relative mr-4">
              <input 
                className="bg-dokuso-black outline-none bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-2 pr-10 pl-5 relative flex-auto w-[120px] md:w-full items-center text-dokuso-black"
                type="text"
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
              className="hover:text-dokuso-white bg-gradient-to-r from-dokuso-pink to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" variant="contained" 
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
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default Navbar;