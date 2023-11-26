import React from "react";
import { useRouter } from "next/router";
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../services/firebase";

const PopularSearches = () => {
    const router = useRouter();
    const { translations , language , country } = useAppSelector(state => state.region);
    const dispatch = useAppDispatch();
    const handleQuickSearch = (val) => {
        logEvent(analytics, 'clickOnPopularSearches', {
            search_term: val
        });      
        dispatch(setCurrentSearch(val))
        router.push(`${country}/${language}/results?query=${val.split(' ').join('-').toLowerCase()}`)
    };
    
    return (
        <div className="flex flex-col items-center w-full pt-8">
            <div className="flex flex-col max-w-xl w-full items-start">
                <h1 className="text-dokuso-black text-2xl sm:text-3xl font-bold mb-3">
                    {translations?.popular_searches}
                </h1>
                <div className="flex-wrap flex flex-row justify-start">
                    {translations?.prompts && Object.values(translations?.prompts).map((prompt) => (
                        <button 
                            key={prompt}
                            type="button"  
                            onClick={() => {handleQuickSearch(prompt)}} 
                            value={prompt} 
                            className="px-6 py-3 border-2 border-dokuso-blue mr-1 mb-1 text-dokuso-blue font-semibold text-sm leading-tight uppercase rounded bg-dokuso-white hover:bg-dokuso-pink hover:bg-opacity-20 hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                        >
                            {prompt}
                        </button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};

export default PopularSearches;