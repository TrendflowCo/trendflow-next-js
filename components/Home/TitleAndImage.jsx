import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../redux/hooks";
import EnglishTranslation from "./TitleTranslations/EnglishTranslation";
import SpanishTranslation from "./TitleTranslations/SpanishTranslation";
import FrenchTranslation from "./TitleTranslations/FrenchTranslation";
import ItalianTranslation from "./TitleTranslations/ItalianTranslation";

const TitleAndImage = () => {
    const { translations, language } = useAppSelector(state => state.region);
    return (
        <section className="text-center mb-12">
            <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-trendflow-black mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {translations?.header?.title1}
                <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-trendflow-pink via-trendflow-blue to-trendflow-orange">
                    {translations?.header?.title2}
                </span>
            </motion.h1>
            <motion.p 
                className="text-xl text-trendflow-black max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {language === 'en' && <EnglishTranslation/>}
                {language === 'es' && <SpanishTranslation/>}
                {language === 'fr' && <FrenchTranslation/>}
                {language === 'it' && <ItalianTranslation/>}
            </motion.p>
        </section>
    )
};

export default TitleAndImage;