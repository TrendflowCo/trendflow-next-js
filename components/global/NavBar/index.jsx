import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../../Utils/muiTheme';
import { useAppSelector } from '../../../redux/hooks';
import { useRouter } from 'next/router';
import TitleDesktop from './Desktop/TitleDesktop';
import PagesDesktop from './Desktop/PagesDesktop';
import MenuMobile from './Mobile/MenuMobile';
import TitleMobile from './Mobile/TitleMobile';
import SearchSection from './Common/SearchSection';
import MenuForUser from './Common/MenuForUser';
import MenuToggleUser from './Common/MenuToggleUser';
import LanguageSelection from './Common/LanguageSelection';
import CountrySelection from './Common/CountrySelection';

const Navbar = ({ logOut , user , loading }) => {
  const { language , country } = useAppSelector(state => state.region);
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const handleSelectPage = (sel) => { // funcion para seleccionar paginas. Queda para los dos formatos
    if(sel === 'home') {
      router.push(`/${country}/${language}`)
    } else if (sel === 'blog'){
      router.push(`/${country}/${language}/blog`)
    } else if (sel === 'brands') {
      router.push(`/${country}/${language}/brands`)
    }
  };

  return (
  <ThemeProvider theme={muiColors}>
    <AppBar position="static" color="dokusoWhite" enableColorOnDark={true} className='border-b border-b-[#D8D8D8] h-[72px]'>
      <Container maxWidth="xxl" sx={{display: 'flex' , flexDirection: 'row' , width: '100%', height: '100%', alignItems: 'center' , justifyContent: 'space-between'}}>
        <TitleDesktop/>
        <PagesDesktop handleSelectPage={handleSelectPage}/>
        <MenuMobile handleSelectPage={handleSelectPage}/>
        <TitleMobile/>
        <Box sx={{ flexGrow: 1 , width:'fit', maxWidth:'700px' , display: 'flex', flexDirection: 'row' , alignItems: 'center' , justifyContent:'end' }}>
          {/* <SearchSection/> */}
          <CountrySelection/>
          <LanguageSelection/>
          <MenuForUser loading={loading} user={user} setAnchorElUser={setAnchorElUser}/>
          <MenuToggleUser anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} logOut={logOut}/>
        </Box>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default Navbar;