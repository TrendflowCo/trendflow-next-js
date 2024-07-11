import React from "react";

const BrandFilter = ({setFilter,placeholder}) => {
    return (
        <div className="mt-4 flex flex-col">
            <input 
                className="bg-trendflow-black bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-4 pr-10 pl-5 relative flex-auto w-full items-center text-trendflow-black"
                type="text"
                placeholder={placeholder}
                style={{'fontFamily':"Arial, FontAwesome"}}
                onChange={(e) => {setFilter(e.target.value)}}
            />
        </div>
    )
};

export default BrandFilter;