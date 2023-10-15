import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";

const Searcher = () => {
    const dispatch = useAppDispatch();
    const { currentSearch } = useAppSelector(state => state.search);
    const { translations , language } = useAppSelector(state => state.language);
    const hotList  = ['Barbie', 
        'Office attire', 
        'Art-inspired prints', 
        'Floral embroidery', 
        'Menswear-inspired tailoring', 
        'Statement accessories',
        'Halloween'
    ];
    const router = useRouter();
    const handleSearchPhrase = (e) => { // function for setting the phrase. Stores into global state
        dispatch(setCurrentSearch(e.target.value));
    };
    const handleButtonSearch = () => { // click into SHOP NOW button
        event.preventDefault();
        handleSearchQuery(language , currentSearch , 'search' , router)
    };
    const handleEnterSearch = (e) => { // click ENTER into form -> redirects to SHOP NOW
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };
    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        handleSearchQuery(language , val , 'clickOnPopularSearches' , router)
    };
    const handleSearchRandom = () => {
        const values = Object.values(translations?.prompts);
        const currentLength = values.length - 1;
        const random = Math.random();
        const finalValue = parseInt(random*(currentLength));
        handleQuickSearch(values[finalValue])
    };

    return (
        <div className="flex flex-col flex-auto items-center w-full mt-4">
            <div className="flex flex-row items-center justify-center flex-wrap items-center w-full lg:max-w-[50%] py-4">
                <section className="flex-auto w-full lg:w-fit px-4 md:px-0">
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
                    <input 
                        className="bg-dokuso-black bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-4 pr-10 pl-5 relative flex-auto w-full items-center text-dokuso-black"
                        type="text"
                        placeholder={translations?.search?.placeholder}
                        style={{'fontFamily':"Arial, FontAwesome"}}
                        onChange={(e) => {handleSearchPhrase(e)}}
                        onKeyDown={handleEnterSearch}
                    />
                </section>
                <section className="px-2 lg:mt-0 mt-6">
                    <ThemeProvider theme={muiColors}>
                        <Button 
                            className="text-dokuso-white hover:text-dokuso-black bg-gradient-to-r from-dokuso-pink to-dokuso-blue hover:from-dokuso-blue hover:to-dokuso-green" 
                            variant="contained" 
                            onClick={() => handleButtonSearch()} 
                            onKeyDown={(e) => {handleEnterSearch(e)}}
                            sx={{fontWeight: 'bold', height: '56px'}}
                            color="dokusoWhite"
                            style={{width:'92px'}}
                        >
                            Search
                        </Button>
                    </ThemeProvider>
                </section>
                <section className="w-full h-[280px] overflow-y-hidden mt-2 hover:overflow-y-auto hover:scrollbar">
                    <div className="flex-wrap flex flex-col justify-start">
                        <p className="px-6 py-3 text-dokuso-black font-semibold text-base leading-tight hover:bg-dokuso-orange hover:bg-opacity-30 transition duration-300 ease-in-out cursor-pointer" 
                        onClick={() => handleSearchRandom()}>
                            {/* {`Not sure what to search? Start with something random!`} */}
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
                                {/* {prompt} */}
                                {hotList.includes(key) ? `${prompt} 🔥` : prompt}
                            </p>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    
    )
};

export default Searcher;