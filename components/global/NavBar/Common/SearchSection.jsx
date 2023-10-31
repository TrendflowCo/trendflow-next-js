import React from "react";
import { useRouter } from "next/router";
import { useAppSelector , useAppDispatch } from "../../../../redux/hooks";
import { setCurrentSearch } from "../../../../redux/features/actions/search";
import { handleSearchQuery } from "../../../functions/handleSearchQuery";

const SearchSection = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations , country , language } = useAppSelector(state => state.region);
    const { currentSearch } = useAppSelector(state => state.search);
    const handleSearchPhrase = (e) => { // function for setting the phrase. Stores into global state
        dispatch(setCurrentSearch(e.target.value));
    };
    const handleEnterSearch = (e) => { // click ENTER into form -> redirects to SHOP NOW
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearchQuery(country , language , currentSearch , 'search' , router)
        }
    };
    
    return (
        <>
            { router.pathname.includes('results') && 
                <div className="flex flex-row items-center outline-none justify-center items-center w-full h-full relative mr-4">
                    <input 
                        className="bg-dokuso-black outline-none bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-2 pr-10 pl-5 relative flex-auto w-[120px] md:w-full items-center text-dokuso-black"
                        type="text"
                        placeholder={translations?.search?.placeholder}
                        value={currentSearch.split('-').join(' ')}
                        onChange={(e) => {handleSearchPhrase(e)}}
                        onKeyDown={handleEnterSearch}
                    />
                    <Tooltip title="Search query">
                    <IconButton 
                        onClick={() => {handleSearchQuery(language , currentSearch , 'search' , router)}} 
                        sx={{ p: 0 , width: '40px' , height: '40px', position: 'absolute', right: '0px' }}
                    >
                        <div className='h-[40px] w-[40px] rounded-r-[5px] bg-gradient-to-tl from-dokuso-pink to-dokuso-blue'>
                        <SearchIcon fontSize='medium' style={{'color': "#FAFAFA"}}/>
                        </div>
                    </IconButton>
                    </Tooltip>
                </div>
            }
        </>
    )
};

export default SearchSection;