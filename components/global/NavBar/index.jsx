import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../../Utils/muiTheme';
import TitleDesktop from './Desktop/TitleDesktop';
import PagesDesktop from './Desktop/PagesDesktop';
import TitleMobile from './Mobile/TitleMobile';
import MenuForUser from './Common/MenuForUser';
import MenuToggleUser from './Common/MenuToggleUser';
import LanAndCountrySelection from './Common/LanAndCountrySelection';

const Navbar = ({ logOut , user , loading }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  return (
  <ThemeProvider theme={muiColors}>
    <AppBar position="static" color="dokusoWhite" enableColorOnDark={true} className='border-b border-b-[#D8D8D8] h-[72px]'>
      <Container maxWidth="xxl" sx={{display: 'flex' , flexDirection: 'row' , width: '100%', height: '100%', alignItems: 'center' , justifyContent: 'space-between'}}>
        <section className='flex flex-row items-center'>
          <TitleDesktop/>
          <PagesDesktop/>
          <TitleMobile/>
        </section>
        <section className='flex flex-row items-center justify-end'>
          <LanAndCountrySelection loading={loading}/>
          <MenuForUser loading={loading} user={user} setAnchorElUser={setAnchorElUser}/>
          <MenuToggleUser anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} logOut={logOut}/>
        </section>
      </Container>
    </AppBar>
  </ThemeProvider>
  );
}
export default Navbar;