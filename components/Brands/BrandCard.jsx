import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from "next/router";

const BrandCard = ({brand}) => {
    const router = useRouter();
    const {language , country} = useAppSelector(state => state.region);
    const handleSearchBrand = (brand) => {
        router.push(`/${country}/${language}/results?brands=${encodeURIComponent(brand)}`)
    };
    return (
            <button 
                className="p-4 flex flex-col items-center justify-center font-semibold items-center cursor-pointer rounded-lg hover:shadow hover:text-dokuso-pink hover:underline"
                onClick={() => {handleSearchBrand(brand)}}
            >
                {brand}
            </button>
    )
};

export default BrandCard;