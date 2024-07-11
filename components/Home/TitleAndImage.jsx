import React from "react";
import { ThemeProvider } from "@mui/material";
import { muiColors } from '../Utils/muiTheme';
import { useAppSelector } from "../../redux/hooks";
import EnglishTranslation from "./TitleTranslations/EnglishTranslation";
import SpanishTranslation from "./TitleTranslations/SpanishTranslation";
import FrenchTranslation from "./TitleTranslations/FrenchTranslation";
import ItalianTranslation from "./TitleTranslations/ItalianTranslation";

const TitleAndImage = () => {
    const { translations , language } = useAppSelector(state => state.region);
    return (
        <ThemeProvider theme={muiColors}>
        <section className="mt-12 pt-8 pb-4 px-4 w-full flex flex-col items-center max-w-[80%] mx-auto">
            <p className="text-5xl lg:text-6xl font-bold text-trendflow-black">
                {translations?.header?.title1}
                <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-trendflow-pink to-trendflow-blue">{translations?.header?.title2}</span>
            </p>
            <div className="mt-12 py-4 px-1 sm:px-0 sm:text-lg text-xl text-center text-trendflow-black">
                {language === 'en' && <EnglishTranslation/>}
                {language === 'es' && <SpanishTranslation/>}
                {language === 'fr' && <FrenchTranslation/>}
                {language === 'it' && <ItalianTranslation/>}
            </div>
        </section>
        </ThemeProvider>
    )
};

export default TitleAndImage;