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
            <Box sx={{ display: 'flex' , flexDirection: 'column', alignItems: 'end', justifyContent: 'center' }}>
              <CircularProgress size={36} thickness={3} />
            </Box>
          : 
           user ?
            <Tooltip title={translations?.openSettings}>
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
        </>
    )
};

export default MenuForUser;