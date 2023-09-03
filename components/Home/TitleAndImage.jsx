import React from "react";
import Image from "next/image";
import homeImage from '../../public/homeImage.png';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector } from "../../redux/hooks";

const TitleAndImage = () => {
    const { translations } = useAppSelector(state => state.language);
    // muiColors.typography.h1 = {
    //   fontSize: '3rem',
    //   fontWeight: 'bold',
    //   lineHeight: 1.167,
    //   letterSpacing: '-0.01562em',
    //   color: muiColors.palette.dokusoBlack.main,
    //   fontFamily: [
    //     'Roboto',
    //     '"Helvetica Neue"',
    //     'Arial',
    //     'sans-serif',
    //   ].join(','),
    //   '@media (min-width:768px)': {
    //     fontSize: '4rem',
    //   }
    // };
  
    return (
        <ThemeProvider theme={muiColors}>
        <section className="mt-28 w-full h-fit bg-dokuso-white flex flex-col px-12 items-center mb-8">
            <p className="text-6xl font-bold text-dokuso-black">Stay ahead of the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-dokuso-pink to-dokuso-blue">fashion game</span></p>
            <p className="mt-8 py-4 px-1 sm:px-0 sm:text-lg text-xl text-center">
                Our search bar is your gateway to finding the <b>perfect</b> fashion items to fit <span className="font-bold text-dokuso-blue">your</span> style.<br/>Don't limit <b>yourself</b> to the same old searches.<br/>Try something <b>new</b>, <b>unexpected</b>, and <span className="text-dokuso-pink font-bold">uniquely</span> you.
            </p>
        </section>
        </ThemeProvider>
        // <div className="flex flex-col items-center w-full pt-8 sm:pt-12 text-dokuso-black">
        //     <div className="flex flex-col items-center max-w-xl ">
        //         <ThemeProvider theme={muiColors}>
        //             <Typography
        //                 variant="h1" 
        //                 component="h1" 
        //             >
        //                 {translations?.header?.title}
        //             </Typography>
        //             <Image
        //                 src={homeImage}
        //                 alt='homeImg'
        //                 width={"100%"}
        //                 height={"100%"}
        //             />
        //             <div className='mt-7 flex flex-row items-start w-full'>
        //                 <h4 className="text-3xl sm:text-2xl font-bold mr-0.5">
        //                     {`${translations?.search?.title} `}
        //                     <span 
        //                     className="ml-1 font-extrabold text-transparent sm:text-2xl text-3xl bg-clip-text bg-gradient-to-r from-dokuso-pink to-dokuso-blue">
        //                         {translations?.search?.precision}
        //                     </span>
        //                 </h4>
        //             </div>
        //             <p className="py-4 px-1 sm:px-0 sm:text-lg text-xl">
        //                 {translations?.search?.text}
        //             </p>
        //         </ThemeProvider>
        //     </div>
        // </div>
    )
};

export default TitleAndImage;