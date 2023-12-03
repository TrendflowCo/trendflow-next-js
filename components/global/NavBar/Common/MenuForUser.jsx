import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { logEvent } from "firebase/analytics";
import React from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';
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
                <div className="bg-yellow-200 w-full">
                  <Button 
                    onClick={() => dispatch(setLogInFlag(true))}
                    className="hover:text-dokuso-white bg-gradient-to-r from-dokuso-pink to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" variant="contained" 
                    sx={{fontWeight: 'bold' , flex: 'none'}}
                    >
                    {translations?.login?.log_in}
                  </Button>
                </div>
            }
          </section>
          }
        </>
    )
};

export default MenuForUser;