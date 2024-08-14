import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { setCurrentSearch } from "../../../../redux/features/actions/search";
import { handleSearchQuery } from "../../../functions/handleSearchQuery";
import { IconButton, Tooltip, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisualSearchModal from "../../../Common/VisualSearchModal";

const SearchBar = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { translations, country, language } = useAppSelector(state => state.region);
    const { currentSearch } = useAppSelector(state => state.search);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchPhrase = (e) => {
        dispatch(setCurrentSearch(e.target.value));
    };

    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchQuery(country, language, currentSearch, 'search', router);
        }
    };

    const handleVisualSearch = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleImageSelect = async (file) => {
        try {
            // TODO: Implement image upload and processing logic
            console.log("Image processed:", file);
            const searchTerm = `image:${file.name}`;
            dispatch(setCurrentSearch(searchTerm));
            handleSearchQuery(country, language, searchTerm, 'visual_search', router);
        } catch (error) {
            console.error("Error processing image:", error);
            // Handle error (e.g., show a toast notification)
        }
        setIsModalOpen(false);
    };

    return (
        <>
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
                    value={currentSearch.split('-').join(' ')}
                    onChange={handleSearchPhrase}
                    onKeyDown={handleEnterSearch}
                />
                <Tooltip title="Visual Search">
                    <IconButton 
                        sx={{ p: '10px' }}
                        aria-label="visual search"
                        onClick={handleVisualSearch}
                    >
                        <CameraAltIcon />
                    </IconButton>
                </Tooltip>
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
            <VisualSearchModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onImageSelect={handleImageSelect}
                translations={translations}
            />
        </>
    );
}

export default SearchBar;