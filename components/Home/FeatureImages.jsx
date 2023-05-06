import React from "react";
import Image from "next/image";
import ilustration1 from '../../public/ilustration1.png';
import ilustration2 from '../../public/ilustration2.png';
import ilustration3 from '../../public/ilustration3.png';
import { Typography, createTheme , ThemeProvider } from "@mui/material";


const FeatureImages = () => {
    const typographyStyle = createTheme();
    typographyStyle.typography.h2 = {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
      textAlign: 'center',
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      '@media (min-width:768px)': {
        fontSize: '1.6rem',
      }
    };

    return (
        <div className="flex flex-col items-center w-full pt-16">

            <div className='flex lg:flex-row flex-wrap w-full items-center justify-center'>
                <div className='w-[300px] flex flex-col flex-none items-center m-5'>
                    <Image src={ilustration1} width={150} height={150} alt='Illustration 1'/>
                    <ThemeProvider theme={typographyStyle}>
                        <Typography gutterBottom 
                            variant="h2" 
                            component="h2" 
                        >
                            Stay Up-to-Date
                        </Typography>
                    </ThemeProvider>
                    <p className="text-center">Stay ahead of the curve with Dokuso's trend analysis.</p>
                </div>
                <div className='w-[300px] flex flex-col flex-none items-center m-5'>
                    <Image src={ilustration2} width={150} height={150} alt='Illustration 2' />
                    <ThemeProvider theme={typographyStyle}>
                        <Typography gutterBottom 
                            variant="h2" 
                            component="h2" 
                        >
                            Find Your Perfect Fit
                        </Typography>
                    </ThemeProvider>
                    <p className="text-center">Get recommendations based on your body type and style preferences.</p>
                </div>
                <div className='w-[300px] flex flex-col flex-none items-center m-5'>
                    <Image src={ilustration3} width={150} height={150} alt='Illustration 3' />
                    <ThemeProvider theme={typographyStyle}>
                        <Typography gutterBottom 
                            variant="h2" 
                            component="h2" 
                        >
                            Shop by Color and Material
                        </Typography>
                    </ThemeProvider>
                    <p className="text-center">Find exactly what you're looking for with Dokuso's advanced filtering options.</p>
                </div>
            </div>


        </div>
    )
};

export default FeatureImages;