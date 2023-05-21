import React from "react";
import { useRouter } from "next/router";
import { popularSearches } from "../Utils/popularSearches";
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";

const PopularSearches = () => {
    const router = useRouter();
    const { translations } = useAppSelector(state => state.language);
    const dispatch = useAppDispatch();
    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        router.push(`/results/${val.split(' ').join('-')}`)
    };
    
    return (
        <div className="flex flex-col items-center w-full pt-8">
            <div className="flex flex-col max-w-xl w-full items-start">
                <h1 className="text-dokuso-black text-2xl sm:text-3xl font-bold mb-3">
                    {translations?.popular_searches}
                </h1>
                <div className="flex-wrap">
                    {popularSearches.map((prompt) => (
                        <button 
                            key={prompt}
                            type="button"  
                            onClick={() => {handleQuickSearch(prompt)}} 
                            value={prompt} 
                            className="px-6 py-2 border-2 border-dokuso-blue mr-1 mb-1 text-dokuso-blue font-semibold text-sm leading-tight uppercase rounded bg-dokuso-white hover:bg-dokuso-pink hover:bg-opacity-20 hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
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