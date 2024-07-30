import { Box, CircularProgress, IconButton, Tooltip, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { logEvent } from "firebase/analytics";
import React from "react";
import Image from 'next/image';
import { analytics } from "../../../../services/firebase";
import { useAppDispatch , useAppSelector } from "../../../../redux/hooks";
import { setLogInFlag } from "../../../../redux/features/actions/auth";

const MenuForUser = ({loading , user , setAnchorElUser}) => {
    const dispatch = useAppDispatch();
    const { translations } = useAppSelector(state => state.region)

    const handleOpenUserMenu = (event) => { // open user menu
        logEvent(analytics, 'clickOnUserMenu', {
          button: 'Main'
        });
        setAnchorElUser(event.currentTarget);
      };
    
    return (
        <>
          {loading ?
            <section className="flex flex-col items-end justify-center">
              <CircularProgress size={44} thickness={3} />
            </section>
          : 
            <section>
              {user ?
                <Tooltip title={translations?.openSettings}>
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ p: 0 , width: 44 , height: '100%' }}
                  >
                    <div className='w-11 h-11 rounded-[22px] '>
                      <Image
                        referrerPolicy='no-referrer'
                        alt="avatar"
                        src={user.photoURL || 'https://www.flaticon.com/free-icon/user_456212?term=user+avatar&page=1&position=1&origin=tag&related_id=456212'} 
                        width={44} 
                        height={44} 
                        className='w-11 h-11 rounded-[22px]'
                      />
                    </div>
                  </IconButton>
                </Tooltip>
              :
                <Button 
                  onClick={() => dispatch(setLogInFlag(true))}
                  variant="contained" 
                  startIcon={<LoginIcon />}
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 20,
                    padding: '8px 16px',
                    background: 'linear-gradient(to right, #FF6B6B, #4ECDC4)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #FF8E53, #FE4B8D)',
                    },
                  }}
                >
                  {translations?.login?.log_in || 'Log In'}
                </Button>
            }
          </section>
          }
        </>
    )
};

export default MenuForUser;