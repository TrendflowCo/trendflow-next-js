import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import { handleSearchQuery } from "../functions/handleSearchQuery";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaSearch, FaCamera } from "react-icons/fa";
import VisualSearchModal from "../Common/VisualSearchModal";

const Searcher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { translations, language, country } = useAppSelector(state => state.region);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            dispatch(setCurrentSearch(searchTerm));
            handleSearchQuery(country, language, searchTerm, 'search', router);
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
            <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={translations?.search?.placeholder}
                        className="w-full px-6 py-4 text-lg border-2 border-trendflow-blue rounded-full focus:outline-none focus:ring-2 focus:ring-trendflow-pink placeholder-gray-400 shadow-lg pr-32"
                    />
                    <div className="absolute right-2 top-2 flex">
                        <motion.button
                            type="button"
                            onClick={handleVisualSearch}
                            className="p-3 bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white rounded-full hover:shadow-lg transition-all duration-300 mr-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaCamera className="text-xl" />
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="p-3 bg-gradient-to-r from-trendflow-pink to-trendflow-blue text-white rounded-full hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSearch className="text-xl" />
                        </motion.button>
                    </div>
                </div>
            </form>
            <VisualSearchModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onImageSelect={handleImageSelect}
                translations={translations}
            />
        </>
    );
};

export default Searcher;