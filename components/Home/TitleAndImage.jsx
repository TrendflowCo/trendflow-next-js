import React from "react";
import Image from "next/image";
import homeImage from '../../public/homeImage.png';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector } from "../../redux/hooks";

const TitleAndImage = () => {
    const { translations } = useAppSelector(state => state.region);
  
    return (
        <ThemeProvider theme={muiColors}>
        <section className="mt-12 pt-8 pb-4 lg:px-12 px-4 w-full h-fit bg-dokuso-white flex flex-col items-center">
            <p className="text-5xl lg:text-6xl font-bold text-dokuso-black">Stay ahead of the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-dokuso-pink to-dokuso-blue">fashion game</span></p>
            <div className="mt-12 py-4 px-1 sm:px-0 sm:text-lg text-xl text-center text-dokuso-black">
                Our search bar is your gateway to finding the <b>perfect</b> fashion items to fit <span className="font-bold text-dokuso-blue">your</span> style. Don&rsquo;t limit <b>yourself</b> to the same old searches.<br/>
                Try something <b>new</b>, <b>unexpected</b>, and <span className="text-dokuso-pink font-bold">uniquely</span> you.
            </div>
        </section>
        </ThemeProvider>
    )
};

export default TitleAndImage;