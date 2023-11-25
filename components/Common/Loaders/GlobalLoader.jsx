import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

const GlobalLoader = () => {
  const { translations } = useAppSelector(state => state.region);
    const colors = ['#318AFA', '#FA39BE', '#FAB332', '#262626'];
    const [colorIndex, setColorIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setColorIndex((prevColorIndex) => (prevColorIndex + 1) % colors.length);
        }, 1400);
    
        return () => clearInterval(interval);
      }, []); // eslint-disable-line
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={80} thickness={2} sx={{color: colors[colorIndex]}}/>
            <span className="mt-4 text-start">{translations?.loadingData}</span>
        </Box>
    )
};

export default GlobalLoader;