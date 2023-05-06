import React from "react";
import Image from "next/image";
import homeImage from '../../public/homeImage.png';
import Typography from '@mui/material/Typography';
import { createTheme , ThemeProvider } from "@mui/material";


const TitleAndImage = () => {
    const typographyStyle = createTheme({
        palette: {
            tomato: '#FF6347',
            pink: {
              deep: '#FF1493',
              hot: '#FF69B4',
              medium: '#C71585',
              pale: '#DB7093',
              light: '#FFB6C1',
            },
            black: '#272727'
          },  
    });
    typographyStyle.typography.h1 = {
      fontSize: '3rem',
      fontWeight: 'bold',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      '@media (min-width:768px)': {
        fontSize: '4rem',
      }
    };
    return (
        <div className="flex flex-col items-center w-full pt-8 sm:pt-12">
            <div className="flex flex-col items-center max-w-xl ">
                <ThemeProvider theme={typographyStyle}>
                    <Typography
                        color="black"
                        variant="h1" 
                        component="h1" 
                    >
                        Stay Ahead of the Fashion Game
                    </Typography>
                    <Image
                        src={homeImage}
                        alt='homeImg'
                    />
                    <div className='mt-7 flex flex-row items-start w-full'>
                        <h4 className="text-3xl sm:text-2xl font-bold mr-0.5">{`Discover fashion with `}
                            <span className="ml-1 font-extrabold text-transparent sm:text-2xl text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">precision</span>
                        </h4>
                    </div>
                    <p className="py-4 px-1 sm:px-0 sm:text-lg text-xl">
                        Our search bar is your gateway to finding the perfect fashion items to fit your style.
                        Don't limit yourself to the same old searches. Try something new, unexpected, and uniquely you.
                    </p>
                </ThemeProvider>
            </div>
        </div>
    )
};

export default TitleAndImage;