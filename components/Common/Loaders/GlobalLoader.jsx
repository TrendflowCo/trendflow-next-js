import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

const GlobalLoader = () => {
    const colors = ['#318AFA', '#FA39BE', '#FAB332', '#262626'];
    const [colorIndex, setColorIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setColorIndex((prevColorIndex) => (prevColorIndex + 1) % colors.length);
        }, 1400);
    
        return () => clearInterval(interval);
      }, []);
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={72} thickness={4} sx={{color: colors[colorIndex]}}/>
            <span className="mt-4 text-start">Loading data</span>
        </Box>
    )
};

export default GlobalLoader;