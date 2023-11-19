import React, { useEffect, useState } from "react";
import countriesAndLanguagesOptions from "../Resources/countriesAndLanguagesOptions.json";
import LocationIcon from "../Common/Icons/LocationIcon";
import { enhanceText } from "../Utils/enhanceText";
import PositiveButton from "../Common/PositiveButton";
import { useRouter } from "next/router";

const ZoneModal = () => {
    const router = useRouter();
    useEffect(() => {
        if(router.isReady) {
            const currentCountry = router.query.zone;
            const currentLanguage = router.query.lan;
            const initialIndex = countriesAndLanguagesOptions.findIndex((item) => (item.country === currentCountry && item.language === currentLanguage))
            setSelectedOption(initialIndex)
        }
    },[])
    const [selectedOption , setSelectedOption] = useState(-1);
    return (
        <section className="bg-dokuso-black bg-opacity-10 w-screen h-screen fixed top-0 right-0 flex flex-col items-center justify-center">
            <div className="w-[40vw] h-[40vh] z-10 rounded-2xl shadow-xl bg-dokuso-white p-4 flex flex-col items-center justify-center">
                <div className="mb-4 w-[330px] px-2 flex flex-col items-start">
                    <h1 className="font-semibold text-xl mb-4">Select your region</h1>
                    {countriesAndLanguagesOptions.sort((a,b) => a.completeCountry.localeCompare(b.completeCountry)).map((singleOption,indexOption) => 
                        <div
                            key={indexOption}
                            className="flex flex-row h-10 items-center justify-start cursor-pointer hover:font-semibold"
                            onClick={() => setSelectedOption(indexOption)}
                        >
                            <LocationIcon/>
                            <span className={`ml-2 underline ${selectedOption === indexOption && 'text-dokuso-pink font-semibold'}`}>{`${singleOption.completeCountry.toUpperCase()} - ${enhanceText(singleOption.completeLanguage)}`}</span>                    
                        </div>
                    )}
                </div>
                <PositiveButton 
                    widths="w-[200px]"
                    text="Continue"
                    handleClick={() => router.push(`/${countriesAndLanguagesOptions[selectedOption].country}/${countriesAndLanguagesOptions[selectedOption].language}`)}
                    loading={false}
                />
            </div>
        </section>
    )
};

export default ZoneModal;