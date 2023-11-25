import React from "react";
import { useAppSelector , useAppDispatch } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";
import { useRouter } from "next/router";

const RandomSearcher = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations , country , language } = useAppSelector(state => state.region);
    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        handleSearchQuery(country , language , val , 'clickOnPopularSearches' , router)
    };
    const handleSearchRandom = () => {
        const values = Object.values(translations?.prompts);
        const currentLength = values.length - 1;
        const random = Math.random();
        const finalValue = parseInt(random*(currentLength));
        handleQuickSearch(values[finalValue])
    };
    const hotList  = [
        'Barbie', 
        'Office attire', 
        'Art-inspired prints', 
        'Floral embroidery', 
        'Menswear-inspired tailoring', 
        'Statement accessories',
        'Halloween'
    ];


    return (
        <div className="flex flex-col items-center w-full items-center justify-center flex-wrap max-w-[80%] mx-auto">
            <section className=" w-full h-[280px] overflow-y-hidden mt-2 hover:overflow-y-auto hover:scrollbar">
                <div className="flex-wrap flex flex-col justify-start">
                    <p className="px-6 py-3 text-dokuso-black font-semibold text-base leading-tight hover:bg-dokuso-orange hover:bg-opacity-30 transition duration-300 ease-in-out cursor-pointer" 
                    onClick={() => handleSearchRandom()}>
                        {translations?.not_sure}
                    </p>
                    {translations?.prompts && Object.entries(translations?.prompts).sort().map(([key, prompt]) => (
                        <p 
                            key={`${prompt}${key}`}
                            type="button"  
                            onClick={() => {handleQuickSearch(prompt)}} 
                            value={prompt} 
                            className="px-6 py-3 text-dokuso-blue font-semibold text-base leading-tight hover:bg-dokuso-pink hover:bg-opacity-30 transition duration-300 ease-in-out cursor-pointer"
                        >
                            {hotList.includes(key) ? `${prompt} 🔥` : prompt}
                        </p>
                        ))
                    }
                </div>
            </section>
        </div>
    )
};

export default RandomSearcher;