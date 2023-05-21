import React from "react";
import Image from "next/image";
import { Typography , ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector } from "../../redux/hooks";

const FeatureImages = () => {
    const { translations } = useAppSelector(state => state.language);
    muiColors.typography.h2 = {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
      color: muiColors.palette.dokusoBlack.main,
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
    const titles = [translations?.features?.feature1?.title,translations?.features?.feature2?.title,translations?.features?.feature3?.title];
    const subTitles = [translations?.features?.feature1?.text,translations?.features?.feature2?.text,translations?.features?.feature3?.text];

    return (
        <div className="flex flex-col items-center w-full pt-16">
            <div className='flex lg:flex-row flex-wrap w-full items-center justify-center'>
                {titles.map((itemTitle, indexTitle) => {return (
                    <div key={indexTitle} className='w-[300px] flex flex-col flex-none items-center m-5'>
                        <Image src={`/ilustration${indexTitle+1}.png`} className="mb-5" width={150} height={150} alt={`illustration${indexTitle+1}`}/>
                        <ThemeProvider theme={muiColors}>
                            <Typography gutterBottom 
                                variant="h2" 
                                component="h2" 
                            >
                                {itemTitle}
                            </Typography>
                        </ThemeProvider>
                        <p className="text-center text-dokuso-black">{subTitles[indexTitle]}</p>
                    </div>
                )})}
            </div>
        </div>
    )
};

export default FeatureImages;