import React from "react";
import Image from "next/image";
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
    const titles = ["Stay Up-to-Date","Find Your Perfect Fit","Shop by Color and Material"];
    const subTitles = [
        "Stay ahead of the curve with Dokuso's trend analysis.",
        "Get recommendations based on your body type and style preferences.",
        "Find exactly what you're looking for with Dokuso's advanced filtering options."
    ];

    return (
        <div className="flex flex-col items-center w-full pt-16">
            <div className='flex lg:flex-row flex-wrap w-full items-center justify-center'>
                {titles.map((itemTitle, indexTitle) => {return (
                    <div key={indexTitle} className='w-[300px] flex flex-col flex-none items-center m-5'>
                        <Image src={`/ilustration${indexTitle+1}.png`} className="mb-5" width={150} height={150} alt={`illustration${indexTitle+1}`}/>
                        <ThemeProvider theme={typographyStyle}>
                            <Typography gutterBottom 
                                variant="h2" 
                                component="h2" 
                            >
                                {itemTitle}
                            </Typography>
                        </ThemeProvider>
                        <p className="text-center">{subTitles[indexTitle]}</p>
                    </div>
                )})}
            </div>
        </div>
    )
};

export default FeatureImages;