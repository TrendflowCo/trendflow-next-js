import { Box, IconButton , Typography , Link , Divider } from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import loginImage from "../../public/logInImage.png";
import Image from "next/image";
import SocialAuth from "./SocialAuth";
import { useAppSelector , useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";
import LogInForm from "./LogInForm";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../services/firebase";

const LogInModal = () => {
    const dispatch = useAppDispatch();
    const { logInFlag } = useAppSelector (state => state.auth);
    const { translations } = useAppSelector(state => state.region);
    useEffect(() =>{
        logEvent(analytics, 'page_view', {
            page_title: 'login',
        });        
    },[])
    let easing = [0.6, -0.05, 0.01, 0.99];
    const fadeInUp = {
      initial: {
        y: 40,
        opacity: 0,
        transition: { duration: 0.6, ease: easing },
      },
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: easing,
        },
      },
    };
    const HeadingStyle = styled(Box)({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    });
    muiColors.typography.h4 = {
        fontSize: '2.125rem',
        fontWeight: 'bold',
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
        color: muiColors.palette.trendflowBlack.main,
        fontFamily: [
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ].join(','),
        '@media (min-width:768px)': {
          fontSize: '3rem',
        }
    };
    muiColors.typography.h5 = {
        fontSize: '1.25rem',
        fontWeight: 'regular',
        lineHeight: 1.334,
        letterSpacing: '0em',
        color: muiColors.palette.trendflowBlack.main,
        fontFamily: [
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ].join(','),
        '@media (min-width:768px)': {
          fontSize: '1.5rem',
        }
    };
    const handleSignUp = () => {
        // console.log("redirect to sign up modal")
    };

    return (
        <section className="h-screen w-screen flex flex-col items-center justify-center">
            <div className="fixed top-[10%] h-[80vh] lg:left-[25%] left-[6%] lg:w-[50vw] w-[88vw] flex flex-col items-center bg-trendflow-white shadow-2xl rounded-3xl p-4">
                <div className="flex flex-col items-end justify-center h-12 w-full flex-none">
                    <IconButton sx={{marginRight: '4px'}} onClick={() => dispatch(setLogInFlag(false))}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                <div className="w-full h-full p-2">
                    <HeadingStyle component={motion.div} {...fadeInUp}>
                        <div className="flex flex-col lg:flex-row w-full h-full">
                            <section className="w-full lg:w-1/2 h-fit flex flex-col">
                                <ThemeProvider theme={muiColors}>
                                    <Typography 
                                        variant="h4" 
                                        component="h4" 
                                        style={{ 'textAlign': 'center' , 'flex': 'none'}}
                                        // sx={{ mb: 4 }}
                                    >
                                        {translations.login.log_in_and_stay_ahead_in_fashion}
                                    </Typography>
                                </ThemeProvider>
                                <div className="w-full h-full hidden lg:flex lg:items-center lg:justify-center"> 
                                    <Image
                                        src={loginImage}
                                        alt='loginImage'
                                        className="w-[90%]"
                                    />
                                </div>
                            </section>
                            <section className="w-full lg:w-1/2 h-full flex flex-col justify-center">
                                <ThemeProvider theme={muiColors}>
                                    <Typography 
                                        variant="h5" 
                                        component="h5" 
                                        style={{ 'textAlign': 'center'}}
                                        sx={{ mb: 2 }}
                                    >
                                        {translations.login.continue_with_your_google_account}
                                        {/* <Link 
                                            variant="h5" 
                                            onClick={handleSignUp}
                                            sx={{'cursor': 'pointer'}}
                                        >
                                            Sign up
                                        </Link> */}
                                    </Typography>
                                </ThemeProvider>
                                <SocialAuth/>
                                {/* <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp}>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    OR
                                    </Typography>
                                </Divider> */}
                                {/* <Box component={motion.div} {...fadeInUp}>
                                    <LogInForm />
                                </Box> */}
                            </section>
                        </div>
                    </HeadingStyle>
                </div>
            </div>
        </section>
    )
};

export default LogInModal;