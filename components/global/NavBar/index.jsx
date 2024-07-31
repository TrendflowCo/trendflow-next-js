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
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { handleSearchQuery } from '../../functions/handleSearchQuery';
import { setCurrentSearch } from '../../../redux/features/actions/search';

const Navbar = ({ logOut, user, loading, setFilterModal }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { country, language, translations } = useAppSelector(state => state.region);
  const isHomePage = router.pathname === '/[zone]/[lan]';

  const handleExplore = () => {
    if (translations?.prompts) {
      const promptValues = Object.values(translations.prompts);
      const randomTerm = promptValues[Math.floor(Math.random() * promptValues.length)];
      dispatch(setCurrentSearch(randomTerm));
      handleSearchQuery(country, language, randomTerm, 'explore', router);
    }
  };

  const handleFilterClick = () => {
    setFilterModal(true);
    // Add any additional filter logic here
    // For example, you could dispatch an action to update the filter state in Redux
    // dispatch(updateFilterState());
  };

  return (
    <ThemeProvider theme={muiColors}>
      <AppBar position="fixed" elevation={0} className={`${isHomePage ? 'bg-transparent' : 'bg-gradient-to-r from-trendflow-pink to-trendflow-blue'}`}>
        <Container maxWidth="xxl">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <TitleDesktop />
              <TitleMobile />
            </div>
            <div className="flex items-center space-x-4">
              {!isHomePage && <SearchBar />}
              <Tooltip title="Explore new ideas">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<span role="img" aria-label="sparkles">✨</span>}
                  onClick={handleExplore}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Explore
                </Button>
              </Tooltip>
              <LanAndCountrySelection loading={loading} />
              <MenuForUser logOut={logOut} user={user} loading={loading} />
              <MenuToggleUser setAnchorElUser={setAnchorElUser} anchorElUser={anchorElUser} />
            </div>
          </div>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Navbar;