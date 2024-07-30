import React from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { setCurrentSearch } from "../../../../redux/features/actions/search";
import { handleSearchQuery } from "../../../functions/handleSearchQuery";
import { IconButton, Tooltip, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations, country, language } = useAppSelector(state => state.region);
    const { currentSearch } = useAppSelector(state => state.search);

    const handleSearchPhrase = (e) => {
        dispatch(setCurrentSearch(e.target.value));
    };

    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchQuery(country, language, currentSearch, 'search', router);
        }
    };

    return (
        <Paper
            component="form"
            sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: 400, 
                borderRadius: '20px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                '&:focus-within': {
                    boxShadow: '0 0 0 2px rgba(255, 105, 180, 0.3)',
                },
            }}
        >
            <InputBase
                sx={{ 
                    ml: 1, 
                    flex: 1,
                    '& .MuiInputBase-input': {
                        outline: 'none',
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                    },
                }}
                placeholder={translations?.search?.placeholder}
                value={currentSearch.split('-').join(' ')}
                onChange={(e) => {handleSearchPhrase(e)}}
                onKeyDown={handleEnterSearch}
            />
            <Tooltip title="Search query">
                <IconButton 
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                    onClick={() => {handleSearchQuery(language, currentSearch, 'search', router)}}
                >
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}

export default SearchBar;