import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Tabs, Tab, TextField, Button, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import SocialAuth from "./SocialAuth";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import { logAnalyticsEvent } from '../../services/firebase';

const ModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 24px;
  .MuiTabs-indicator {
    background-color: var(--trendflow-pink);
  }
`;

const StyledTab = styled(Tab)`
  font-weight: 600;
  color: ${muiColors.palette.trendflowBlack.main};
  &.Mui-selected {
    color: var(--trendflow-pink);
  }
`;

const LogInModal = () => {
    const dispatch = useAppDispatch();
    const { translations } = useAppSelector(state => state.region);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        logAnalyticsEvent('page_view', {
            page_title: activeTab === 0 ? 'login' : 'signup',
        });        
    }, [activeTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleLoginSuccess = () => {
        setLoading(false);
        dispatch(setLogInFlag(false));
    };

    const handleLoginError = (error) => {
        setLoading(false);
    };

    return (
        <AnimatePresence>
            <ModalWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ModalContent
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <IconButton onClick={() => dispatch(setLogInFlag(false))}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    
                    <StyledTabs value={activeTab} onChange={handleTabChange} centered>
                        <StyledTab label="Sign In" />
                        <StyledTab label="Sign Up" />
                    </StyledTabs>
                    
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 0 ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 0 ? 
                            <LogInForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} /> : 
                            <SignUpForm onSignUpSuccess={handleLoginSuccess} onSignUpError={handleLoginError} />
                        }
                    </motion.div>
                    
                    <Box my={3}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            or
                        </Typography>
                    </Box>
                    
                    <SocialAuth onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
                    
                    {loading && (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} display="flex" alignItems="center" justifyContent="center" bgcolor="rgba(255, 255, 255, 0.8)">
                            <CircularProgress />
                        </Box>
                    )}
                </ModalContent>
            </ModalWrapper>
        </AnimatePresence>
    );
};

export default LogInModal;