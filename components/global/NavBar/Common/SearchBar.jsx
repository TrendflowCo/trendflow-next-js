import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "../../../../redux/hooks";
import { setCurrentSearch } from "../../../../redux/features/actions/search";
import { handleSearchQuery } from "../../../functions/handleSearchQuery";
import { IconButton, Tooltip, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { translations, country, language } = useAppSelector(state => state.region);

    useEffect(() => {
        if (router.isReady) {
            const { query } = router.query;
            setSearchQuery(query ? decodeURIComponent(query) : "");
        }
    }, [router.isReady, router.query]);

    const handleSearchPhrase = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchQuery.trim() !== '') {
                router.push({
                    pathname: `/${country}/${language}/results`,
                    query: { query: searchQuery, page: 1 },
                });
            }
        }
    };

    return (
        <Paper
            component="form"
            sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: { xs: '100%', sm: '300px', md: '400px' }, 
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
                value={searchQuery}
                onChange={(e) => {handleSearchPhrase(e)}}
                onKeyDown={handleEnterSearch}
            />
            <Tooltip title="Search query">
                <IconButton 
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                    onClick={() => {
                        if (searchQuery.trim() !== '') {
                            router.push({
                                pathname: `/${country}/${language}/results`,
                                query: { query: searchQuery, page: 1 },
                            });
                        }
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}

export default SearchBar;